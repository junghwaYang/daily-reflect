const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

let currentConfig = null;
let currentLang = 'ko';

// --- i18n ---
const i18n = {
  ko: {
    // Status tab
    'tracking.checking': '확인 중...',
    'tracking.aw_checking': 'ActivityWatch 연결 확인 중',
    'tracking.connected': 'ActivityWatch 연결됨',
    'tracking.fetching': '활동 데이터를 가져오고 있습니다',
    'tracking.disconnected': 'ActivityWatch 미연결',
    'tracking.please_run': 'ActivityWatch를 실행해주세요',
    'tracking.failed': 'AW 연결 실패',
    'metric.active_time': '활동 시간',
    'metric.idle_time': '유휴 시간',
    'metric.events': '이벤트',
    'activity.title': '오늘 활동',
    'activity.loading': '로딩 중...',
    'activity.no_data': 'ActivityWatch에서 데이터를 가져올 수 없습니다.',
    'time.hours_mins': '{h}시간 {m}분',
    'time.mins': '{m}분',

    // Tab bar
    'tab.status': '상태',
    'tab.retros': '회고',
    'tab.settings': '설정',

    // Banner
    'banner.aw_not_running': 'ActivityWatch가 실행 중이지 않습니다.',
    'banner.view_settings': '설정 보기',

    // Onboarding
    'onboarding.title': 'ActivityWatch가 필요해요',
    'onboarding.desc': 'Daily Reflect는 ActivityWatch를 통해 하루 활동을 추적합니다. ActivityWatch는 완전히 로컬에서 실행되는 오픈소스 활동 트래커입니다.',
    'onboarding.step1_title': 'ActivityWatch 다운로드',
    'onboarding.step1_desc': '아래 버튼으로 설치 파일을 받으세요',
    'onboarding.step2_title': '설치 및 실행',
    'onboarding.step2_desc': '다운로드한 파일을 열고 설치를 완료하세요',
    'onboarding.step3_title': 'ActivityWatch 시작',
    'onboarding.step3_desc': '앱을 실행하면 메뉴바에 아이콘이 나타납니다',
    'onboarding.step4_title': '여기로 돌아오세요',
    'onboarding.step4_desc': '연결이 감지되면 자동으로 시작됩니다',
    'onboarding.download_mac': 'macOS용 ActivityWatch 다운로드',
    'onboarding.download_windows': 'Windows용 ActivityWatch 다운로드',
    'onboarding.download_linux': 'Linux용 ActivityWatch 다운로드',
    'onboarding.polling': '연결 확인 중...',
    'onboarding.check_btn': '연결 확인',
    'onboarding.checking_btn': '확인 중...',
    'onboarding.aw_connected': 'ActivityWatch 연결됨!',
    'onboarding.not_connected': '아직 연결되지 않았습니다',

    // Settings main
    'settings.ai_writing': 'AI 글쓰기',
    'settings.storage': '저장 위치',
    'settings.data_source': '데이터 소스',
    'settings.back': '설정',

    // AI Writing detail
    'ai.api_key_label': 'AI 연결 키',
    'ai.tone_label': '글쓰기 톤',
    'ai.tone_diary': '일기체',
    'ai.tone_blog': '블로그',
    'ai.tone_bullet': '불렛 포인트',
    'ai.tone_custom': '직접 입력',
    'ai.custom_tone_label': '커스텀 톤 설명',
    'ai.custom_tone_placeholder': '예: 친구에게 말하듯 유머러스하게',
    'ai.custom_tone_hint': 'AI에게 전달할 글쓰기 스타일을 자유롭게 입력하세요',
    'ai.language_label': '언어',
    'ai.lang_ko': '한국어',
    'ai.lang_en': 'English',
    'ai.time_label': '생성 시각',

    // Storage detail
    'storage.local_title': '로컬 저장',
    'storage.path_label': '저장 경로',
    'storage.pick_folder': '폴더 선택',
    'storage.path_hint': '회고글이 해당 경로에 마크다운 파일로 저장됩니다',
    'storage.local_summary': '로컬',
    'storage.none': '없음',

    // GitHub
    'github.step1': '1. GitHub에서 토큰을 생성하세요',
    'github.open_token': 'GitHub에서 토큰 생성',
    'github.step2': '2. 생성된 토큰을 아래에 붙여넣기',
    'github.connect': '연결',
    'github.connecting': '연결 중...',
    'github.connect_fail': '연결 실패: ',
    'github.repo_label': '레포지토리',
    'github.repo_select': '레포 선택...',
    'github.repo_loading': '로딩 중...',
    'github.repo_load_fail': '레포 목록 불러오기 실패',
    'github.folder_label': '저장 폴더',
    'github.test_btn': '연결 테스트',
    'github.disconnect_btn': '연결 해제',
    'github.select_repo': '레포를 선택해주세요',
    'github.testing': '테스트 중...',
    'github.path_hint': '{repo}/{folder}/{date}.md 형태로 커밋됩니다',

    // Notion
    'notion.step1': '1. Notion에서 통합을 생성하세요',
    'notion.open_integration': 'Notion에서 통합 생성',
    'notion.step2': '2. 통합 토큰을 아래에 붙여넣기',
    'notion.step3': '3. Notion에서 사용할 데이터베이스에 통합을 연결해주세요',
    'notion.connect': '연결',
    'notion.connecting': '연결 중...',
    'notion.connect_fail': '연결 실패: ',
    'notion.db_label': '데이터베이스',
    'notion.db_select': '데이터베이스 선택...',
    'notion.db_loading': '로딩 중...',
    'notion.db_load_fail': '데이터베이스 불러오기 실패',
    'notion.db_hint': '선택한 데이터베이스에 매일 새 페이지가 생성됩니다',
    'notion.test_btn': '연결 테스트',
    'notion.disconnect_btn': '연결 해제',
    'notion.select_db': '데이터베이스를 선택해주세요',
    'notion.testing': '테스트 중...',

    // Data source detail
    'data.aw_label': 'ActivityWatch',
    'data.aw_desc': '활동 추적은 ActivityWatch가 담당합니다.\nActivityWatch가 실행 중이어야 데이터를 가져올 수 있습니다.',
    'data.check_btn': '연결 확인',
    'data.excluded_title': '제외 앱',
    'data.excluded_desc': '이 목록의 앱은 회고글에서 제외됩니다',
    'data.excluded_none': '제외된 앱 없음',
    'data.excluded_placeholder': '앱 이름',
    'data.add_btn': '추가',
    'data.summary': 'ActivityWatch · 제외 앱 {count}개',

    // Connection badges
    'badge.connected': '연결됨',
    'badge.disconnected': '미연결',
    'badge.checking': '확인 중',
    'badge.error': '오류',

    // Retro tab
    'retro.empty_text': '아직 생성된 회고글이 없습니다',
    'retro.empty_sub': '아래 버튼을 눌러 오늘의 회고를 시작하세요',
    'retro.empty_sub_list': '위 버튼을 눌러 오늘의 회고를 시작하세요',
    'retro.generate_btn': '수동으로 회고 생성하기',
    'retro.generating': '생성 중...',
    'retro.generating_msg': 'AI 회고글을 생성하고 있습니다...',
    'retro.generated_ok': '회고글이 성공적으로 생성되었습니다!',
    'retro.generated_fail': '생성 실패: ',
    'retro.generate_retry': '오늘의 회고 생성하기',
    'retro.past_title': '지난 회고',
    'retro.back': '회고 목록',
    'retro.title_suffix': ' 회고',

    // AI summary (settings card)
    'summary.tone_diary': '일기체',
    'summary.tone_blog': '블로그',
    'summary.tone_bullet': '불렛',
    'summary.tone_custom': '커스텀',
    'summary.lang_ko': '한국어',
    'summary.lang_en': 'English',

    // Local path hint
    'storage.path_format': '{path}/{year}/{date}.md 형태로 저장됩니다',

    // Toast
    'toast.saved': '저장됨',
  },
  en: {
    // Status tab
    'tracking.checking': 'Checking...',
    'tracking.aw_checking': 'Checking ActivityWatch connection',
    'tracking.connected': 'ActivityWatch Connected',
    'tracking.fetching': 'Fetching activity data',
    'tracking.disconnected': 'ActivityWatch Not Connected',
    'tracking.please_run': 'Please start ActivityWatch',
    'tracking.failed': 'AW Connection Failed',
    'metric.active_time': 'Active Time',
    'metric.idle_time': 'Idle Time',
    'metric.events': 'Events',
    'activity.title': "Today's Activity",
    'activity.loading': 'Loading...',
    'activity.no_data': 'Could not fetch data from ActivityWatch.',
    'time.hours_mins': '{h}h {m}m',
    'time.mins': '{m}m',

    // Tab bar
    'tab.status': 'Status',
    'tab.retros': 'Retros',
    'tab.settings': 'Settings',

    // Banner
    'banner.aw_not_running': 'ActivityWatch is not running.',
    'banner.view_settings': 'View Settings',

    // Onboarding
    'onboarding.title': 'ActivityWatch Required',
    'onboarding.desc': 'Daily Reflect tracks your daily activity through ActivityWatch. ActivityWatch is an open-source activity tracker that runs entirely locally.',
    'onboarding.step1_title': 'Download ActivityWatch',
    'onboarding.step1_desc': 'Download the installer using the button below',
    'onboarding.step2_title': 'Install & Launch',
    'onboarding.step2_desc': 'Open the downloaded file and complete installation',
    'onboarding.step3_title': 'Start ActivityWatch',
    'onboarding.step3_desc': 'An icon will appear in the menu bar when the app is running',
    'onboarding.step4_title': 'Come Back Here',
    'onboarding.step4_desc': 'The app will start automatically when a connection is detected',
    'onboarding.download_mac': 'Download ActivityWatch for macOS',
    'onboarding.download_windows': 'Download ActivityWatch for Windows',
    'onboarding.download_linux': 'Download ActivityWatch for Linux',
    'onboarding.polling': 'Checking connection...',
    'onboarding.check_btn': 'Check Connection',
    'onboarding.checking_btn': 'Checking...',
    'onboarding.aw_connected': 'ActivityWatch Connected!',
    'onboarding.not_connected': 'Not connected yet',

    // Settings main
    'settings.ai_writing': 'AI Writing',
    'settings.storage': 'Storage Location',
    'settings.data_source': 'Data Source',
    'settings.back': 'Settings',

    // AI Writing detail
    'ai.api_key_label': 'AI API Key',
    'ai.tone_label': 'Writing Tone',
    'ai.tone_diary': 'Diary',
    'ai.tone_blog': 'Blog',
    'ai.tone_bullet': 'Bullet Points',
    'ai.tone_custom': 'Custom',
    'ai.custom_tone_label': 'Custom Tone Description',
    'ai.custom_tone_placeholder': 'e.g. Humorous, like talking to a friend',
    'ai.custom_tone_hint': 'Describe the writing style to pass to the AI',
    'ai.language_label': 'Language',
    'ai.lang_ko': '한국어',
    'ai.lang_en': 'English',
    'ai.time_label': 'Generation Time',

    // Storage detail
    'storage.local_title': 'Local Storage',
    'storage.path_label': 'Save Path',
    'storage.pick_folder': 'Choose Folder',
    'storage.path_hint': 'Retros will be saved as markdown files at this path',
    'storage.local_summary': 'Local',
    'storage.none': 'None',

    // GitHub
    'github.step1': '1. Create a token on GitHub',
    'github.open_token': 'Create Token on GitHub',
    'github.step2': '2. Paste the generated token below',
    'github.connect': 'Connect',
    'github.connecting': 'Connecting...',
    'github.connect_fail': 'Connection failed: ',
    'github.repo_label': 'Repository',
    'github.repo_select': 'Select repo...',
    'github.repo_loading': 'Loading...',
    'github.repo_load_fail': 'Failed to load repos',
    'github.folder_label': 'Save Folder',
    'github.test_btn': 'Test Connection',
    'github.disconnect_btn': 'Disconnect',
    'github.select_repo': 'Please select a repository',
    'github.testing': 'Testing...',
    'github.path_hint': 'Will commit to {repo}/{folder}/{date}.md',

    // Notion
    'notion.step1': '1. Create an integration on Notion',
    'notion.open_integration': 'Create Integration on Notion',
    'notion.step2': '2. Paste the integration token below',
    'notion.step3': '3. Connect the integration to the database you want to use in Notion',
    'notion.connect': 'Connect',
    'notion.connecting': 'Connecting...',
    'notion.connect_fail': 'Connection failed: ',
    'notion.db_label': 'Database',
    'notion.db_select': 'Select database...',
    'notion.db_loading': 'Loading...',
    'notion.db_load_fail': 'Failed to load databases',
    'notion.db_hint': 'A new page will be created daily in the selected database',
    'notion.test_btn': 'Test Connection',
    'notion.disconnect_btn': 'Disconnect',
    'notion.select_db': 'Please select a database',
    'notion.testing': 'Testing...',

    // Data source detail
    'data.aw_label': 'ActivityWatch',
    'data.aw_desc': 'ActivityWatch handles activity tracking.\nActivityWatch must be running to fetch data.',
    'data.check_btn': 'Check Connection',
    'data.excluded_title': 'Excluded Apps',
    'data.excluded_desc': 'Apps in this list will be excluded from retros',
    'data.excluded_none': 'No excluded apps',
    'data.excluded_placeholder': 'App name',
    'data.add_btn': 'Add',
    'data.summary': 'ActivityWatch · {count} excluded apps',

    // Connection badges
    'badge.connected': 'Connected',
    'badge.disconnected': 'Disconnected',
    'badge.checking': 'Checking',
    'badge.error': 'Error',

    // Retro tab
    'retro.empty_text': 'No retros generated yet',
    'retro.empty_sub': 'Press the button below to start today\'s retro',
    'retro.empty_sub_list': 'Press the button above to start today\'s retro',
    'retro.generate_btn': 'Generate Retro Manually',
    'retro.generating': 'Generating...',
    'retro.generating_msg': 'Generating AI retro...',
    'retro.generated_ok': 'Retro generated successfully!',
    'retro.generated_fail': 'Generation failed: ',
    'retro.generate_retry': 'Generate Today\'s Retro',
    'retro.past_title': 'Past Retros',
    'retro.back': 'Retro List',
    'retro.title_suffix': ' Retro',

    // AI summary (settings card)
    'summary.tone_diary': 'Diary',
    'summary.tone_blog': 'Blog',
    'summary.tone_bullet': 'Bullet',
    'summary.tone_custom': 'Custom',
    'summary.lang_ko': '한국어',
    'summary.lang_en': 'English',

    // Local path hint
    'storage.path_format': 'Saves as {path}/{year}/{date}.md',

    // Toast
    'toast.saved': 'Saved',
  },
};

function t(key) {
  return i18n[currentLang]?.[key] || i18n['ko'][key] || key;
}

function applyLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;

  // Apply all data-i18n attributes
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });

  // Apply data-i18n-placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = t(key);
  });

  // Re-render dynamic content that depends on language
  updateSettingsSummaries();
}

// --- Onboarding ---
let _onboardingPollTimer = null;
let _awWasConnected = false;

function detectOS() {
  const ua = navigator.userAgent;
  if (ua.includes("Mac")) return "mac";
  if (ua.includes("Win")) return "windows";
  return "linux";
}

function getDownloadUrl() {
  const base = "https://activitywatch.net/downloads/";
  return base;
}

function getDownloadLabel() {
  const os = detectOS();
  if (os === "mac") return t('onboarding.download_mac');
  if (os === "windows") return t('onboarding.download_windows');
  return t('onboarding.download_linux');
}

async function checkAwOnline() {
  try {
    const stats = await invoke("get_aw_stats");
    return stats.aw_connected === true;
  } catch {
    return false;
  }
}

function showOnboarding() {
  const screen = document.getElementById("onboarding-screen");
  const tabBar = document.querySelector(".tab-bar");
  screen.classList.remove("hidden");
  if (tabBar) tabBar.style.display = "none";

  // Set OS-specific download label
  document.getElementById("onboarding-download-label").textContent = getDownloadLabel();

  // Start polling
  startOnboardingPoll();
}

function hideOnboarding() {
  const screen = document.getElementById("onboarding-screen");
  const tabBar = document.querySelector(".tab-bar");
  screen.classList.add("hidden");
  if (tabBar) tabBar.style.display = "";
  stopOnboardingPoll();
}

function startOnboardingPoll() {
  stopOnboardingPoll();
  _onboardingPollTimer = setInterval(async () => {
    const online = await checkAwOnline();
    if (online) {
      const dot = document.getElementById("onboarding-polling-dot");
      const statusEl = document.getElementById("onboarding-polling-status");
      if (dot) dot.classList.add("connected");
      if (statusEl) statusEl.querySelector("span").textContent = t('onboarding.aw_connected');
      stopOnboardingPoll();
      setTimeout(() => {
        hideOnboarding();
        _awWasConnected = true;
        loadAwStats();
      }, 800);
    }
  }, 3000);
}

function stopOnboardingPoll() {
  if (_onboardingPollTimer) {
    clearInterval(_onboardingPollTimer);
    _onboardingPollTimer = null;
  }
}

async function initOnboarding() {
  const online = await checkAwOnline();
  if (!online) {
    showOnboarding();
  } else {
    _awWasConnected = true;
  }
}

function initOnboardingEvents() {
  // Download button — open AW downloads page in system browser
  document.getElementById("onboarding-download-btn").addEventListener("click", async () => {
    const url = getDownloadUrl();
    try {
      const shellModule = window.__TAURI__?.shell;
      if (shellModule?.open) {
        await shellModule.open(url);
        return;
      }
    } catch { /* fall through */ }
    try {
      window.open(url, "_blank");
    } catch { /* ignore */ }
  });

  // Manual check button
  document.getElementById("onboarding-check-btn").addEventListener("click", async () => {
    const btn = document.getElementById("onboarding-check-btn");
    const statusEl = document.getElementById("onboarding-polling-status");
    btn.disabled = true;
    btn.textContent = t('onboarding.checking_btn');

    const online = await checkAwOnline();
    if (online) {
      const dot = statusEl.querySelector(".onboarding-polling-dot");
      if (dot) dot.classList.add("connected");
      statusEl.querySelector("span").textContent = t('onboarding.aw_connected');
      stopOnboardingPoll();
      setTimeout(() => {
        hideOnboarding();
        _awWasConnected = true;
        loadAwStats();
      }, 800);
    } else {
      statusEl.querySelector("span").textContent = t('onboarding.not_connected');
      btn.disabled = false;
      btn.textContent = t('onboarding.check_btn');
    }
  });

  // Banner "설정 보기" button
  const bannerSetupBtn = document.getElementById("aw-banner-setup-btn");
  if (bannerSetupBtn) {
    bannerSetupBtn.addEventListener("click", () => {
      navigateToTab("settings");
      // Push into data source detail
      document.getElementById("settings-main").classList.remove("active");
      document.getElementById("settings-detail-data").classList.add("active");
      checkAwConnection();
    });
  }
}

// --- Icon Navigation ---
function initTabs() {
  document.querySelectorAll(".tab-bar-item[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => {
      navigateToTab(btn.dataset.nav);
    });
  });
}

function navigateToTab(tabName) {
  // Update active icon
  document.querySelectorAll(".tab-bar-item[data-nav]").forEach((b) => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.tab-bar-item[data-nav="${tabName}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  // Switch tab content
  document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
  const target = document.getElementById("tab-" + tabName);
  if (target) target.classList.add("active");

  // Reset sub-views
  if (tabName === "settings") {
    // Show settings main panel
    document.querySelectorAll(".settings-detail").forEach((d) => d.classList.remove("active"));
    document.getElementById("settings-main").classList.add("active");
  } else {
    document.querySelectorAll(".view-panel").forEach((p) => p.classList.remove("active"));
    document.getElementById("settings-main").classList.add("active");
  }
  if (tabName !== "retros") {
    const retroDetail = document.getElementById("retro-detail");
    if (retroDetail) retroDetail.classList.remove("active");
    const retroMain = document.getElementById("retro-main");
    if (retroMain) retroMain.style.display = "";
  }
}

// --- Status ---
async function loadStatus() {
  try {
    await invoke("get_status");
  } catch (e) {
    console.error("Failed to load status:", e);
  }
  // Load AW data separately (non-blocking)
  loadAwStats();
}

async function loadAwStats() {
  const trackingDot = document.getElementById("tracking-dot");
  const trackingText = document.getElementById("tracking-text");
  const awSub = document.getElementById("aw-sub");
  const todayCount = document.getElementById("today-count");
  const todayActiveTime = document.getElementById("today-active-time");
  const todayIdleTime = document.getElementById("today-idle-time");

  try {
    const stats = await invoke("get_aw_stats");

    if (stats.aw_connected) {
      trackingDot.className = "hero-status-dot active";
      trackingText.textContent = t('tracking.connected');
      awSub.textContent = t('tracking.fetching');
      _awWasConnected = true;
      hideBanner();
    } else {
      trackingDot.className = "hero-status-dot paused";
      trackingText.textContent = t('tracking.disconnected');
      awSub.textContent = t('tracking.please_run');
      // If AW was previously connected and is now gone, show subtle banner (not full onboarding)
      if (_awWasConnected) {
        showBanner();
      }
    }

    const activeMinutes = stats.active_minutes || 0;
    const idleMinutes = stats.idle_minutes || 0;
    const activeHours = Math.floor(activeMinutes / 60);
    const activeRemainingMins = activeMinutes % 60;
    const idleHours = Math.floor(idleMinutes / 60);
    const idleRemainingMins = idleMinutes % 60;

    if (activeHours > 0) {
      todayActiveTime.textContent = t('time.hours_mins').replace('{h}', activeHours).replace('{m}', activeRemainingMins);
    } else {
      todayActiveTime.textContent = t('time.mins').replace('{m}', activeRemainingMins);
    }

    if (idleHours > 0) {
      todayIdleTime.textContent = t('time.hours_mins').replace('{h}', idleHours).replace('{m}', idleRemainingMins);
    } else {
      todayIdleTime.textContent = t('time.mins').replace('{m}', idleRemainingMins);
    }

    todayCount.textContent = (stats.event_count || 0).toLocaleString();
  } catch (e) {
    console.error("Failed to load AW stats:", e);
    if (trackingDot) trackingDot.className = "hero-status-dot paused";
    if (trackingText) trackingText.textContent = t('tracking.failed');
    if (awSub) awSub.textContent = e.toString();
  }
}

// --- AW Disconnect Banner ---
function showBanner() {
  const banner = document.getElementById("aw-disconnect-banner");
  if (banner) banner.classList.remove("hidden");
}

function hideBanner() {
  const banner = document.getElementById("aw-disconnect-banner");
  if (banner) banner.classList.add("hidden");
}

// --- Config ---
async function loadConfig() {
  try {
    currentConfig = await invoke("get_config");

    document.getElementById("gemini-api-key").value = currentConfig.gemini_api_key || "";
    document.getElementById("retro-tone").value = currentConfig.retro_tone || "diary";
    document.getElementById("custom-tone").value = currentConfig.custom_tone || "";
    toggleCustomTone();
    const savedLang = currentConfig.retro_language || "ko";
    document.getElementById("retro-language").value = savedLang;
    document.getElementById("retro-time").value = currentConfig.retro_time || "23:50";
    document.getElementById("local-save-path").value = currentConfig.local_save_path || "";
    document.getElementById("github-folder").value = currentConfig.github_folder || "retrospectives";

    // Storage checkboxes
    document.getElementById("save-local").checked = currentConfig.save_local !== false;
    document.getElementById("save-github").checked = currentConfig.save_github === true;
    document.getElementById("save-notion").checked = currentConfig.save_notion === true;

    updateLocalPathHint();

    // GitHub state
    if (currentConfig.github_token) {
      showGitHubConnected();
    } else {
      showGitHubSetup();
    }

    // Notion state
    if (currentConfig.notion_token) {
      showNotionConnected();
    } else {
      showNotionSetup();
    }

    renderExcludedApps(currentConfig.excluded_apps || []);
    updateSettingsSummaries();

    // Apply language from config
    applyLanguage(savedLang);
  } catch (e) {
    console.error("Failed to load config:", e);
  }
}

function updateLocalPathHint() {
  const path = document.getElementById("local-save-path").value;
  const hint = document.getElementById("local-path-hint");
  if (path) {
    const today = new Date().toISOString().slice(0, 10);
    const year = today.slice(0, 4);
    hint.textContent = t('storage.path_format')
      .replace('{path}', path)
      .replace('{year}', year)
      .replace('{date}', today);
  }
}

function updateGitHubPathHint() {
  const select = document.getElementById("github-repo-select");
  const folder = document.getElementById("github-folder").value || "retrospectives";
  const hint = document.getElementById("github-path-hint");
  const today = new Date().toISOString().slice(0, 10);
  if (select.value) {
    hint.textContent = t('github.path_hint')
      .replace('{repo}', select.value)
      .replace('{folder}', folder)
      .replace('{date}', today);
  } else {
    hint.textContent = "";
  }
}

// --- GitHub ---
async function showGitHubConnected() {
  document.getElementById("github-setup").classList.add("hidden");
  document.getElementById("github-connected").classList.remove("hidden");
  document.getElementById("github-status-badge").textContent = t('badge.connected');
  document.getElementById("github-status-badge").className = "connection-badge connected";

  try {
    const select = document.getElementById("github-repo-select");
    select.innerHTML = `<option value="">${t('github.repo_loading')}</option>`;
    const repos = await invoke("fetch_github_repos", { token: currentConfig.github_token });
    select.innerHTML = `<option value="">${t('github.repo_select')}</option>`;
    repos.forEach((repo) => {
      const opt = document.createElement("option");
      opt.value = repo.full_name;
      opt.textContent = repo.full_name + (repo.private ? " (private)" : "");
      opt.dataset.owner = repo.owner;
      opt.dataset.name = repo.name;
      select.appendChild(opt);
    });

    if (currentConfig.github_owner && currentConfig.github_repo) {
      const savedVal = `${currentConfig.github_owner}/${currentConfig.github_repo}`;
      if (select.querySelector(`option[value="${savedVal}"]`)) {
        select.value = savedVal;
      }
    }
    updateGitHubPathHint();
  } catch (e) {
    console.error("Failed to fetch repos:", e);
    document.getElementById("github-repo-select").innerHTML =
      `<option value="">${t('github.repo_load_fail')}</option>`;
  }
}

function showGitHubSetup() {
  document.getElementById("github-setup").classList.remove("hidden");
  document.getElementById("github-connected").classList.add("hidden");
  document.getElementById("github-status-badge").textContent = "";
  document.getElementById("github-status-badge").className = "connection-badge";
}

async function connectGitHub() {
  const token = document.getElementById("github-token").value.trim();
  if (!token) return;

  const btn = document.getElementById("github-connect-btn");
  const errEl = document.getElementById("github-connect-error");
  btn.disabled = true;
  btn.textContent = t('github.connecting');
  errEl.classList.add("hidden");

  try {
    await invoke("fetch_github_repos", { token });
    currentConfig.github_token = token;
    await invoke("set_config", { githubToken: token });
    await loadConfig();
  } catch (e) {
    errEl.textContent = t('github.connect_fail') + e;
    errEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = t('github.connect');
  }
}

async function disconnectGitHub() {
  await invoke("set_config", { githubToken: "", githubOwner: "", githubRepo: "" });
  document.getElementById("github-token").value = "";
  await loadConfig();
}

async function testGitHub() {
  const select = document.getElementById("github-repo-select");
  const opt = select.selectedOptions[0];
  const resultEl = document.getElementById("github-test-result");

  if (!select.value || !opt) {
    resultEl.textContent = t('github.select_repo');
    resultEl.className = "connect-message error";
    resultEl.classList.remove("hidden");
    return;
  }

  resultEl.textContent = t('github.testing');
  resultEl.className = "connect-message info";
  resultEl.classList.remove("hidden");

  try {
    const msg = await invoke("test_github_connection", {
      token: currentConfig.github_token,
      owner: opt.dataset.owner,
      repo: opt.dataset.name,
    });
    resultEl.textContent = msg;
    resultEl.className = "connect-message success";
  } catch (e) {
    resultEl.textContent = e;
    resultEl.className = "connect-message error";
  }
}

// --- Notion ---
async function showNotionConnected() {
  document.getElementById("notion-setup").classList.add("hidden");
  document.getElementById("notion-connected").classList.remove("hidden");
  document.getElementById("notion-status-badge").textContent = t('badge.connected');
  document.getElementById("notion-status-badge").className = "connection-badge connected";

  try {
    const select = document.getElementById("notion-db-select");
    select.innerHTML = `<option value="">${t('notion.db_loading')}</option>`;
    const dbs = await invoke("fetch_notion_databases", { token: currentConfig.notion_token });
    select.innerHTML = `<option value="">${t('notion.db_select')}</option>`;
    dbs.forEach((db) => {
      const opt = document.createElement("option");
      opt.value = db.id;
      opt.textContent = db.title;
      select.appendChild(opt);
    });

    if (currentConfig.notion_database_id) {
      select.value = currentConfig.notion_database_id;
    }
  } catch (e) {
    console.error("Failed to fetch databases:", e);
    document.getElementById("notion-db-select").innerHTML =
      `<option value="">${t('notion.db_load_fail')}</option>`;
  }
}

function showNotionSetup() {
  document.getElementById("notion-setup").classList.remove("hidden");
  document.getElementById("notion-connected").classList.add("hidden");
  document.getElementById("notion-status-badge").textContent = "";
  document.getElementById("notion-status-badge").className = "connection-badge";
}

async function connectNotion() {
  const token = document.getElementById("notion-token").value.trim();
  if (!token) return;

  const btn = document.getElementById("notion-connect-btn");
  const errEl = document.getElementById("notion-connect-error");
  btn.disabled = true;
  btn.textContent = t('notion.connecting');
  errEl.classList.add("hidden");

  try {
    await invoke("fetch_notion_databases", { token });
    currentConfig.notion_token = token;
    await invoke("set_config", { notionToken: token });
    await loadConfig();
  } catch (e) {
    errEl.textContent = t('notion.connect_fail') + e;
    errEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = t('notion.connect');
  }
}

async function disconnectNotion() {
  await invoke("set_config", { notionToken: "", notionDatabaseId: "" });
  document.getElementById("notion-token").value = "";
  await loadConfig();
}

async function testNotion() {
  const select = document.getElementById("notion-db-select");
  const resultEl = document.getElementById("notion-test-result");

  if (!select.value) {
    resultEl.textContent = t('notion.select_db');
    resultEl.className = "connect-message error";
    resultEl.classList.remove("hidden");
    return;
  }

  resultEl.textContent = t('notion.testing');
  resultEl.className = "connect-message info";
  resultEl.classList.remove("hidden");

  try {
    const msg = await invoke("test_notion_connection", {
      token: currentConfig.notion_token,
      databaseId: select.value,
    });
    resultEl.textContent = msg;
    resultEl.className = "connect-message success";
  } catch (e) {
    resultEl.textContent = e;
    resultEl.className = "connect-message error";
  }
}

// --- Save Config (auto-save) ---
let _saveDebounceTimer = null;

function debouncedSaveConfig() {
  if (_saveDebounceTimer) clearTimeout(_saveDebounceTimer);
  _saveDebounceTimer = setTimeout(() => saveConfig(), 500);
}

async function saveConfig() {
  try {
    let githubOwner = currentConfig?.github_owner || "";
    let githubRepo = currentConfig?.github_repo || "";
    const ghSelect = document.getElementById("github-repo-select");
    if (ghSelect.value && ghSelect.selectedOptions[0]) {
      githubOwner = ghSelect.selectedOptions[0].dataset.owner || "";
      githubRepo = ghSelect.selectedOptions[0].dataset.name || "";
    }

    const notionDbId = document.getElementById("notion-db-select").value ||
      currentConfig?.notion_database_id || "";

    await invoke("set_config", {
      geminiApiKey: document.getElementById("gemini-api-key").value.trim() || null,
      retroTone: document.getElementById("retro-tone").value || null,
      customTone: document.getElementById("custom-tone").value.trim() || null,
      retroLanguage: document.getElementById("retro-language").value || null,
      retroTime: document.getElementById("retro-time").value || null,
      storageType: null,
      saveLocal: document.getElementById("save-local").checked,
      saveGithub: document.getElementById("save-github").checked,
      saveNotion: document.getElementById("save-notion").checked,
      localSavePath: document.getElementById("local-save-path").value || null,
      githubToken: null,
      githubOwner: githubOwner || null,
      githubRepo: githubRepo || null,
      githubFolder: document.getElementById("github-folder").value.trim() || null,
      notionToken: null,
      notionDatabaseId: notionDbId || null,
      excludedApps: null,
      awApiBase: null,
    });
    await loadStatus();
    currentConfig = await invoke("get_config");
    updateSettingsSummaries();
    showToast();
  } catch (e) {
    console.error("Failed to save config:", e);
  }
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.textContent = t('toast.saved');
  toast.classList.remove("hidden");
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1500);
}

// --- Settings Navigation ---
function initSettingsNav() {
  // Settings card → push detail view
  document.querySelectorAll(".settings-card").forEach((card) => {
    card.addEventListener("click", () => {
      const detailId = "settings-detail-" + card.dataset.detail;
      document.getElementById("settings-main").classList.remove("active");
      document.getElementById(detailId).classList.add("active");

      if (card.dataset.detail === "data") {
        checkAwConnection();
      }
    });
  });

  // Back buttons → pop to settings main
  document.querySelectorAll(".nav-back-btn[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".settings-detail").forEach((d) => d.classList.remove("active"));
      document.getElementById("settings-main").classList.add("active");
      updateSettingsSummaries();
    });
  });
}

// --- Custom Tone Toggle ---
function toggleCustomTone() {
  const toneSelect = document.getElementById("retro-tone");
  const customGroup = document.getElementById("custom-tone-group");
  customGroup.style.display = toneSelect.value === "custom" ? "" : "none";
}

// --- Summary Text Updates ---
function updateSettingsSummaries() {
  // AI summary
  const toneMap = {
    diary: t('summary.tone_diary'),
    blog: t('summary.tone_blog'),
    bullet: t('summary.tone_bullet'),
    custom: t('summary.tone_custom'),
  };
  const langMap = {
    ko: t('summary.lang_ko'),
    en: t('summary.lang_en'),
  };
  const toneVal = document.getElementById("retro-tone").value;
  const tone = toneVal === "custom"
    ? (document.getElementById("custom-tone").value || t('summary.tone_custom'))
    : (toneMap[toneVal] || t('summary.tone_diary'));
  const lang = langMap[document.getElementById("retro-language").value] || t('summary.lang_ko');
  const time = document.getElementById("retro-time").value || "23:50";
  document.getElementById("ai-summary").textContent = `${tone} · ${lang} · ${time}`;

  // Storage summary
  const storages = [];
  if (document.getElementById("save-local").checked) storages.push(t('storage.local_summary'));
  if (document.getElementById("save-github").checked) storages.push("GitHub");
  if (document.getElementById("save-notion").checked) storages.push("Notion");
  document.getElementById("storage-summary").textContent = storages.length > 0 ? storages.join(" · ") : t('storage.none');

  // Data source summary
  const excludedCount = (currentConfig?.excluded_apps || []).length;
  document.getElementById("data-summary").textContent = t('data.summary').replace('{count}', excludedCount);

  // Toggle local detail visibility
  const localDetail = document.getElementById("local-detail");
  if (localDetail) {
    localDetail.style.display = document.getElementById("save-local").checked ? "" : "none";
  }
}

// --- AW Connection Check ---
async function checkAwConnection() {
  const badge = document.getElementById("aw-connection-badge");
  badge.textContent = t('badge.checking');
  badge.className = "connection-badge";

  try {
    const connected = await invoke("check_aw_connection");
    if (connected) {
      badge.textContent = t('badge.connected');
      badge.className = "connection-badge connected";
    } else {
      badge.textContent = t('badge.disconnected');
      badge.className = "connection-badge disconnected";
    }
  } catch (e) {
    badge.textContent = t('badge.error');
    badge.className = "connection-badge disconnected";
  }
}

// --- Folder Picker ---
async function pickFolder() {
  try {
    const folder = await invoke("select_save_folder");
    if (folder) {
      document.getElementById("local-save-path").value = folder;
      updateLocalPathHint();
    }
  } catch (e) {
    console.error("Failed to pick folder:", e);
  }
}

// --- Excluded Apps ---
function renderExcludedApps(apps) {
  const list = document.getElementById("excluded-list");
  if (apps.length === 0) {
    list.innerHTML = `<span class="text-muted">${t('data.excluded_none')}</span>`;
    return;
  }

  list.innerHTML = apps
    .map(
      (app) =>
        `<span class="excluded-tag">${escapeHtml(app)}<button data-app="${escapeHtml(app)}">&times;</button></span>`
    )
    .join("");

  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => removeExcludedApp(btn.dataset.app));
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

async function addExcludedApp() {
  const input = document.getElementById("new-excluded-app");
  const appName = input.value.trim();
  if (!appName) return;

  const apps = currentConfig?.excluded_apps || [];
  if (apps.includes(appName)) {
    input.value = "";
    return;
  }
  apps.push(appName);

  try {
    await invoke("set_config", { excludedApps: apps });
    input.value = "";
    await loadConfig();
  } catch (e) {
    console.error("Failed to add excluded app:", e);
  }
}

async function removeExcludedApp(appName) {
  const apps = (currentConfig?.excluded_apps || []).filter((a) => a !== appName);

  try {
    await invoke("set_config", { excludedApps: apps });
    await loadConfig();
  } catch (e) {
    console.error("Failed to remove excluded app:", e);
  }
}

// --- Activities ---
async function loadTodayActivities() {
  try {
    const summary = await invoke("get_today_activities", { language: currentLang });
    const container = document.getElementById("today-activities");
    container.innerHTML = `<pre class="activity-summary">${escapeHtml(summary)}</pre>`;
  } catch (e) {
    console.error("Failed to load today activities:", e);
    document.getElementById("today-activities").innerHTML =
      `<p class="text-muted">${t('activity.no_data')}</p>`;
  }
}

// --- Retrospectives ---
async function loadRetros() {
  try {
    const retros = await invoke("get_recent_retros");
    const container = document.getElementById("retro-list");
    const listTitle = document.getElementById("retro-list-title");

    if (!retros || retros.length === 0) {
      if (listTitle) listTitle.style.display = "none";
      container.innerHTML = `<div class="empty-state">
        <span class="empty-state-icon">&#x1F4DD;</span>
        <p class="empty-state-text">${t('retro.empty_text')}</p>
        <p class="empty-state-sub">${t('retro.empty_sub_list')}</p>
      </div>`;
      return;
    }

    if (listTitle) listTitle.style.display = "";

    container.innerHTML = retros
      .map((r, i) => {
        const badges = [];
        if (r.pushed_github) badges.push('<span class="mini-badge github">GH</span>');
        if (r.pushed_notion) badges.push('<span class="mini-badge notion">N</span>');
        const badgeHtml = badges.length > 0 ? badges.join("") : '<span class="mini-badge local">L</span>';

        return `<div class="retro-item" data-index="${i}">
          <span class="retro-date">${escapeHtml(r.date)}</span>
          <div class="retro-badges">${badgeHtml}</div>
        </div>`;
      })
      .join("");

    window._retros = retros;

    container.querySelectorAll(".retro-item").forEach((item) => {
      item.addEventListener("click", () => {
        const idx = parseInt(item.dataset.index);
        showRetroPreview(window._retros[idx]);
      });
    });
  } catch (e) {
    console.error("Failed to load retros:", e);
  }
}

function showRetroPreview(retro) {
  const title = document.getElementById("retro-preview-title");
  const content = document.getElementById("retro-preview-content");

  title.textContent = retro.date + t('retro.title_suffix');
  content.innerHTML = simpleMarkdown(retro.content);
  document.getElementById("retro-main").style.display = "none";
  document.getElementById("retro-detail").classList.add("active");
}

function simpleMarkdown(text) {
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("### ")) return `<h4>${escapeHtml(trimmed.slice(4))}</h4>`;
      if (trimmed.startsWith("## ")) return `<h3>${escapeHtml(trimmed.slice(3))}</h3>`;
      if (trimmed.startsWith("# ")) return `<h2>${escapeHtml(trimmed.slice(2))}</h2>`;
      if (trimmed.startsWith("- ")) return `<li>${escapeHtml(trimmed.slice(2))}</li>`;
      if (trimmed === "") return "<br/>";
      return `<p>${escapeHtml(trimmed)}</p>`;
    })
    .join("");
}

async function generateNow() {
  const btn = document.getElementById("generate-now-btn");
  const btnText = btn.querySelector(".generate-btn-text");
  const statusEl = document.getElementById("generate-status");

  btn.disabled = true;
  if (btnText) btnText.textContent = t('retro.generating');
  statusEl.classList.remove("hidden", "error", "success");
  statusEl.textContent = t('retro.generating_msg');
  statusEl.classList.add("info");

  try {
    const content = await invoke("generate_now");
    statusEl.textContent = t('retro.generated_ok');
    statusEl.classList.remove("info");
    statusEl.classList.add("success");
    await loadRetros();
    await loadStatus();
  } catch (e) {
    statusEl.textContent = t('retro.generated_fail') + e;
    statusEl.classList.remove("info");
    statusEl.classList.add("error");
  } finally {
    btn.disabled = false;
    if (btnText) btnText.textContent = t('retro.generate_retry');
  }
}

// --- Collapsible Sections ---
function initCollapsible() {
  document.querySelectorAll(".section-header").forEach((header) => {
    header.addEventListener("click", () => {
      const chevron = header.querySelector(".section-chevron");
      const content = header.nextElementSibling;
      if (content) {
        content.classList.toggle("section-content-collapsed");
        if (chevron) chevron.classList.toggle("collapsed");
      }
    });
  });
}

// --- Event Listeners ---
document.getElementById("add-excluded-btn").addEventListener("click", addExcludedApp);
document.getElementById("generate-now-btn").addEventListener("click", generateNow);
document.getElementById("check-aw-btn").addEventListener("click", checkAwConnection);

// Retro back button
const retroBackBtn = document.getElementById("retro-back-btn");
if (retroBackBtn) {
  retroBackBtn.addEventListener("click", () => {
    document.getElementById("retro-detail").classList.remove("active");
    document.getElementById("retro-main").style.display = "";
  });
}

document.getElementById("new-excluded-app").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addExcludedApp();
});

// Folder picker
document.getElementById("pick-folder-btn").addEventListener("click", pickFolder);

// GitHub events
document.getElementById("open-github-token-btn").addEventListener("click", async () => {
  try { await invoke("open_github_token_page"); } catch (e) { console.error(e); }
});
document.getElementById("github-connect-btn").addEventListener("click", connectGitHub);
document.getElementById("github-disconnect-btn").addEventListener("click", disconnectGitHub);
document.getElementById("github-test-btn").addEventListener("click", testGitHub);
document.getElementById("github-repo-select").addEventListener("change", () => {
  updateGitHubPathHint();
  debouncedSaveConfig();
});
document.getElementById("github-folder").addEventListener("input", () => {
  updateGitHubPathHint();
  debouncedSaveConfig();
});

// Notion events
document.getElementById("open-notion-integration-btn").addEventListener("click", async () => {
  try { await invoke("open_notion_integration_page"); } catch (e) { console.error(e); }
});
document.getElementById("notion-connect-btn").addEventListener("click", connectNotion);
document.getElementById("notion-disconnect-btn").addEventListener("click", disconnectNotion);
document.getElementById("notion-test-btn").addEventListener("click", testNotion);

// Auto-save on all settings inputs
document.getElementById("gemini-api-key").addEventListener("input", debouncedSaveConfig);
document.getElementById("retro-tone").addEventListener("change", () => {
  toggleCustomTone();
  debouncedSaveConfig();
});
document.getElementById("custom-tone").addEventListener("input", debouncedSaveConfig);
document.getElementById("retro-language").addEventListener("change", () => {
  const lang = document.getElementById("retro-language").value;
  applyLanguage(lang);
  debouncedSaveConfig();
});
document.getElementById("retro-time").addEventListener("change", debouncedSaveConfig);
document.getElementById("save-local").addEventListener("change", () => {
  const localDetail = document.getElementById("local-detail");
  if (localDetail) localDetail.style.display = document.getElementById("save-local").checked ? "" : "none";
  debouncedSaveConfig();
});
document.getElementById("save-github").addEventListener("change", debouncedSaveConfig);
document.getElementById("save-notion").addEventListener("change", debouncedSaveConfig);
document.getElementById("notion-db-select").addEventListener("change", debouncedSaveConfig);

// --- Init ---
document.addEventListener("DOMContentLoaded", async () => {
  initTabs();
  initSettingsNav();
  initCollapsible();
  initOnboardingEvents();

  // Check AW before loading everything else
  await initOnboarding();

  await loadStatus();
  await loadConfig();
  updateSettingsSummaries();
  await loadTodayActivities();
  await loadRetros();

  // Auto-refresh status + activities every 30 seconds
  setInterval(async () => {
    await loadStatus();
    await loadTodayActivities();
  }, 30000);
});

// Listen for navigation events from tray
listen("navigate", (event) => {
  navigateToTab(event.payload);
});
