-- 002_seed_categories.sql
-- 기본 앱 카테고리 시드 데이터 (user_id IS NULL = 시스템 기본값)

INSERT INTO public.app_categories (app_name, category, user_id) VALUES
  -- development
  ('VSCode', 'development', NULL),
  ('Terminal', 'development', NULL),
  ('iTerm2', 'development', NULL),
  ('Xcode', 'development', NULL),
  ('IntelliJ IDEA', 'development', NULL),
  ('WebStorm', 'development', NULL),
  ('PyCharm', 'development', NULL),
  ('Android Studio', 'development', NULL),
  ('Cursor', 'development', NULL),
  ('Warp', 'development', NULL),

  -- communication
  ('Slack', 'communication', NULL),
  ('Discord', 'communication', NULL),
  ('KakaoTalk', 'communication', NULL),
  ('Microsoft Teams', 'communication', NULL),
  ('Zoom', 'communication', NULL),
  ('Google Meet', 'communication', NULL),

  -- design
  ('Figma', 'design', NULL),
  ('Sketch', 'design', NULL),
  ('Adobe Photoshop', 'design', NULL),
  ('Adobe Illustrator', 'design', NULL),
  ('Adobe XD', 'design', NULL),
  ('Canva', 'design', NULL),

  -- document
  ('Notion', 'document', NULL),
  ('Google Docs', 'document', NULL),
  ('Google Sheets', 'document', NULL),
  ('Microsoft Word', 'document', NULL),
  ('Microsoft Excel', 'document', NULL),
  ('Obsidian', 'document', NULL),
  ('Bear', 'document', NULL),

  -- media
  ('YouTube', 'media', NULL),
  ('Netflix', 'media', NULL),
  ('Spotify', 'media', NULL),
  ('Apple Music', 'media', NULL),
  ('VLC', 'media', NULL),

  -- browser
  ('Chrome', 'browser', NULL),
  ('Safari', 'browser', NULL),
  ('Firefox', 'browser', NULL),
  ('Arc', 'browser', NULL),
  ('Edge', 'browser', NULL),

  -- productivity
  ('Calendar', 'productivity', NULL),
  ('Reminders', 'productivity', NULL),
  ('Notes', 'productivity', NULL),
  ('Trello', 'productivity', NULL),
  ('Asana', 'productivity', NULL),
  ('Linear', 'productivity', NULL),
  ('Jira', 'productivity', NULL);
