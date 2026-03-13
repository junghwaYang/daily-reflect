use chrono::{Local, NaiveDate, Utc};
use serde::Deserialize;
use std::collections::{HashMap, HashSet};
use std::process::Command;

const DEFAULT_AW_BASE: &str = "http://127.0.0.1:5600/api/0";

#[derive(Debug, Deserialize)]
struct AwEvent {
    timestamp: String,
    duration: f64,
    data: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Clone, serde::Serialize)]
pub struct AwDayStats {
    pub event_count: usize,
    pub active_minutes: u64,
    pub idle_minutes: u64,
    pub aw_connected: bool,
}

pub struct AwClient {
    base_url: String,
}

/// Execute curl and return the response body as String
fn curl_get(url: &str, timeout_secs: u64) -> Result<String, String> {
    let output = Command::new("curl")
        .args([
            "-s",
            "-f",
            "--max-time",
            &timeout_secs.to_string(),
            url,
        ])
        .output()
        .map_err(|e| format!("curl 실행 실패: {}", e))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(format!("curl 요청 실패 ({}): {}", url, stderr));
    }

    String::from_utf8(output.stdout)
        .map_err(|e| format!("curl 응답 인코딩 오류: {}", e))
}

impl AwClient {
    pub fn new(base_url: &str) -> Self {
        let url = if base_url.is_empty() {
            DEFAULT_AW_BASE.to_string()
        } else {
            base_url.trim_end_matches('/').to_string()
        };
        Self { base_url: url }
    }

    /// Check if ActivityWatch is running (sync, uses curl)
    pub fn is_connected(&self) -> bool {
        curl_get(&format!("{}/buckets/", self.base_url), 3).is_ok()
    }

    /// Get bucket IDs matching a keyword (e.g. "window", "afk")
    fn get_bucket_ids(&self, keyword: &str) -> Result<Vec<String>, String> {
        let body = curl_get(&format!("{}/buckets/", self.base_url), 5)?;

        let buckets: HashMap<String, serde_json::Value> =
            serde_json::from_str(&body)
                .map_err(|e| format!("ActivityWatch 응답 파싱 실패: {}", e))?;

        Ok(buckets
            .keys()
            .filter(|k| k.contains(keyword))
            .cloned()
            .collect())
    }

    /// Fetch events from a specific bucket
    fn fetch_events(
        &self,
        bucket_id: &str,
        start: &str,
        end: &str,
    ) -> Result<Vec<AwEvent>, String> {
        let url = format!(
            "{}/buckets/{}/events?start={}&end={}",
            self.base_url, bucket_id, start, end
        );
        let body = curl_get(&url, 10)?;

        serde_json::from_str(&body)
            .map_err(|e| format!("AW 이벤트 파싱 실패: {}", e))
    }

    /// Build date range strings for AW API query (local timezone)
    fn date_range(date: &str) -> Result<(String, String), String> {
        let naive = NaiveDate::parse_from_str(date, "%Y-%m-%d")
            .map_err(|e| format!("날짜 형식 오류: {}", e))?;
        let tz = Local::now().timezone();
        let start = naive
            .and_hms_opt(0, 0, 0)
            .unwrap()
            .and_local_timezone(tz)
            .unwrap()
            .with_timezone(&Utc);
        let end = naive
            .and_hms_opt(23, 59, 59)
            .unwrap()
            .and_local_timezone(tz)
            .unwrap()
            .with_timezone(&Utc);
        Ok((start.to_rfc3339(), end.to_rfc3339()))
    }

    /// Get today's stats from ActivityWatch
    pub fn get_today_stats(&self) -> AwDayStats {
        let today = Local::now().format("%Y-%m-%d").to_string();
        let (start, end) = match Self::date_range(&today) {
            Ok(r) => r,
            Err(_) => {
                return AwDayStats {
                    event_count: 0,
                    active_minutes: 0,
                    idle_minutes: 0,
                    aw_connected: false,
                }
            }
        };

        let connected = self.is_connected();
        if !connected {
            return AwDayStats {
                event_count: 0,
                active_minutes: 0,
                idle_minutes: 0,
                aw_connected: false,
            };
        }

        // Get window events count
        let window_buckets = self.get_bucket_ids("window").unwrap_or_default();
        let mut event_count = 0usize;
        for bid in &window_buckets {
            if let Ok(events) = self.fetch_events(bid, &start, &end) {
                event_count += events.len();
            }
        }

        // Get AFK data for active/idle time
        let afk_buckets = self.get_bucket_ids("afk").unwrap_or_default();
        let mut active_secs: f64 = 0.0;
        let mut idle_secs: f64 = 0.0;

        for bid in &afk_buckets {
            if let Ok(events) = self.fetch_events(bid, &start, &end) {
                for event in &events {
                    let status = event
                        .data
                        .get("status")
                        .and_then(|v| v.as_str())
                        .unwrap_or("");
                    if status == "not-afk" {
                        active_secs += event.duration;
                    } else {
                        idle_secs += event.duration;
                    }
                }
            }
        }

        // Fallback: if no AFK bucket, use window event durations as active
        if afk_buckets.is_empty() && event_count > 0 {
            for bid in &window_buckets {
                if let Ok(events) = self.fetch_events(bid, &start, &end) {
                    active_secs += events.iter().map(|e| e.duration).sum::<f64>();
                }
            }
        }

        AwDayStats {
            event_count,
            active_minutes: (active_secs / 60.0) as u64,
            idle_minutes: (idle_secs / 60.0) as u64,
            aw_connected: true,
        }
    }

    /// Get daily summary for AI retrospective generation
    pub fn get_daily_summary(
        &self,
        date: &str,
        excluded_apps: &[String],
    ) -> Result<String, String> {
        if !self.is_connected() {
            return Err("ActivityWatch가 실행 중이 아닙니다. ActivityWatch를 먼저 실행해주세요.".to_string());
        }

        let (start, end) = Self::date_range(date)?;

        // Fetch window events
        let window_buckets = self.get_bucket_ids("window")?;
        let mut all_events: Vec<AwEvent> = Vec::new();
        for bid in &window_buckets {
            if let Ok(events) = self.fetch_events(bid, &start, &end) {
                all_events.extend(events);
            }
        }

        // Fetch AFK events
        let afk_buckets = self.get_bucket_ids("afk")?;
        let mut afk_active_secs: f64 = 0.0;
        let mut afk_idle_secs: f64 = 0.0;
        for bid in &afk_buckets {
            if let Ok(events) = self.fetch_events(bid, &start, &end) {
                for event in &events {
                    let status = event
                        .data
                        .get("status")
                        .and_then(|v| v.as_str())
                        .unwrap_or("");
                    if status == "not-afk" {
                        afk_active_secs += event.duration;
                    } else {
                        afk_idle_secs += event.duration;
                    }
                }
            }
        }

        // Filter excluded apps
        let events: Vec<&AwEvent> = all_events
            .iter()
            .filter(|e| {
                let app = e
                    .data
                    .get("app")
                    .and_then(|v| v.as_str())
                    .unwrap_or("");
                !excluded_apps
                    .iter()
                    .any(|ex| app.to_lowercase().contains(&ex.to_lowercase()))
            })
            .collect();

        if events.is_empty() {
            return Ok(format!("{}에 기록된 활동이 없습니다.", date));
        }

        // Aggregate per-app duration and window titles
        let mut app_duration: HashMap<String, f64> = HashMap::new();
        let mut app_titles: HashMap<String, Vec<(String, f64)>> = HashMap::new();
        let mut hourly: HashMap<u32, Vec<(String, String)>> = HashMap::new();

        for event in &events {
            let app = event
                .data
                .get("app")
                .and_then(|v| v.as_str())
                .unwrap_or("Unknown")
                .to_string();
            let title = event
                .data
                .get("title")
                .and_then(|v| v.as_str())
                .unwrap_or("")
                .to_string();
            let dur = event.duration;

            *app_duration.entry(app.clone()).or_insert(0.0) += dur;

            // Collect window titles per app
            let titles = app_titles.entry(app.clone()).or_default();
            if let Some(existing) = titles.iter_mut().find(|(t, _)| *t == title) {
                existing.1 += dur;
            } else if !title.is_empty() && title != app {
                titles.push((title.clone(), dur));
            }

            // Extract hour from timestamp
            if let Some(hour_str) = event.timestamp.get(11..13) {
                if let Ok(hour) = hour_str.parse::<u32>() {
                    // Convert UTC hour to local (approximate)
                    let local_offset = Local::now().offset().local_minus_utc() / 3600;
                    let local_hour = (hour as i32 + local_offset).rem_euclid(24) as u32;
                    let entries = hourly.entry(local_hour).or_default();
                    let label = if !title.is_empty() && title != app {
                        format!("{} ({})", app, title)
                    } else {
                        app.clone()
                    };
                    if !entries.iter().any(|(a, _)| *a == app) {
                        entries.push((app.clone(), label));
                    }
                }
            }
        }

        let total_active = if afk_active_secs > 0.0 {
            afk_active_secs
        } else {
            events.iter().map(|e| e.duration).sum::<f64>()
        };
        let active_hours = (total_active as u64) / 3600;
        let active_mins = ((total_active as u64) % 3600) / 60;
        let idle_hours = (afk_idle_secs as u64) / 3600;
        let idle_mins = ((afk_idle_secs as u64) % 3600) / 60;

        // Build summary text
        let mut summary = format!("날짜: {}\n", date);
        summary.push_str(&format!(
            "총 활동 시간: {}시간 {}분\n",
            active_hours, active_mins
        ));
        summary.push_str(&format!(
            "유휴 시간: {}시간 {}분\n",
            idle_hours, idle_mins
        ));
        summary.push_str(&format!("이벤트 수: {}\n\n", events.len()));

        // App usage sorted by duration
        let mut app_list: Vec<_> = app_duration.into_iter().collect();
        app_list.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

        summary.push_str("## 앱별 사용 시간 및 상세 활동\n");
        for (app, secs) in &app_list {
            let s = *secs as u64;
            let h = s / 3600;
            let m = (s % 3600) / 60;
            let r = s % 60;
            if h > 0 {
                summary.push_str(&format!("- {}: {}시간 {}분 {}초\n", app, h, m, r));
            } else if m > 0 {
                summary.push_str(&format!("- {}: {}분 {}초\n", app, m, r));
            } else {
                summary.push_str(&format!("- {}: {}초\n", app, r));
            }

            // Window title details (top 10)
            if let Some(titles) = app_titles.get(app) {
                let mut sorted = titles.clone();
                sorted.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
                for (title, t_secs) in sorted.iter().take(10) {
                    let tm = (*t_secs as u64) / 60;
                    let tr = (*t_secs as u64) % 60;
                    if tm > 0 {
                        summary.push_str(&format!("  · {} ({}분 {}초)\n", title, tm, tr));
                    } else {
                        summary.push_str(&format!("  · {} ({}초)\n", title, tr));
                    }
                }
            }
        }

        // Hourly breakdown
        summary.push_str("\n## 시간대별 활동\n");
        let mut hours: Vec<_> = hourly.into_iter().collect();
        hours.sort_by_key(|(h, _)| *h);
        for (hour, entries) in &hours {
            let labels: Vec<&str> = entries.iter().map(|(_, l)| l.as_str()).collect();
            summary.push_str(&format!("- {:02}시: {}\n", hour, labels.join(", ")));
        }

        // Raw activity log [App] Title (like ActivityWatch format)
        summary.push_str("\n## 상세 활동 로그\n");
        let mut seen: HashSet<String> = HashSet::new();
        for event in &events {
            let app = event
                .data
                .get("app")
                .and_then(|v| v.as_str())
                .unwrap_or("Unknown");
            let title = event
                .data
                .get("title")
                .and_then(|v| v.as_str())
                .unwrap_or("");
            let entry = if !title.is_empty() && title != app {
                format!("[{}] {}", app, title)
            } else {
                format!("[{}]", app)
            };
            if seen.insert(entry.clone()) {
                summary.push_str(&entry);
                summary.push('\n');
            }
        }

        Ok(summary)
    }
}
