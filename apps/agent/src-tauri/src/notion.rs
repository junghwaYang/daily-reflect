use chrono::Local;
use reqwest;
use serde_json::json;

pub async fn push_to_notion(
    token: &str,
    database_id: &str,
    content: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error + Send + Sync>)?;
    let date = Local::now().format("%Y-%m-%d").to_string();

    let blocks = markdown_to_notion_blocks(content);
    let max_blocks = 100usize;

    let initial_blocks: Vec<serde_json::Value> = blocks.iter().take(max_blocks).cloned().collect();
    let remaining_blocks: Vec<serde_json::Value> = blocks.iter().skip(max_blocks).cloned().collect();

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
        "children": initial_blocks
    });

    let response = client
        .post("https://api.notion.com/v1/pages")
        .header("Authorization", format!("Bearer {}", token))
        .header("Notion-Version", "2022-06-28")
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await?;

    if !response.status().is_success() {
        let error_text = response.text().await?;
        return Err(format!("Notion API 에러: {}", error_text).into());
    }

    let created_page: serde_json::Value = response.json().await?;
    let page_id = created_page
        .get("id")
        .and_then(serde_json::Value::as_str)
        .ok_or("Notion API 에러: 생성된 페이지 ID를 찾을 수 없습니다")?;

    for chunk in remaining_blocks.chunks(max_blocks) {
        let append_payload = json!({
            "children": chunk
        });

        let append_response = client
            .patch(format!("https://api.notion.com/v1/blocks/{}/children", page_id))
            .header("Authorization", format!("Bearer {}", token))
            .header("Notion-Version", "2022-06-28")
            .header("Content-Type", "application/json")
            .json(&append_payload)
            .send()
            .await?;

        if !append_response.status().is_success() {
            let error_text = append_response.text().await?;
            return Err(format!("Notion append API 에러: {}", error_text).into());
        }
    }

    log::info!("Notion에 회고글 업로드 완료: {} 회고", date);
    Ok(())
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
