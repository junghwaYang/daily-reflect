const { invoke } = window.__TAURI__.core;
const { listen } = window.__TAURI__.event;

let currentConfig = null;

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
  const os = detectOS();
  const base = "https://activitywatch.net/downloads/";
  // Direct to downloads page; OS-specific deep links aren't stable across releases
  return base;
}

function getDownloadLabel() {
  const os = detectOS();
  if (os === "mac") return "macOS용 ActivityWatch 다운로드";
  if (os === "windows") return "Windows용 ActivityWatch 다운로드";
  return "Linux용 ActivityWatch 다운로드";
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
      if (statusEl) statusEl.querySelector("span").textContent = "ActivityWatch 연결됨!";
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
    // Try Tauri shell plugin JS API (available if plugin is initialized with JS bindings)
    try {
      const shellModule = window.__TAURI__?.shell;
      if (shellModule?.open) {
        await shellModule.open(url);
        return;
      }
    } catch { /* fall through */ }
    // Fallback: invoke existing open-URL pattern via shell
    try {
      // Use the open_github_token_page trick: invoke a known open command isn't feasible,
      // so we rely on the Tauri webview treating window.open as external link
      window.open(url, "_blank");
    } catch { /* ignore */ }
  });

  // Manual check button
  document.getElementById("onboarding-check-btn").addEventListener("click", async () => {
    const btn = document.getElementById("onboarding-check-btn");
    const statusEl = document.getElementById("onboarding-polling-status");
    btn.disabled = true;
    btn.textContent = "확인 중...";

    const online = await checkAwOnline();
    if (online) {
      const dot = statusEl.querySelector(".onboarding-polling-dot");
      if (dot) dot.classList.add("connected");
      statusEl.querySelector("span").textContent = "ActivityWatch 연결됨!";
      stopOnboardingPoll();
      setTimeout(() => {
        hideOnboarding();
        _awWasConnected = true;
        loadAwStats();
      }, 800);
    } else {
      statusEl.querySelector("span").textContent = "아직 연결되지 않았습니다";
      btn.disabled = false;
      btn.textContent = "연결 확인";
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
      trackingText.textContent = "ActivityWatch 연결됨";
      awSub.textContent = "활동 데이터를 가져오고 있습니다";
      _awWasConnected = true;
      hideBanner();
    } else {
      trackingDot.className = "hero-status-dot paused";
      trackingText.textContent = "ActivityWatch 미연결";
      awSub.textContent = "ActivityWatch를 실행해주세요";
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
      todayActiveTime.textContent = `${activeHours}시간 ${activeRemainingMins}분`;
    } else {
      todayActiveTime.textContent = `${activeRemainingMins}분`;
    }

    if (idleHours > 0) {
      todayIdleTime.textContent = `${idleHours}시간 ${idleRemainingMins}분`;
    } else {
      todayIdleTime.textContent = `${idleRemainingMins}분`;
    }

    todayCount.textContent = (stats.event_count || 0).toLocaleString();
  } catch (e) {
    console.error("Failed to load AW stats:", e);
    if (trackingDot) trackingDot.className = "hero-status-dot paused";
    if (trackingText) trackingText.textContent = "AW 연결 실패";
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
    document.getElementById("retro-language").value = currentConfig.retro_language || "ko";
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
    hint.textContent = `${path}/${year}/${today}.md 형태로 저장됩니다`;
  }
}

function updateGitHubPathHint() {
  const select = document.getElementById("github-repo-select");
  const folder = document.getElementById("github-folder").value || "retrospectives";
  const hint = document.getElementById("github-path-hint");
  const today = new Date().toISOString().slice(0, 10);
  if (select.value) {
    hint.textContent = `${select.value}/${folder}/${today}.md 형태로 커밋됩니다`;
  } else {
    hint.textContent = "";
  }
}

// --- GitHub ---
async function showGitHubConnected() {
  document.getElementById("github-setup").classList.add("hidden");
  document.getElementById("github-connected").classList.remove("hidden");
  document.getElementById("github-status-badge").textContent = "연결됨";
  document.getElementById("github-status-badge").className = "connection-badge connected";

  try {
    const select = document.getElementById("github-repo-select");
    select.innerHTML = '<option value="">로딩 중...</option>';
    const repos = await invoke("fetch_github_repos", { token: currentConfig.github_token });
    select.innerHTML = '<option value="">레포 선택...</option>';
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
      '<option value="">레포 목록 불러오기 실패</option>';
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
  btn.textContent = "연결 중...";
  errEl.classList.add("hidden");

  try {
    await invoke("fetch_github_repos", { token });
    currentConfig.github_token = token;
    await invoke("set_config", { githubToken: token });
    await loadConfig();
  } catch (e) {
    errEl.textContent = "연결 실패: " + e;
    errEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "연결";
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
    resultEl.textContent = "레포를 선택해주세요";
    resultEl.className = "connect-message error";
    resultEl.classList.remove("hidden");
    return;
  }

  resultEl.textContent = "테스트 중...";
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
  document.getElementById("notion-status-badge").textContent = "연결됨";
  document.getElementById("notion-status-badge").className = "connection-badge connected";

  try {
    const select = document.getElementById("notion-db-select");
    select.innerHTML = '<option value="">로딩 중...</option>';
    const dbs = await invoke("fetch_notion_databases", { token: currentConfig.notion_token });
    select.innerHTML = '<option value="">데이터베이스 선택...</option>';
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
      '<option value="">데이터베이스 불러오기 실패</option>';
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
  btn.textContent = "연결 중...";
  errEl.classList.add("hidden");

  try {
    await invoke("fetch_notion_databases", { token });
    currentConfig.notion_token = token;
    await invoke("set_config", { notionToken: token });
    await loadConfig();
  } catch (e) {
    errEl.textContent = "연결 실패: " + e;
    errEl.classList.remove("hidden");
  } finally {
    btn.disabled = false;
    btn.textContent = "연결";
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
    resultEl.textContent = "데이터베이스를 선택해주세요";
    resultEl.className = "connect-message error";
    resultEl.classList.remove("hidden");
    return;
  }

  resultEl.textContent = "테스트 중...";
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
  const toneMap = { diary: "일기체", blog: "블로그", bullet: "불렛", custom: "커스텀" };
  const langMap = { ko: "한국어", en: "English" };
  const toneVal = document.getElementById("retro-tone").value;
  const tone = toneVal === "custom"
    ? (document.getElementById("custom-tone").value || "커스텀")
    : (toneMap[toneVal] || "일기체");
  const lang = langMap[document.getElementById("retro-language").value] || "한국어";
  const time = document.getElementById("retro-time").value || "23:50";
  document.getElementById("ai-summary").textContent = `${tone} · ${lang} · ${time}`;

  // Storage summary
  const storages = [];
  if (document.getElementById("save-local").checked) storages.push("로컬");
  if (document.getElementById("save-github").checked) storages.push("GitHub");
  if (document.getElementById("save-notion").checked) storages.push("Notion");
  document.getElementById("storage-summary").textContent = storages.length > 0 ? storages.join(" · ") : "없음";

  // Data source summary
  const excludedCount = (currentConfig?.excluded_apps || []).length;
  document.getElementById("data-summary").textContent = `ActivityWatch · 제외 앱 ${excludedCount}개`;

  // Toggle local detail visibility
  const localDetail = document.getElementById("local-detail");
  if (localDetail) {
    localDetail.style.display = document.getElementById("save-local").checked ? "" : "none";
  }
}

// --- AW Connection Check ---
async function checkAwConnection() {
  const badge = document.getElementById("aw-connection-badge");
  badge.textContent = "확인 중...";
  badge.className = "connection-badge";

  try {
    const connected = await invoke("check_aw_connection");
    if (connected) {
      badge.textContent = "연결됨";
      badge.className = "connection-badge connected";
    } else {
      badge.textContent = "미연결";
      badge.className = "connection-badge disconnected";
    }
  } catch (e) {
    badge.textContent = "오류";
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
    list.innerHTML = '<span class="text-muted">제외된 앱 없음</span>';
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
    const summary = await invoke("get_today_activities");
    const container = document.getElementById("today-activities");
    container.innerHTML = `<pre class="activity-summary">${escapeHtml(summary)}</pre>`;
  } catch (e) {
    console.error("Failed to load today activities:", e);
    document.getElementById("today-activities").innerHTML =
      '<p class="text-muted">ActivityWatch에서 데이터를 가져올 수 없습니다.</p>';
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
        <p class="empty-state-text">아직 생성된 회고글이 없습니다</p>
        <p class="empty-state-sub">위 버튼을 눌러 오늘의 회고를 시작하세요</p>
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

  title.textContent = retro.date + " 회고";
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
  if (btnText) btnText.textContent = "생성 중...";
  statusEl.classList.remove("hidden", "error", "success");
  statusEl.textContent = "AI 회고글을 생성하고 있습니다...";
  statusEl.classList.add("info");

  try {
    const content = await invoke("generate_now");
    statusEl.textContent = "회고글이 성공적으로 생성되었습니다!";
    statusEl.classList.remove("info");
    statusEl.classList.add("success");
    await loadRetros();
    await loadStatus();
  } catch (e) {
    statusEl.textContent = "생성 실패: " + e;
    statusEl.classList.remove("info");
    statusEl.classList.add("error");
  } finally {
    btn.disabled = false;
    if (btnText) btnText.textContent = "오늘의 회고 생성하기";
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
document.getElementById("retro-language").addEventListener("change", debouncedSaveConfig);
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
