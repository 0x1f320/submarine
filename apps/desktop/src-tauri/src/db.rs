use sea_orm::sea_query::Table;
use sea_orm::{Database, DatabaseConnection, DbErr, Schema};
use sea_orm_migration::prelude::*;

use crate::entity;

pub struct Migrator;

impl MigratorTrait for Migrator {
	fn migrations() -> Vec<Box<dyn MigrationTrait>> {
		vec![Box::new(CreateProjectTable)]
	}
}

struct CreateProjectTable;

impl MigrationName for CreateProjectTable {
	fn name(&self) -> &str {
		"m20260405_000001_create_project"
	}
}

#[async_trait::async_trait]
impl MigrationTrait for CreateProjectTable {
	async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		let schema = Schema::new(manager.get_database_backend());
		manager
			.create_table(schema.create_table_from_entity(entity::project::Entity))
			.await
	}

	async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
		manager
			.drop_table(Table::drop().table(entity::project::Entity).to_owned())
			.await
	}
}

pub async fn init(db_path: &str) -> Result<DatabaseConnection, DbErr> {
	let db_url = format!("sqlite://{db_path}?mode=rwc");
	let db = Database::connect(&db_url).await?;
	Migrator::up(&db, None).await?;
	Ok(db)
}
