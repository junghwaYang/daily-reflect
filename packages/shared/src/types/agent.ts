// 에이전트 설정 및 상태 타입
// 로컬 에이전트 + GitHub/Notion 연동 구조

// ============================================================
// Agent Config
// ============================================================

/** 에이전트 설정 */
export interface AgentConfig {
  // 추적 설정
  tracking_enabled: boolean;
  poll_interval_secs: number;
  excluded_apps: string[];

  // AI 설정
  gemini_api_key: string;
  retro_tone: 'diary' | 'blog' | 'bullet';
  retro_language: 'ko' | 'en';
  retro_time: string; // "HH:mm" format

  // 저장소 설정
  storage_type: 'github' | 'notion' | 'both' | 'local';

  // GitHub 설정
  github_token: string;
  github_owner: string;
  github_repo: string;
  github_folder: string;

  // Notion 설정
  notion_token: string;
  notion_database_id: string;
}

/** 에이전트 기본 설정값 */
export const DEFAULT_AGENT_CONFIG: AgentConfig = {
  tracking_enabled: true,
  poll_interval_secs: 10,
  excluded_apps: [],
  gemini_api_key: '',
  retro_tone: 'diary',
  retro_language: 'ko',
  retro_time: '23:50',
  storage_type: 'local',
  github_token: '',
  github_owner: '',
  github_repo: '',
  github_folder: 'retrospectives',
  notion_token: '',
  notion_database_id: '',
};

// ============================================================
// Agent Status
// ============================================================

/** 에이전트 상태 정보 */
export interface AgentStatus {
  is_tracking: boolean;
  today_total_minutes: number;
  today_app_count: number;
  last_retro_date: string | null;
  last_retro_status: 'success' | 'failed' | 'pending' | null;
  storage_type: string;
  github_connected: boolean;
  notion_connected: boolean;
}
