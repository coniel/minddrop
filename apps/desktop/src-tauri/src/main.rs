#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

#[cfg(target_os = "macos")]
#[macro_use]
extern crate objc;

use tauri::{Manager, WindowEvent};
use window_ext::WindowExt;
use trash;

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
        .invoke_handler(tauri::generate_handler![move_to_trash])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
fn move_to_trash(path: String) -> Result<String, String> {
    trash::delete(path).map_err(|err| err.to_string())?;

    Ok("Deleted".to_string())
}
