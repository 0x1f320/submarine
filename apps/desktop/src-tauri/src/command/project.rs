use sea_orm::{ActiveModelTrait, DatabaseConnection, EntityTrait, Set};
use tauri::State;

use crate::entity::project;

#[tauri::command]
#[specta::specta]
pub async fn list_projects(
	db: State<'_, DatabaseConnection>,
) -> Result<Vec<project::Model>, String> {
	project::Entity::find()
		.all(db.inner())
		.await
		.map_err(|e| e.to_string())
}

#[tauri::command]
#[specta::specta]
pub async fn create_project(
	db: State<'_, DatabaseConnection>,
	name: String,
	path: String,
) -> Result<project::Model, String> {
	let model = project::ActiveModel {
		name: Set(name),
		path: Set(path),
		..Default::default()
	};
	model.insert(db.inner()).await.map_err(|e| e.to_string())
}
