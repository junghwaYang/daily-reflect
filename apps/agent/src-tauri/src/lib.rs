mod ai;
mod buffer;
mod config;
mod github;
mod notion;
mod tracker;
mod tray;

use buffer::{ActivityBuffer, RetroEntry};
use config::{AppConfig, AppState};
use serde::Serialize;
use std::sync::Arc;
use tauri::{AppHandle, Manager, RunEvent};
use tracker::AwClient;

#[derive(Debug, Clone, Serialize)]
struct StatusInfo {
    aw_connected: bool,
    is_configured: bool,
    today_count: usize,
    today_active_minutes: u64,
    today_idle_minutes: u64,
    storage_type: String,
    save_local: bool,
    save_github: bool,
    save_notion: bool,
    last_retro_date: Option<String>,
}

#[tauri::command]
fn get_status(
    state: tauri::State<'_, AppState>,
    buffer: tauri::State<'_, Arc<ActivityBuffer>>,
) -> Result<StatusInfo, String> {
    let (is_configured, save_local, save_github, save_notion, storage_label) = {
        let config = state.config.lock().map_err(|e| e.to_string())?;
        let mut labels = Vec::new();
        if config.save_local { labels.push("local"); }
        if config.save_github { labels.push("GitHub"); }
        if config.save_notion { labels.push("Notion"); }
        let label = if labels.is_empty() { "none".to_string() } else { labels.join(" + ") };
        (!config.gemini_api_key.is_empty(), config.save_local, config.save_github, config.save_notion, label)
    };

    let last_retro_date = buffer
        .get_recent_retrospectives(1)
        .ok()
        .and_then(|r| r.into_iter().next())
        .map(|r| r.date);

    Ok(StatusInfo {
        aw_connected: false, // Updated by separate get_aw_stats call
        is_configured,
        today_count: 0,
        today_active_minutes: 0,
        today_idle_minutes: 0,
        storage_type: storage_label,
        save_local,
        save_github,
        save_notion,
        last_retro_date,
    })
}

#[tauri::command]
fn get_aw_stats(
    state: tauri::State<'_, AppState>,
) -> Result<tracker::AwDayStats, String> {
    let aw_base = state
        .config
        .lock()
        .map(|c| c.aw_api_base.clone())
        .unwrap_or_else(|_| "http://127.0.0.1:5600/api/0".to_string());

    let aw = AwClient::new(&aw_base);
    Ok(aw.get_today_stats())
}

#[tauri::command]
fn set_config(
    state: tauri::State<'_, AppState>,
    gemini_api_key: Option<String>,
    retro_tone: Option<String>,
    custom_tone: Option<String>,
    retro_language: Option<String>,
    retro_time: Option<String>,
    storage_type: Option<String>,
    save_local: Option<bool>,
    save_github: Option<bool>,
    save_notion: Option<bool>,
    local_save_path: Option<String>,
    github_token: Option<String>,
    github_owner: Option<String>,
    github_repo: Option<String>,
    github_folder: Option<String>,
    notion_token: Option<String>,
    notion_database_id: Option<String>,
    excluded_apps: Option<Vec<String>>,
    aw_api_base: Option<String>,
) -> Result<(), String> {
    let mut config = state.config.lock().map_err(|e| e.to_string())?;

    if let Some(v) = gemini_api_key {
        config.gemini_api_key = v;
    }
    if let Some(v) = retro_tone {
        config.retro_tone = v;
    }
    if let Some(v) = custom_tone {
        config.custom_tone = v;
    }
    if let Some(v) = retro_language {
        config.retro_language = v;
    }
    if let Some(v) = retro_time {
        config.retro_time = v;
    }
    if let Some(v) = storage_type {
        config.storage_type = v;
    }
    if let Some(v) = save_local {
        config.save_local = v;
    }
    if let Some(v) = save_github {
        config.save_github = v;
    }
    if let Some(v) = save_notion {
        config.save_notion = v;
    }
    if let Some(v) = local_save_path {
        config.local_save_path = v;
    }
    if let Some(v) = github_token {
        config.github_token = v;
    }
    if let Some(v) = github_owner {
        config.github_owner = v;
    }
    if let Some(v) = github_repo {
        config.github_repo = v;
    }
    if let Some(v) = github_folder {
        config.github_folder = v;
    }
    if let Some(v) = notion_token {
        config.notion_token = v;
    }
    if let Some(v) = notion_database_id {
        config.notion_database_id = v;
    }
    if let Some(v) = excluded_apps {
        config.excluded_apps = v;
    }
    if let Some(v) = aw_api_base {
        config.aw_api_base = v;
    }

    config.save()
}

#[tauri::command]
fn get_config(state: tauri::State<'_, AppState>) -> Result<AppConfig, String> {
    let config = state.config.lock().map_err(|e| e.to_string())?;
    Ok(config.clone())
}

#[tauri::command]
fn get_today_activities(
    state: tauri::State<'_, AppState>,
    aw: tauri::State<'_, Arc<AwClient>>,
) -> Result<String, String> {
    let (date, excluded) = {
        let config = state.config.lock().map_err(|e| e.to_string())?;
        (
            ActivityBuffer::today_date_str(),
            config.excluded_apps.clone(),
        )
    };
    aw.get_daily_summary(&date, &excluded)
}

#[tauri::command]
fn check_aw_connection(
    aw: tauri::State<'_, Arc<AwClient>>,
) -> Result<bool, String> {
    Ok(aw.is_connected())
}

#[tauri::command]
async fn generate_now(
    buffer: tauri::State<'_, Arc<ActivityBuffer>>,
    state: tauri::State<'_, AppState>,
    aw: tauri::State<'_, Arc<AwClient>>,
) -> Result<String, String> {
    let config = state.config.lock().map_err(|e| e.to_string())?.clone();
    do_generate_retrospective(&buffer, &config, &aw).await
}


#[tauri::command]
fn get_recent_retros(
    buffer: tauri::State<'_, Arc<ActivityBuffer>>,
) -> Result<Vec<RetroEntry>, String> {
    buffer.get_recent_retrospectives(10)
}

// --- Folder picker ---

#[tauri::command]
async fn select_save_folder(app: AppHandle) -> Result<Option<String>, String> {
    use tauri_plugin_dialog::DialogExt;
    let folder = app.dialog().file().blocking_pick_folder();
    Ok(folder.map(|f| f.to_string()))
}

// --- GitHub UX ---

#[derive(serde::Serialize)]
struct GitHubRepo {
    full_name: String,
    name: String,
    owner: String,
    private: bool,
}

#[derive(serde::Deserialize)]
struct GitHubRepoResponse {
    full_name: String,
    name: String,
    owner: GitHubOwner,
    private: bool,
}

#[derive(serde::Deserialize)]
struct GitHubOwner {
    login: String,
}

#[tauri::command]
async fn open_github_token_page(app: AppHandle) -> Result<(), String> {
    let url = "https://github.com/settings/tokens/new?scopes=repo&description=DailyReflect";
    tauri_plugin_shell::ShellExt::shell(&app)
        .open(url, None)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn fetch_github_repos(token: String) -> Result<Vec<GitHubRepo>, String> {
    let client = reqwest::Client::new();
    let response = client
        .get("https://api.github.com/user/repos?sort=updated&per_page=30")
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "DailyReflect-Agent")
        .header("Accept", "application/vnd.github+json")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err("토큰이 유효하지 않습니다".to_string());
    }

    let repos: Vec<GitHubRepoResponse> = response.json().await.map_err(|e| e.to_string())?;
    Ok(repos
        .into_iter()
        .map(|r| GitHubRepo {
            full_name: r.full_name,
            name: r.name,
            owner: r.owner.login,
            private: r.private,
        })
        .collect())
}

#[tauri::command]
async fn test_github_connection(
    token: String,
    owner: String,
    repo: String,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!("https://api.github.com/repos/{}/{}", owner, repo);
    let response = client
        .get(&url)
        .header("Authorization", format!("Bearer {}", token))
        .header("User-Agent", "DailyReflect-Agent")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok("연결 성공".to_string())
    } else {
        Err("레포에 접근할 수 없습니다".to_string())
    }
}

// --- Notion UX ---

#[derive(serde::Serialize)]
struct NotionDatabase {
    id: String,
    title: String,
}

#[tauri::command]
async fn open_notion_integration_page(app: AppHandle) -> Result<(), String> {
    let url = "https://www.notion.so/profile/integrations/new/internal";
    tauri_plugin_shell::ShellExt::shell(&app)
        .open(url, None)
        .map_err(|e| e.to_string())
}

#[tauri::command]
async fn fetch_notion_databases(token: String) -> Result<Vec<NotionDatabase>, String> {
    let client = reqwest::Client::new();
    let payload = serde_json::json!({
        "filter": { "property": "object", "value": "database" },
        "page_size": 20
    });

    let response = client
        .post("https://api.notion.com/v1/search")
        .header("Authorization", format!("Bearer {}", token))
        .header("Notion-Version", "2022-06-28")
        .header("Content-Type", "application/json")
        .json(&payload)
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if !response.status().is_success() {
        return Err("토큰이 유효하지 않습니다".to_string());
    }

    let body: serde_json::Value = response.json().await.map_err(|e| e.to_string())?;
    let results = body["results"]
        .as_array()
        .ok_or("결과 파싱 실패".to_string())?;

    let databases = results
        .iter()
        .filter_map(|db| {
            let id = db["id"].as_str()?.to_string();
            let title = db["title"]
                .as_array()
                .and_then(|t| t.first())
                .and_then(|t| t["plain_text"].as_str())
                .unwrap_or("Untitled")
                .to_string();
            Some(NotionDatabase { id, title })
        })
        .collect();

    Ok(databases)
}

#[tauri::command]
async fn test_notion_connection(
    token: String,
    database_id: String,
) -> Result<String, String> {
    let client = reqwest::Client::new();
    let url = format!("https://api.notion.com/v1/databases/{}", database_id);
    let response = client
        .get(&url)
        .header("Authorization", format!("Bearer {}", token))
        .header("Notion-Version", "2022-06-28")
        .send()
        .await
        .map_err(|e| e.to_string())?;

    if response.status().is_success() {
        Ok("연결 성공".to_string())
    } else {
        Err("데이터베이스에 접근할 수 없습니다".to_string())
    }
}

// --- Local file save helper ---

fn save_retro_to_file(
    path: &str,
    date: &str,
    content: &str,
) -> Result<(), Box<dyn std::error::Error>> {
    let base = std::path::PathBuf::from(path);
    let year = &date[..4];
    let dir = base.join(year);
    std::fs::create_dir_all(&dir)?;
    let file_path = dir.join(format!("{}.md", date));
    std::fs::write(file_path, content)?;
    Ok(())
}

/// Core retrospective generation logic
pub async fn do_generate_retrospective(
    buffer: &ActivityBuffer,
    config: &AppConfig,
    aw: &AwClient,
) -> Result<String, String> {
    if config.gemini_api_key.is_empty() {
        return Err("Gemini API 키가 설정되지 않았습니다.".to_string());
    }

    let date = ActivityBuffer::today_date_str();
    let activities = aw.get_daily_summary(&date, &config.excluded_apps)?;

    if activities.contains("기록된 활동이 없습니다") {
        return Err("오늘 기록된 활동이 없습니다.".to_string());
    }

    // Generate retrospective via Gemini
    let content = ai::generate_retrospective(
        &config.gemini_api_key,
        &activities,
        &config.retro_tone,
        &config.custom_tone,
        &config.retro_language,
    )
    .await
    .map_err(|e| format!("AI 생성 실패: {}", e))?;

    // Save to SQLite buffer (always)
    buffer.save_retrospective(&date, &content)?;
    log::info!("회고글 로컬 저장 완료: {}", date);

    // Save to local markdown file
    if config.save_local {
        if let Err(e) = save_retro_to_file(&config.local_save_path, &date, &content) {
            log::error!("로컬 파일 저장 실패: {}", e);
        } else {
            log::info!(
                "로컬 파일 저장 완료: {}/{}/{}.md",
                config.local_save_path,
                &date[..4],
                date
            );
        }
    }

    // Push to GitHub
    if config.save_github {
        if !config.github_token.is_empty()
            && !config.github_owner.is_empty()
            && !config.github_repo.is_empty()
        {
            match github::push_to_github(
                &config.github_token,
                &config.github_owner,
                &config.github_repo,
                &content,
                &config.github_folder,
            )
            .await
            {
                Ok(()) => {
                    let _ = buffer.mark_pushed_github(&date);
                    log::info!("GitHub 푸시 완료");
                }
                Err(e) => {
                    log::error!("GitHub 푸시 실패: {}", e);
                }
            }
        }
    }

    // Push to Notion
    if config.save_notion {
        if !config.notion_token.is_empty() && !config.notion_database_id.is_empty() {
            match notion::push_to_notion(
                &config.notion_token,
                &config.notion_database_id,
                &content,
            )
            .await
            {
                Ok(()) => {
                    let _ = buffer.mark_pushed_notion(&date);
                    log::info!("Notion 푸시 완료");
                }
                Err(e) => {
                    log::error!("Notion 푸시 실패: {}", e);
                }
            }
        }
    }

    Ok(content)
}

pub fn run() {
    env_logger::init();

    let buffer = Arc::new(
        ActivityBuffer::new().expect("Failed to initialize activity buffer"),
    );

    let app_state = AppState::new();
    let aw_base = app_state
        .config
        .lock()
        .map(|c| c.aw_api_base.clone())
        .unwrap_or_else(|_| "http://127.0.0.1:5600/api/0".to_string());
    let aw_client = Arc::new(AwClient::new(&aw_base));

    let app = tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .manage(app_state)
        .manage(buffer.clone())
        .manage(aw_client)
        .invoke_handler(tauri::generate_handler![
            get_status,
            get_aw_stats,
            set_config,
            get_config,
            get_today_activities,
            check_aw_connection,
            generate_now,
            get_recent_retros,
            select_save_folder,
            open_github_token_page,
            fetch_github_repos,
            test_github_connection,
            open_notion_integration_page,
            fetch_notion_databases,
            test_notion_connection,
        ])
        .setup(move |app| {
            let handle = app.handle().clone();

            // Setup tray menu
            if let Err(e) = tray::create_tray_menu(&handle) {
                log::error!("Failed to create tray menu: {}", e);
            }

            // Register tray menu event handler
            let tray_handle = handle.clone();
            if let Some(tray) = app.tray_by_id("main") {
                tray.on_menu_event(move |_app, event| {
                    tray::handle_tray_menu_event(&tray_handle, event.id().as_ref());
                });
            }

            // Start daily retrospective generation task
            let retro_handle = handle.clone();
            let retro_buffer = buffer.clone();
            tauri::async_runtime::spawn(async move {
                retro_schedule_loop(retro_handle, retro_buffer).await;
            });

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("Error while building Tauri application");

    app.run(|_app_handle, event| {
        if let RunEvent::ExitRequested { api, .. } = event {
            api.prevent_exit();
        }
    });
}

/// Scheduled retrospective generation loop
async fn retro_schedule_loop(handle: tauri::AppHandle, buffer: Arc<ActivityBuffer>) {
    use chrono::Local;

    let mut last_generated_date = String::new();

    loop {
        tokio::time::sleep(tokio::time::Duration::from_secs(60)).await;

        let config = match handle.state::<AppState>().config.lock() {
            Ok(c) => c.clone(),
            Err(_) => continue,
        };

        if config.gemini_api_key.is_empty() {
            continue;
        }

        let now = Local::now();
        let current_time = now.format("%H:%M").to_string();
        let current_date = now.format("%Y-%m-%d").to_string();

        if current_time == config.retro_time && last_generated_date != current_date {
            log::info!("스케줄된 회고글 생성 시작: {}", current_date);

            let aw = handle.state::<Arc<AwClient>>();
            match do_generate_retrospective(&buffer, &config, &aw).await {
                Ok(content) => {
                    last_generated_date = current_date.clone();
                    log::info!(
                        "스케줄된 회고글 생성 완료: {} ({} bytes)",
                        current_date,
                        content.len()
                    );
                }
                Err(e) => {
                    log::error!("스케줄된 회고글 생성 실패: {}", e);
                }
            }
        }
    }
}
