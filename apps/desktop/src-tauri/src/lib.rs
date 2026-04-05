use tauri::Manager;
use tauri_specta::{collect_commands, Builder};

mod command;
mod db;
mod entity;
mod socket;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let builder = Builder::<tauri::Wry>::new().commands(collect_commands![
        command::project::list_projects,
        command::project::create_project,
        command::page::list_pages,
        command::commit::list_commits,
        command::socket::get_socket_port,
        command::socket::get_socket_status,
    ]);

    #[cfg(debug_assertions)]
    builder
        .export(
            specta_typescript::Typescript::default(),
            "../src/bindings.ts",
        )
        .expect("Failed to export TypeScript bindings");

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(builder.invoke_handler())
        .setup(|app| {
            // Database
            let app_data_dir = app.path().app_data_dir()?;
            std::fs::create_dir_all(&app_data_dir)?;
            let db_path = app_data_dir.join("submarine.db");

            let db = tauri::async_runtime::block_on(db::init(
                db_path.to_str().expect("Invalid DB path"),
            ))
            .expect("Failed to initialize database");

            // Socket.IO server (needs its own clone before db is moved into manage)
            let socket_state = tauri::async_runtime::block_on(socket::start(db.clone()));

            app.manage(db);
            app.manage(socket_state);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
