import { chromium } from "playwright";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.resolve(__dirname, "../../apps/agent/src/index.html");
const outputPath = path.resolve(__dirname, "screenshot-settings.png");

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 420, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Suppress Tauri API errors
  await page.addInitScript(() => {
    window.__TAURI__ = {
      core: { invoke: async () => ({}) },
      event: { listen: async () => () => {} },
      shell: { open: async () => {} },
    };
  });

  await page.goto(`file://${htmlPath}`);
  await page.waitForTimeout(300);

  // Manipulate DOM to show settings tab
  await page.evaluate(() => {
    // Hide onboarding
    const onb = document.getElementById("onboarding-screen");
    if (onb) onb.classList.add("hidden");

    // Show tab bar
    const tabBar = document.querySelector(".tab-bar");
    if (tabBar) tabBar.style.display = "";

    // Activate settings tab
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
    const settingsTab = document.getElementById("tab-settings");
    if (settingsTab) settingsTab.classList.add("active");

    // Show settings main panel
    document.querySelectorAll(".view-panel").forEach((p) => p.classList.remove("active"));
    const settingsMain = document.getElementById("settings-main");
    if (settingsMain) settingsMain.classList.add("active");

    // Update tab bar icons
    document.querySelectorAll(".tab-bar-item").forEach((b) => b.classList.remove("active"));
    const settingsBtn = document.querySelector('.tab-bar-item[data-nav="settings"]');
    if (settingsBtn) settingsBtn.classList.add("active");

    // Set realistic summary texts
    const aiSummary = document.getElementById("ai-summary");
    if (aiSummary) aiSummary.textContent = "일기체 · 한국어 · 23:50";

    const storageSummary = document.getElementById("storage-summary");
    if (storageSummary) storageSummary.textContent = "로컬 · GitHub";

    const dataSummary = document.getElementById("data-summary");
    if (dataSummary) dataSummary.textContent = "ActivityWatch · 제외 앱 2개";
  });

  await page.waitForTimeout(200);
  await page.screenshot({ path: outputPath, type: "png" });
  console.log("Screenshot saved:", outputPath);

  await browser.close();
})();
