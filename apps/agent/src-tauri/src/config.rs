use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppConfig {
    // ActivityWatch
    #[serde(default = "default_aw_api_base")]
    pub aw_api_base: String,
    pub excluded_apps: Vec<String>,

    // AI
    #[serde(default)]
    pub gemini_api_key: String,
    #[serde(default = "default_tone")]
    pub retro_tone: String,
    #[serde(default = "default_language")]
    pub retro_language: String,
    #[serde(default)]
    pub custom_tone: String,
    #[serde(default = "default_retro_time")]
    pub retro_time: String,

    // Storage (multi-select booleans)
    #[serde(default = "default_true")]
    pub save_local: bool,
    #[serde(default)]
    pub save_github: bool,
    #[serde(default)]
    pub save_notion: bool,
    #[serde(default = "default_local_save_path")]
    pub local_save_path: String,

    // Legacy: keep for migration, but ignored in new logic
    #[serde(default = "default_storage_type")]
    pub storage_type: String,

    // GitHub
    #[serde(default)]
    pub github_token: String,
    #[serde(default)]
    pub github_owner: String,
    #[serde(default)]
    pub github_repo: String,
    #[serde(default = "default_github_folder")]
    pub github_folder: String,

    // Notion
    #[serde(default)]
    pub notion_token: String,
    #[serde(default)]
    pub notion_database_id: String,

    // Legacy fields (kept for deserialization compatibility, ignored)
    #[serde(default)]
    pub tracking_enabled: bool,
    #[serde(default)]
    pub poll_interval_secs: u64,
    #[serde(default)]
    pub idle_threshold_secs: u64,
}

fn default_aw_api_base() -> String {
    "http://127.0.0.1:5600/api/0".to_string()
}
fn default_tone() -> String {
    "diary".to_string()
}
fn default_language() -> String {
    "ko".to_string()
}
fn default_retro_time() -> String {
    "23:50".to_string()
}
fn default_storage_type() -> String {
    "local".to_string()
}
fn default_github_folder() -> String {
    "retrospectives".to_string()
}
fn default_true() -> bool {
    true
}
fn default_local_save_path() -> String {
    dirs::document_dir()
        .unwrap_or_default()
        .join("DailyReflect")
        .to_string_lossy()
        .to_string()
}

impl Default for AppConfig {
    fn default() -> Self {
        Self {
            aw_api_base: default_aw_api_base(),
            excluded_apps: vec![],
            gemini_api_key: String::new(),
            retro_tone: default_tone(),
            custom_tone: String::new(),
            retro_language: default_language(),
            retro_time: default_retro_time(),
            save_local: true,
            save_github: false,
            save_notion: false,
            local_save_path: default_local_save_path(),
            storage_type: default_storage_type(),
            github_token: String::new(),
            github_owner: String::new(),
            github_repo: String::new(),
            github_folder: default_github_folder(),
            notion_token: String::new(),
            notion_database_id: String::new(),
            tracking_enabled: false,
            poll_interval_secs: 0,
            idle_threshold_secs: 0,
        }
    }
}

impl AppConfig {
    pub fn config_dir() -> PathBuf {
        let base = dirs::data_dir().unwrap_or_else(|| PathBuf::from("."));
        base.join("com.daily-reflect.agent")
    }

    pub fn config_path() -> PathBuf {
        Self::config_dir().join("config.json")
    }

    pub fn load() -> Self {
        let path = Self::config_path();
        if path.exists() {
            match fs::read_to_string(&path) {
                Ok(content) => match serde_json::from_str(&content) {
                    Ok(config) => return config,
                    Err(e) => {
                        log::warn!("Failed to parse config file: {}", e);
                    }
                },
                Err(e) => {
                    log::warn!("Failed to read config file: {}", e);
                }
            }
        }
        let config = Self::default();
        let _ = config.save();
        config
    }

    pub fn save(&self) -> Result<(), String> {
        let dir = Self::config_dir();
        fs::create_dir_all(&dir).map_err(|e| format!("Failed to create config dir: {}", e))?;

        let content = serde_json::to_string_pretty(self)
            .map_err(|e| format!("Failed to serialize config: {}", e))?;
        fs::write(Self::config_path(), content)
            .map_err(|e| format!("Failed to write config file: {}", e))?;

        Ok(())
    }
}

pub struct AppState {
    pub config: Mutex<AppConfig>,
}

impl AppState {
    pub fn new() -> Self {
        let config = AppConfig::load();
        Self {
            config: Mutex::new(config),
        }
    }
}
