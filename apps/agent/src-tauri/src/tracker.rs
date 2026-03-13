use chrono::{Local, NaiveDate, Utc};
use serde::Deserialize;
use std::collections::{HashMap, HashSet};

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

/// Execute HTTP GET and return response body as String
fn http_get(url: &str, timeout_secs: u64) -> Result<String, String> {
    let client = reqwest::blocking::Client::builder()
        .timeout(std::time::Duration::from_secs(timeout_secs))
        .build()
        .map_err(|e| format!("HTTP client error: {}", e))?;

    let response = client
        .get(url)
        .send()
        .map_err(|e| format!("HTTP request failed ({}): {}", url, e))?;

    if !response.status().is_success() {
        return Err(format!(
            "HTTP request failed ({}): status {}",
            url,
            response.status()
        ));
    }

    response
        .text()
        .map_err(|e| format!("HTTP response encoding error: {}", e))
}

fn validate_aw_api_base(url_str: &str) -> bool {
    let normalized = url_str.trim();
    match url::Url::parse(normalized) {
        Ok(parsed) => {
            parsed.scheme() == "http"
                && matches!(
                    parsed.host_str(),
                    Some("localhost") | Some("127.0.0.1") | Some("[::1]")
                )
        }
        Err(_) => false,
    }
}

fn sanitize_bucket_id(id: &str) -> Result<&str, String> {
    if id
        .chars()
        .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_' || c == '.')
    {
        Ok(id)
    } else {
        Err(format!("Invalid bucket ID: {}", id))
    }
}

impl AwClient {
    pub fn new(base_url: &str) -> Self {
        let url = if base_url.is_empty() {
            DEFAULT_AW_BASE.to_string()
        } else if validate_aw_api_base(base_url) {
            base_url.trim_end_matches('/').to_string()
        } else {
            DEFAULT_AW_BASE.to_string()
        };
        Self { base_url: url }
    }

    /// Check if ActivityWatch is running (sync)
    pub fn is_connected(&self) -> bool {
        http_get(&format!("{}/buckets/", self.base_url), 3).is_ok()
    }

    /// Get bucket IDs matching a keyword (e.g. "window", "afk")
    fn get_bucket_ids(&self, keyword: &str) -> Result<Vec<String>, String> {
        let body = http_get(&format!("{}/buckets/", self.base_url), 5)?;

        let buckets: HashMap<String, serde_json::Value> = serde_json::from_str(&body)
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
        let bucket_id = sanitize_bucket_id(bucket_id)?;
        // URL-encode timestamps: '+' in RFC3339 (e.g. +00:00) must be %2B
        let enc_start = start.replace('+', "%2B");
        let enc_end = end.replace('+', "%2B");
        let url = format!(
            "{}/buckets/{}/events?start={}&end={}",
            self.base_url, bucket_id, enc_start, enc_end
        );
        let body = http_get(&url, 10)?;

        serde_json::from_str(&body).map_err(|e| format!("AW 이벤트 파싱 실패: {}", e))
    }

    /// Build date range strings for AW API query (local timezone)
    fn date_range(date: &str) -> Result<(String, String), String> {
        let naive = NaiveDate::parse_from_str(date, "%Y-%m-%d")
            .map_err(|e| format!("날짜 형식 오류: {}", e))?;
        let tz = Local::now().timezone();
        let start = naive
            .and_hms_opt(0, 0, 0)
            .ok_or("Invalid time")?
            .and_local_timezone(tz)
            .earliest()
            .ok_or("Failed to resolve local timezone for start")?
            .with_timezone(&Utc);
        let end = naive
            .and_hms_opt(23, 59, 59)
            .ok_or("Invalid time")?
            .and_local_timezone(tz)
            .latest()
            .ok_or("Failed to resolve local timezone for end")?
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
        lang: &str,
    ) -> Result<String, String> {
        let is_en = lang == "en";

        if !self.is_connected() {
            return Err(if is_en {
                "ActivityWatch is not running. Please start ActivityWatch first.".to_string()
            } else {
                "ActivityWatch가 실행 중이 아닙니다. ActivityWatch를 먼저 실행해주세요.".to_string()
            });
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
                let app = e.data.get("app").and_then(|v| v.as_str()).unwrap_or("");
                !excluded_apps
                    .iter()
                    .any(|ex| app.to_lowercase().contains(&ex.to_lowercase()))
            })
            .collect();

        if events.is_empty() {
            return Ok(if is_en {
                format!("No recorded activity on {}.", date)
            } else {
                format!("{}에 기록된 활동이 없습니다.", date)
            });
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
        let (lbl_date, lbl_active, lbl_idle, lbl_events, lbl_apps, lbl_hourly, lbl_log) = if is_en {
            (
                "Date",
                "Total Active Time",
                "Idle Time",
                "Events",
                "## App Usage & Details",
                "## Hourly Activity",
                "## Activity Log",
            )
        } else {
            (
                "날짜",
                "총 활동 시간",
                "유휴 시간",
                "이벤트 수",
                "## 앱별 사용 시간 및 상세 활동",
                "## 시간대별 활동",
                "## 상세 활동 로그",
            )
        };
        let (h_unit, m_unit, s_unit) = if is_en {
            ("h", "m", "s")
        } else {
            ("시간", "분", "초")
        };
        let hour_suffix = if is_en { "" } else { "시" };

        let mut summary = format!("{}: {}\n", lbl_date, date);
        summary.push_str(&format!(
            "{}: {}{} {}{}\n",
            lbl_active, active_hours, h_unit, active_mins, m_unit
        ));
        summary.push_str(&format!(
            "{}: {}{} {}{}\n",
            lbl_idle, idle_hours, h_unit, idle_mins, m_unit
        ));
        summary.push_str(&format!("{}: {}\n\n", lbl_events, events.len()));

        // App usage sorted by duration
        let mut app_list: Vec<_> = app_duration.into_iter().collect();
        app_list.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));

        summary.push_str(&format!("{}\n", lbl_apps));
        for (app, secs) in &app_list {
            let s = *secs as u64;
            let h = s / 3600;
            let m = (s % 3600) / 60;
            let r = s % 60;
            if h > 0 {
                summary.push_str(&format!(
                    "- {}: {}{} {}{} {}{}\n",
                    app, h, h_unit, m, m_unit, r, s_unit
                ));
            } else if m > 0 {
                summary.push_str(&format!("- {}: {}{} {}{}\n", app, m, m_unit, r, s_unit));
            } else {
                summary.push_str(&format!("- {}: {}{}\n", app, r, s_unit));
            }

            // Window title details (top 10)
            if let Some(titles) = app_titles.get(app) {
                let mut sorted = titles.clone();
                sorted.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(std::cmp::Ordering::Equal));
                for (title, t_secs) in sorted.iter().take(10) {
                    let tm = (*t_secs as u64) / 60;
                    let tr = (*t_secs as u64) % 60;
                    if tm > 0 {
                        summary.push_str(&format!(
                            "  · {} ({}{} {}{})\n",
                            title, tm, m_unit, tr, s_unit
                        ));
                    } else {
                        summary.push_str(&format!("  · {} ({}{})\n", title, tr, s_unit));
                    }
                }
            }
        }

        // Hourly breakdown
        summary.push_str(&format!("\n{}\n", lbl_hourly));
        let mut hours: Vec<_> = hourly.into_iter().collect();
        hours.sort_by_key(|(h, _)| *h);
        for (hour, entries) in &hours {
            let labels: Vec<&str> = entries.iter().map(|(_, l)| l.as_str()).collect();
            summary.push_str(&format!(
                "- {:02}{}: {}\n",
                hour,
                hour_suffix,
                labels.join(", ")
            ));
        }

        // Raw activity log [App] Title (like ActivityWatch format)
        summary.push_str(&format!("\n{}\n", lbl_log));
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_aw_api_base_valid_localhost() {
        assert!(validate_aw_api_base("http://localhost:5600/api/0"));
    }

    #[test]
    fn test_validate_aw_api_base_valid_ipv4_loopback() {
        assert!(validate_aw_api_base("http://127.0.0.1:5600/api/0"));
    }

    #[test]
    fn test_validate_aw_api_base_valid_ipv6_loopback() {
        assert!(validate_aw_api_base("http://[::1]:5600/api/0"));
    }

    #[test]
    fn test_validate_aw_api_base_valid_with_trimming() {
        assert!(validate_aw_api_base("  http://localhost:5600  "));
    }

    #[test]
    fn test_validate_aw_api_base_invalid_evil_domain() {
        assert!(!validate_aw_api_base("http://evil.com"));
    }

    #[test]
    fn test_validate_aw_api_base_invalid_localhost_subdomain() {
        assert!(!validate_aw_api_base("http://localhost.evil.com"));
    }

    #[test]
    fn test_validate_aw_api_base_invalid_https() {
        assert!(!validate_aw_api_base("https://localhost:5600"));
    }

    #[test]
    fn test_validate_aw_api_base_invalid_ftp() {
        assert!(!validate_aw_api_base("ftp://127.0.0.1"));
    }

    #[test]
    fn test_validate_aw_api_base_invalid_empty() {
        assert!(!validate_aw_api_base(""));
    }

    #[test]
    fn test_sanitize_bucket_id_valid_aw_watcher_window() {
        assert_eq!(
            sanitize_bucket_id("aw-watcher-window_my-pc").expect("should be valid"),
            "aw-watcher-window_my-pc"
        );
    }

    #[test]
    fn test_sanitize_bucket_id_valid_with_dot_and_dash() {
        assert_eq!(
            sanitize_bucket_id("bucket.name-v2").expect("should be valid"),
            "bucket.name-v2"
        );
    }

    #[test]
    fn test_sanitize_bucket_id_valid_simple() {
        assert_eq!(
            sanitize_bucket_id("simple").expect("should be valid"),
            "simple"
        );
    }

    #[test]
    fn test_sanitize_bucket_id_invalid_path_traversal_like() {
        assert!(sanitize_bucket_id("bucket/../../etc").is_err());
    }

    #[test]
    fn test_sanitize_bucket_id_invalid_spaces() {
        assert!(sanitize_bucket_id("bucket id with spaces").is_err());
    }

    #[test]
    fn test_sanitize_bucket_id_invalid_semicolon() {
        assert!(sanitize_bucket_id("bucket;drop").is_err());
    }

    #[test]
    fn test_sanitize_bucket_id_invalid_script_like() {
        assert!(sanitize_bucket_id("bucket<script>").is_err());
    }

    #[test]
    fn test_aw_client_new_empty_uses_default_base() {
        let client = AwClient::new("");
        assert_eq!(client.base_url, DEFAULT_AW_BASE);
    }

    #[test]
    fn test_aw_client_new_valid_localhost_trims_trailing_slash() {
        let client = AwClient::new("http://localhost:5600/api/0/");
        assert_eq!(client.base_url, "http://localhost:5600/api/0");
    }

    #[test]
    fn test_aw_client_new_invalid_url_falls_back_to_default() {
        let client = AwClient::new("http://evil.com/api");
        assert_eq!(client.base_url, DEFAULT_AW_BASE);
    }

    #[test]
    fn test_aw_client_date_range_valid_date_returns_rfc3339_strings() {
        let (start, end) = AwClient::date_range("2026-03-14").expect("valid date should parse");

        let parsed_start =
            chrono::DateTime::parse_from_rfc3339(&start).expect("start should be RFC3339");
        let parsed_end = chrono::DateTime::parse_from_rfc3339(&end).expect("end should be RFC3339");

        assert!(parsed_start < parsed_end);
    }

    #[test]
    fn test_aw_client_date_range_invalid_not_a_date_returns_err() {
        assert!(AwClient::date_range("not-a-date").is_err());
    }

    #[test]
    fn test_aw_client_date_range_invalid_month_returns_err() {
        assert!(AwClient::date_range("2026-13-01").is_err());
    }
}
