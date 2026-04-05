use sea_orm::sea_query::{ColumnDef, Table};
use sea_orm::{Database, DatabaseConnection, DbErr, Schema};
use sea_orm_migration::prelude::*;

use crate::entity;

pub struct Migrator;

impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(CreateProjectTable),
            Box::new(CreatePageTable),
            Box::new(CreateCommitTable),
            Box::new(AddHostToProject),
        ]
    }
}

// ---------------------------------------------------------------------------
// m20260405_000001 — Create project table
// ---------------------------------------------------------------------------

struct CreateProjectTable;

impl MigrationName for CreateProjectTable {
    fn name(&self) -> &'static str {
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

// ---------------------------------------------------------------------------
// m20260406_000001 — Create page table
// ---------------------------------------------------------------------------

struct CreatePageTable;

impl MigrationName for CreatePageTable {
    fn name(&self) -> &'static str {
        "m20260406_000001_create_page"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for CreatePageTable {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let schema = Schema::new(manager.get_database_backend());
        manager
            .create_table(schema.create_table_from_entity(entity::page::Entity))
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(entity::page::Entity).to_owned())
            .await
    }
}

// ---------------------------------------------------------------------------
// m20260406_000002 — Create commit table
// ---------------------------------------------------------------------------

struct CreateCommitTable;

impl MigrationName for CreateCommitTable {
    fn name(&self) -> &'static str {
        "m20260406_000002_create_commit"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for CreateCommitTable {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let schema = Schema::new(manager.get_database_backend());
        manager
            .create_table(schema.create_table_from_entity(entity::commit::Entity))
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(entity::commit::Entity).to_owned())
            .await
    }
}

// ---------------------------------------------------------------------------
// m20260406_000003 — Add host column to project
// ---------------------------------------------------------------------------

struct AddHostToProject;

impl MigrationName for AddHostToProject {
    fn name(&self) -> &'static str {
        "m20260406_000003_add_host_to_project"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for AddHostToProject {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(entity::project::Entity)
                    .add_column(
                        ColumnDef::new(entity::project::Column::Host)
                            .string()
                            .not_null()
                            .default(""),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(entity::project::Entity)
                    .drop_column(entity::project::Column::Host)
                    .to_owned(),
            )
            .await
    }
}

pub async fn init(db_path: &str) -> Result<DatabaseConnection, DbErr> {
    let db_url = format!("sqlite://{db_path}?mode=rwc");
    let db = Database::connect(&db_url).await?;
    Migrator::up(&db, None).await?;
    Ok(db)
}
