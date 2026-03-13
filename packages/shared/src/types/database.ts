// 로컬 SQLite 스키마에 대응하는 타입
// 에이전트 로컬 + GitHub/Notion 연동 구조

// ============================================================
// Core Types
// ============================================================

export type AppCategoryType =
  | 'development'
  | 'communication'
  | 'design'
  | 'document'
  | 'media'
  | 'browser'
  | 'productivity'
  | 'other';

// ============================================================
// SQLite Row Types
// ============================================================

export interface Activity {
  id: number;
  app_name: string;
  window_title: string;
  timestamp: string; // ISO 8601
  synced: boolean;
}

export interface Retrospective {
  id: number;
  date: string; // YYYY-MM-DD
  content: string; // 마크다운
  pushed_github: boolean;
  pushed_notion: boolean;
  created_at: string;
}

// ============================================================
// Summary / Aggregation Types
// ============================================================

export interface DailySummary {
  date: string;
  total_minutes: number;
  apps: AppUsage[];
  categories: CategoryUsage[];
  timeline: TimeBlock[];
}

export interface AppUsage {
  app_name: string;
  category: string;
  minutes: number;
  percentage: number;
}

export interface CategoryUsage {
  category: string;
  label: string;
  minutes: number;
  percentage: number;
}

export interface TimeBlock {
  start_time: string; // HH:mm
  end_time: string;
  app_name: string;
  description: string;
}
