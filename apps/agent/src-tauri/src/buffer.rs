use crate::config::AppConfig;
use chrono::Local;
use rusqlite::{params, Connection};
use std::path::PathBuf;
use std::sync::Mutex;

pub struct ActivityBuffer {
    conn: Mutex<Connection>,
}

impl ActivityBuffer {
    pub fn new() -> Result<Self, String> {
        let db_path = Self::db_path();

        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent)
                .map_err(|e| format!("Failed to create db directory: {}", e))?;
        }

        let conn = Connection::open(&db_path)
            .map_err(|e| format!("Failed to open database: {}", e))?;

        Self::init_db(&conn)?;

        Ok(Self {
            conn: Mutex::new(conn),
        })
    }

    fn db_path() -> PathBuf {
        AppConfig::config_dir().join("activity.db")
    }

    fn init_db(conn: &Connection) -> Result<(), String> {
        conn.execute_batch(
            "CREATE TABLE IF NOT EXISTS retrospectives (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL UNIQUE,
                content TEXT NOT NULL,
                pushed_github INTEGER DEFAULT 0,
                pushed_notion INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now'))
            );
            CREATE INDEX IF NOT EXISTS idx_retro_date ON retrospectives(date);",
        )
        .map_err(|e| format!("Failed to initialize database: {}", e))?;

        Ok(())
    }

    /// Save a generated retrospective
    pub fn save_retrospective(&self, date: &str, content: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| format!("Lock error: {}", e))?;
        conn.execute(
            "INSERT OR REPLACE INTO retrospectives (date, content, pushed_github, pushed_notion) VALUES (?1, ?2, 0, 0)",
            params![date, content],
        )
        .map_err(|e| format!("Failed to save retrospective: {}", e))?;
        Ok(())
    }

    /// Mark retrospective as pushed to GitHub
    pub fn mark_pushed_github(&self, date: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| format!("Lock error: {}", e))?;
        conn.execute(
            "UPDATE retrospectives SET pushed_github = 1 WHERE date = ?1",
            params![date],
        )
        .map_err(|e| format!("Failed to mark pushed_github: {}", e))?;
        Ok(())
    }

    /// Mark retrospective as pushed to Notion
    pub fn mark_pushed_notion(&self, date: &str) -> Result<(), String> {
        let conn = self.conn.lock().map_err(|e| format!("Lock error: {}", e))?;
        conn.execute(
            "UPDATE retrospectives SET pushed_notion = 1 WHERE date = ?1",
            params![date],
        )
        .map_err(|e| format!("Failed to mark pushed_notion: {}", e))?;
        Ok(())
    }

    /// Get recent retrospectives
    pub fn get_recent_retrospectives(&self, limit: usize) -> Result<Vec<RetroEntry>, String> {
        let conn = self.conn.lock().map_err(|e| format!("Lock error: {}", e))?;
        let mut stmt = conn
            .prepare(
                "SELECT date, content, pushed_github, pushed_notion, created_at FROM retrospectives ORDER BY date DESC LIMIT ?1",
            )
            .map_err(|e| format!("Failed to prepare statement: {}", e))?;

        let rows = stmt
            .query_map(params![limit as i64], |row| {
                Ok(RetroEntry {
                    date: row.get(0)?,
                    content: row.get(1)?,
                    pushed_github: row.get::<_, i32>(2)? != 0,
                    pushed_notion: row.get::<_, i32>(3)? != 0,
                    created_at: row.get(4)?,
                })
            })
            .map_err(|e| format!("Failed to query retrospectives: {}", e))?;

        let mut entries = Vec::new();
        for row in rows {
            if let Ok(entry) = row {
                entries.push(entry);
            }
        }

        Ok(entries)
    }

    /// Get today's date string in local timezone
    pub fn today_date_str() -> String {
        Local::now().format("%Y-%m-%d").to_string()
    }
}

#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct RetroEntry {
    pub date: String,
    pub content: String,
    pub pushed_github: bool,
    pub pushed_notion: bool,
    pub created_at: Option<String>,
}
