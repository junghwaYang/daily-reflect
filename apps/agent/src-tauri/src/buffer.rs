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

        let conn =
            Connection::open(&db_path).map_err(|e| format!("Failed to open database: {}", e))?;

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
            "INSERT INTO retrospectives (date, content) VALUES (?1, ?2) ON CONFLICT(date) DO UPDATE SET content=excluded.content",
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

        let entries: Vec<RetroEntry> = rows
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("Failed to decode retrospective row: {}", e))?;

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

#[cfg(test)]
mod tests {
    use super::*;

    impl ActivityBuffer {
        fn new_in_memory() -> Result<Self, String> {
            let conn = Connection::open_in_memory()
                .map_err(|e| format!("Failed to open in-memory db: {}", e))?;
            Self::init_db(&conn)?;
            Ok(Self {
                conn: Mutex::new(conn),
            })
        }
    }

    #[test]
    fn save_and_get_recent_retrospective_round_trip() {
        let buffer = ActivityBuffer::new_in_memory().expect("create in-memory buffer");

        buffer
            .save_retrospective("2026-03-14", "retrospective content")
            .expect("save retrospective");

        let entries = buffer
            .get_recent_retrospectives(1)
            .expect("get retrospectives");
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].date, "2026-03-14");
        assert_eq!(entries[0].content, "retrospective content");
    }

    #[test]
    fn save_retrospective_replaces_existing_date() {
        let buffer = ActivityBuffer::new_in_memory().expect("create in-memory buffer");

        buffer
            .save_retrospective("2026-03-14", "content A")
            .expect("save first retrospective");
        buffer
            .save_retrospective("2026-03-14", "content B")
            .expect("replace retrospective");

        let entries = buffer
            .get_recent_retrospectives(1)
            .expect("get retrospectives");
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].content, "content B");
    }

    #[test]
    fn save_retrospective_overwrite_preserves_push_flags() {
        let buffer = ActivityBuffer::new_in_memory().expect("create in-memory buffer");

        buffer
            .save_retrospective("2026-03-14", "content A")
            .expect("save first retrospective");
        buffer
            .mark_pushed_github("2026-03-14")
            .expect("mark github pushed");

        buffer
            .save_retrospective("2026-03-14", "content B")
            .expect("replace retrospective");

        let entries = buffer
            .get_recent_retrospectives(1)
            .expect("get retrospectives");
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].content, "content B");
        assert!(entries[0].pushed_github);
    }

    #[test]
    fn mark_pushed_flags_update_independently() {
        let buffer = ActivityBuffer::new_in_memory().expect("create in-memory buffer");

        buffer
            .save_retrospective("2026-03-14", "content")
            .expect("save retrospective");
        buffer
            .mark_pushed_github("2026-03-14")
            .expect("mark github pushed");

        let entries = buffer
            .get_recent_retrospectives(1)
            .expect("get retrospectives");
        assert_eq!(entries.len(), 1);
        assert!(entries[0].pushed_github);
        assert!(!entries[0].pushed_notion);
    }

    #[test]
    fn get_recent_retrospectives_returns_newest_first_with_limit() {
        let buffer = ActivityBuffer::new_in_memory().expect("create in-memory buffer");

        buffer
            .save_retrospective("2026-03-12", "first")
            .expect("save 2026-03-12");
        buffer
            .save_retrospective("2026-03-13", "second")
            .expect("save 2026-03-13");
        buffer
            .save_retrospective("2026-03-14", "third")
            .expect("save 2026-03-14");

        let entries = buffer
            .get_recent_retrospectives(2)
            .expect("get limited retrospectives");
        assert_eq!(entries.len(), 2);
        assert_eq!(entries[0].date, "2026-03-14");
        assert_eq!(entries[1].date, "2026-03-13");
    }

    #[test]
    fn today_date_str_has_yyyy_mm_dd_format() {
        let today = ActivityBuffer::today_date_str();
        let parts: Vec<&str> = today.split('-').collect();

        assert_eq!(parts.len(), 3);
        assert_eq!(parts[0].len(), 4);
        assert_eq!(parts[1].len(), 2);
        assert_eq!(parts[2].len(), 2);
        assert!(parts
            .iter()
            .all(|part| part.chars().all(|c| c.is_ascii_digit())));
    }
}
