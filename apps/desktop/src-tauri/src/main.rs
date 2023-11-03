#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};
use window_ext::WindowExt;

mod window_ext;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_watch::init())
        .setup(|app| {
            let win = app.get_window("main").unwrap();
            win.set_transparent_titlebar(true);
            win.position_traffic_lights(14.0, 16.0);
            Ok(())
        })
        .on_window_event(|e| {

            let apply_offset = || {
                let win = e.window();
                win.position_traffic_lights(14.0, 16.0);
                
            };

            match e.event() {
                WindowEvent::Resized(..) => apply_offset(),
                WindowEvent::ThemeChanged(..) => apply_offset(),
                _ => {}
            }

        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

