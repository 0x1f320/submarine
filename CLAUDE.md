# submarine

pnpm workspaces monorepo with Turborepo. Desktop app (Tauri v2) with shared TypeScript packages.

## Commands

- `pnpm dev` — Tauri dev mode (frontend + Rust simultaneously)
- `pnpm build` — Build all packages (via Turborepo, with caching)
- `pnpm typecheck` — TypeScript type-check all packages (via Turborepo)
- `pnpm check` — Biome lint + format check
- `pnpm check:fix` — Biome auto-fix
- `pnpm --filter <package> <script>` — Run a script in a specific package

## Code Style

### TypeScript (Frontend)

- **Formatter/Linter**: Biome (tabs, recommended rules)
- **One file per function** — Utilities, hooks, and components each go in their own file. Each file has a single responsibility.
- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled.
- **Import sorting**: Biome `organizeImports`.

### Rust (Backend)

- **Module-based organization** — Rust code is organized by module (`mod`), not one-file-per-function. Cohesive functionality lives in a single module; only expose the minimum public interface via `pub`.
- **`cargo fmt`** for formatting, **`cargo clippy`** for linting. Clippy is configured with `clippy::all` + `clippy::pedantic` warnings in `Cargo.toml`.

## Git Workflow

- **All PRs use squash merge.** No merge commits or rebase merges.
- **PR titles follow [Conventional Commits](https://www.conventionalcommits.org/).** Examples: `feat: add settings page`, `fix: handle null window title`, `refactor: extract ipc handler`.
- **Issue titles are written in natural language.** Do not use conventional commit prefixes in issue titles.

## Project Structure

```
├── turbo.json              # Turborepo task definitions
├── biome.json              # Shared Biome config (lint + format)
├── pnpm-workspace.yaml     # Workspace: apps/*, packages/*
│
├── apps/
│   └── desktop/            # @submarine/desktop — Tauri v2 desktop app
│       ├── src/            # Frontend (React 19 + TypeScript + Vite)
│       │   ├── main.tsx    # React app entry point
│       │   ├── App.tsx     # Root component
│       │   └── assets/
│       ├── src-tauri/      # Backend (Rust + Tauri)
│       │   ├── src/
│       │   │   ├── main.rs # Tauri entry point
│       │   │   └── lib.rs  # Tauri commands, plugin registration
│       │   ├── Cargo.toml
│       │   ├── tauri.conf.json
│       │   ├── capabilities/
│       │   └── icons/
│       ├── index.html
│       ├── vite.config.ts
│       └── tsconfig.json   # extends @submarine/typescript-config/react-app.json
│
└── packages/
    ├── typescript-config/  # @submarine/typescript-config — shared tsconfig presets
    │   ├── base.json       # Common strict settings
    │   ├── library.json    # TS library (declaration output)
    │   ├── react-library.json  # React library (jsx + DOM + declaration)
    │   ├── react-app.json  # React app (noEmit, bundler)
    │   └── vite.json       # Vite config (composite)
    ├── mcp/                # @submarine/mcp
    │   ├── src/
    │   └── tsconfig.json   # extends @submarine/typescript-config/library.json
    └── react/              # @submarine/react
        ├── src/
        └── tsconfig.json   # extends @submarine/typescript-config/react-library.json
```
