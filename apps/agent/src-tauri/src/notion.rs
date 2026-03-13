use chrono::Local;
use reqwest;
use serde_json::json;

pub async fn push_to_notion(
    token: &str,
    database_id: &str,
    content: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::new();
    let date = Local::now().format("%Y-%m-%d").to_string();

    let blocks = markdown_to_notion_blocks(content);

    let payload = json!({
        "parent": { "database_id": database_id },
        "properties": {
            "제목": {
                "title": [{ "text": { "content": format!("{} 회고", date) } }]
            },
            "날짜": {
                "date": { "start": date }
            }
        },
        "children": blocks
    });

    let response = client
        .post("https://api.notion.com/v1/pages")
        .header("Authorization", format!("Bearer {}", token))
        .header("Notion-Version", "2022-06-28")
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await?;

    if response.status().is_success() {
        log::info!("Notion에 회고글 업로드 완료: {} 회고", date);
        Ok(())
    } else {
        let error_text = response.text().await?;
        Err(format!("Notion API 에러: {}", error_text).into())
    }
}

fn markdown_to_notion_blocks(markdown: &str) -> Vec<serde_json::Value> {
    let mut blocks = Vec::new();

    for line in markdown.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }

        if trimmed.starts_with("### ") {
            blocks.push(json!({
                "object": "block",
                "type": "heading_3",
                "heading_3": {
                    "rich_text": [{ "type": "text", "text": { "content": &trimmed[4..] } }]
                }
            }));
        } else if trimmed.starts_with("## ") {
            blocks.push(json!({
                "object": "block",
                "type": "heading_2",
                "heading_2": {
                    "rich_text": [{ "type": "text", "text": { "content": &trimmed[3..] } }]
                }
            }));
        } else if trimmed.starts_with("- ") {
            blocks.push(json!({
                "object": "block",
                "type": "bulleted_list_item",
                "bulleted_list_item": {
                    "rich_text": [{ "type": "text", "text": { "content": &trimmed[2..] } }]
                }
            }));
        } else {
            blocks.push(json!({
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{ "type": "text", "text": { "content": trimmed } }]
                }
            }));
        }
    }

    blocks
}
