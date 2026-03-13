use crate::buffer::ActivityBuffer;
use crate::config::AppState;
use crate::tracker::AwClient;
use std::sync::Arc;
use tauri::{
    menu::{MenuBuilder, MenuItemBuilder, PredefinedMenuItem},
    AppHandle, Emitter, Manager,
};

pub fn create_tray_menu(app: &AppHandle) -> Result<(), String> {
    let status_item = MenuItemBuilder::with_id("status", "Daily Reflect")
        .enabled(false)
        .build(app)
        .map_err(|e| e.to_string())?;

    let separator1 = PredefinedMenuItem::separator(app).map_err(|e| e.to_string())?;

    let generate_item = MenuItemBuilder::with_id("generate_now", "지금 회고글 생성")
        .build(app)
        .map_err(|e| e.to_string())?;

    let view_activities_item = MenuItemBuilder::with_id("view_activities", "오늘 활동 보기")
        .build(app)
        .map_err(|e| e.to_string())?;

    let separator2 = PredefinedMenuItem::separator(app).map_err(|e| e.to_string())?;

    let settings_item = MenuItemBuilder::with_id("settings", "설정 열기")
        .build(app)
        .map_err(|e| e.to_string())?;

    let quit_item = MenuItemBuilder::with_id("quit", "종료")
        .build(app)
        .map_err(|e| e.to_string())?;

    let menu = MenuBuilder::new(app)
        .item(&status_item)
        .item(&separator1)
        .item(&generate_item)
        .item(&view_activities_item)
        .item(&separator2)
        .item(&settings_item)
        .item(&quit_item)
        .build()
        .map_err(|e| e.to_string())?;

    if let Some(tray) = app.tray_by_id("main") {
        tray.set_menu(Some(menu)).map_err(|e| e.to_string())?;
    }

    Ok(())
}

pub fn handle_tray_menu_event(app: &AppHandle, event: &str) {
    match event {
        "generate_now" => {
            let handle = app.clone();
            tauri::async_runtime::spawn(async move {
                let buffer = handle.state::<Arc<ActivityBuffer>>();
                let state = handle.state::<AppState>();
                let aw = handle.state::<Arc<AwClient>>();
                let config = match state.config.lock() {
                    Ok(c) => c.clone(),
                    Err(e) => {
                        log::error!("Failed to lock app config in tray handler: {}", e);
                        return;
                    }
                };
                match crate::do_generate_retrospective(&buffer, &config, &aw).await {
                    Ok(content) => {
                        log::info!("회고글 생성 완료 (트레이 메뉴): {} bytes", content.len());
                    }
                    Err(e) => {
                        log::error!("회고글 생성 실패: {}", e);
                    }
                }
            });
        }
        "view_activities" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
                let _ = window.emit("navigate", "status");
            }
        }
        "settings" => {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
        }
        "quit" => {
            app.exit(0);
        }
        _ => {}
    }
}
