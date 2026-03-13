// 앱 카테고리 매핑 상수
// SQL 시드 데이터(002_seed_categories.sql)와 동기화 유지

import type { AppCategoryType } from '../types/database';

/** 카테고리별 기본 앱 목록 */
export const DEFAULT_APP_CATEGORIES: Record<AppCategoryType, string[]> = {
  development: [
    'VSCode',
    'Terminal',
    'iTerm2',
    'Xcode',
    'IntelliJ IDEA',
    'WebStorm',
    'PyCharm',
    'Android Studio',
    'Cursor',
    'Warp',
  ],
  communication: [
    'Slack',
    'Discord',
    'KakaoTalk',
    'Microsoft Teams',
    'Zoom',
    'Google Meet',
  ],
  design: [
    'Figma',
    'Sketch',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Adobe XD',
    'Canva',
  ],
  document: [
    'Notion',
    'Google Docs',
    'Google Sheets',
    'Microsoft Word',
    'Microsoft Excel',
    'Obsidian',
    'Bear',
  ],
  media: [
    'YouTube',
    'Netflix',
    'Spotify',
    'Apple Music',
    'VLC',
  ],
  browser: [
    'Chrome',
    'Safari',
    'Firefox',
    'Arc',
    'Edge',
  ],
  productivity: [
    'Calendar',
    'Reminders',
    'Notes',
    'Trello',
    'Asana',
    'Linear',
    'Jira',
  ],
  other: [],
};

/** 앱 이름 -> 카테고리 역방향 매핑 */
export const APP_TO_CATEGORY: Record<string, AppCategoryType> = Object.entries(
  DEFAULT_APP_CATEGORIES,
).reduce(
  (map, [category, apps]) => {
    for (const app of apps) {
      map[app] = category as AppCategoryType;
    }
    return map;
  },
  {} as Record<string, AppCategoryType>,
);

/** 카테고리 표시 이름 (한국어) */
export const CATEGORY_LABELS_KO: Record<AppCategoryType, string> = {
  development: '개발',
  communication: '커뮤니케이션',
  design: '디자인',
  document: '문서',
  media: '미디어',
  browser: '브라우저',
  productivity: '생산성',
  other: '기타',
};

/** 카테고리 표시 이름 (영어) */
export const CATEGORY_LABELS_EN: Record<AppCategoryType, string> = {
  development: 'Development',
  communication: 'Communication',
  design: 'Design',
  document: 'Document',
  media: 'Media',
  browser: 'Browser',
  productivity: 'Productivity',
  other: 'Other',
};

/** 모든 카테고리 목록 */
export const ALL_CATEGORIES: AppCategoryType[] = [
  'development',
  'communication',
  'design',
  'document',
  'media',
  'browser',
  'productivity',
  'other',
];
