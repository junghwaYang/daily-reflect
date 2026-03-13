use base64::{engine::general_purpose, Engine as _};
use chrono::Local;
use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct CreateOrUpdateFile {
    message: String,
    content: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    sha: Option<String>,
}

#[derive(Deserialize)]
struct GitHubFileResponse {
    sha: String,
}

pub async fn push_to_github(
    token: &str,
    owner: &str,
    repo: &str,
    content: &str,
    folder: &str,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(30))
        .build()
        .map_err(|e| Box::new(e) as Box<dyn std::error::Error + Send + Sync>)?;
    let date = Local::now().format("%Y-%m-%d").to_string();
    let path = format!("{}/{}.md", folder, date);

    let existing_sha = get_file_sha(&client, token, owner, repo, &path)
        .await
        .ok();

    let encoded_content = general_purpose::STANDARD.encode(content.as_bytes());

    let body = CreateOrUpdateFile {
        message: format!("retrospect: {} 회고", date),
        content: encoded_content,
        sha: existing_sha,
    };

    let url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}",
        owner, repo, path
    );

    let response = client
        .put(&url)
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "DailyReflect-Agent")
        .header("Accept", "application/vnd.github+json")
        .json(&body)
        .send()
        .await?;

    if response.status().is_success() {
        log::info!("GitHub에 회고글 업로드 완료: {}", path);
        Ok(())
    } else {
        let error_text = response.text().await?;
        Err(format!("GitHub API 에러: {}", error_text).into())
    }
}

async fn get_file_sha(
    client: &reqwest::Client,
    token: &str,
    owner: &str,
    repo: &str,
    path: &str,
) -> Result<String, Box<dyn std::error::Error + Send + Sync>> {
    let url = format!(
        "https://api.github.com/repos/{}/{}/contents/{}",
        owner, repo, path
    );

    let response = client
        .get(&url)
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "DailyReflect-Agent")
        .header("Accept", "application/vnd.github+json")
        .send()
        .await?;

    if !response.status().is_success() {
        return Err("File not found".into());
    }

    let file_resp = response.json::<GitHubFileResponse>().await?;
    Ok(file_resp.sha)
}
