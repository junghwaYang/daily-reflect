#!/usr/bin/env python3
"""Take a settings tab screenshot of the Daily Reflect desktop app."""

import os, pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent.parent
HTML_PATH = ROOT / "apps" / "agent" / "src" / "index.html"
OUT_DIR = ROOT / "docs" / "screenshots"

TAURI_SHIM = """
window.__TAURI__ = {
  core: { invoke: async () => ({}) },
  event: { listen: async () => () => {} },
  shell: { open: async () => {} },
};
"""

SHOW_SETTINGS = """
// Hide onboarding
const onb = document.getElementById("onboarding-screen");
if (onb) onb.classList.add("hidden");

// Show tab bar
const tabBar = document.querySelector(".tab-bar");
if (tabBar) tabBar.style.display = "";

// Activate settings tab
document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
document.getElementById("tab-settings").classList.add("active");

// Show settings main panel
document.querySelectorAll(".view-panel").forEach(p => p.classList.remove("active"));
document.getElementById("settings-main").classList.add("active");

// Tab bar icon
document.querySelectorAll(".tab-bar-item").forEach(b => b.classList.remove("active"));
document.querySelector('.tab-bar-item[data-nav="settings"]').classList.add("active");

// Realistic summaries
document.getElementById("ai-summary").textContent = "일기체 · 한국어 · 23:50";
document.getElementById("storage-summary").textContent = "로컬 · GitHub";
document.getElementById("data-summary").textContent = "ActivityWatch · 제외 앱 2개";
"""


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        ctx = browser.new_context(
            viewport={"width": 420, "height": 720},
            device_scale_factor=2,
        )
        page = ctx.new_page()
        page.add_init_script(TAURI_SHIM)
        page.goto(f"file://{HTML_PATH}")
        page.wait_for_timeout(500)
        page.evaluate(SHOW_SETTINGS)
        page.wait_for_timeout(300)

        out = OUT_DIR / "screenshot-settings.png"
        page.screenshot(path=str(out), type="png")
        print(f"✅ Settings screenshot saved: {out}")

        browser.close()


if __name__ == "__main__":
    main()
