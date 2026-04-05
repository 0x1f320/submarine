# submarine

pnpm workspaces monorepo with Turborepo. Desktop app (Tauri v2) with shared TypeScript packages.

## Commands

- `pnpm dev` — Tauri dev mode (frontend + Rust simultaneously)
- `pnpm build` — Build all packages (via Turborepo, with caching)
- `pnpm typecheck` — TypeScript type-check all packages (via Turborepo)
- `pnpm check` — Biome lint + format check
- `pnpm check:fix` — Biome auto-fix
- `pnpm --filter <package> <script>` — Run a script in a specific package

## Tech Stack

### Frontend
- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS v4** — via `@tailwindcss/vite` plugin. Theme tokens defined in `app.css` using `@theme inline`.
- **shadcn/ui** — Component library. Components live in `src/components/ui/`. Generated via `npx shadcn@latest add <component>`. Config in `components.json`.
- **Pretendard Variable** — Font bundled locally in `src/assets/fonts/`. Loaded via `@font-face` in `app.css`.

### Backend
- **Tauri v2** — Desktop shell. Config in `src-tauri/tauri.conf.json`, capabilities in `src-tauri/capabilities/`.

### Window
- Custom titlebar: `titleBarStyle: "Overlay"`, `hiddenTitle: true`. Traffic light position set via `trafficLightPosition`.
- `data-tauri-drag-region` on titlebar elements for window dragging.
- Dark mode syncs with Tauri window theme via `getCurrentWindow().setTheme()`.
- Required capabilities: `core:window:allow-start-dragging`, `core:window:allow-set-theme`.

## Code Style

### TypeScript (Frontend)

- **Formatter/Linter**: Biome (tabs, recommended rules). Biome is configured with `tailwindDirectives: true` for Tailwind CSS support.
- **File naming**: All `.ts`/`.tsx` files use **lower kebab-case** (e.g. `metric-card.tsx`, `use-theme.ts`). No PascalCase or camelCase file names.
- **One file per function** — Utilities, hooks, and components each go in their own file. Each file has a single responsibility.
- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` enabled.
- **Import alias**: `@/*` maps to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).
- **Import sorting**: Biome `organizeImports`.
- **shadcn files are excluded from Biome** — `components/ui/**` and `lib/utils.ts` are ignored via `overrides` in `biome.json`. Do not manually format or lint these files.

### Rust (Backend)

- **Module-based organization** — Rust code is organized by module (`mod`), not one-file-per-function. Cohesive functionality lives in a single module; only expose the minimum public interface via `pub`.
- **`cargo fmt`** for formatting, **`cargo clippy`** for linting. Clippy is configured with `clippy::all` + `clippy::pedantic` warnings in `Cargo.toml`.

## Git Workflow

- **All PRs use squash merge.** No merge commits or rebase merges.
- **PR titles follow [Conventional Commits](https://www.conventionalcommits.org/) with scope.** Examples: `feat(web): add settings page`, `fix(tauri): handle null window title`, `refactor(mcp): extract ipc handler`.
- **Issue titles are written in natural language.** Do not use conventional commit prefixes in issue titles.
- **PR content must be written in English.** Titles, descriptions, and test plans are always in English regardless of conversation language.

## Project Structure

```
├── turbo.json              # Turborepo task definitions
├── biome.json              # Shared Biome config (lint + format)
├── pnpm-workspace.yaml     # Workspace: apps/*, packages/*
│
├── apps/
│   └── desktop/            # @submarine/desktop — Tauri v2 desktop app
│       ├── components.json # shadcn/ui config
│       ├── src/            # Frontend (React 19 + TypeScript + Vite)
│       │   ├── main.tsx    # React app entry point
│       │   ├── app.tsx     # Root component
│       │   ├── app.css     # Tailwind imports + theme tokens (light/dark)
│       │   ├── components/ # App components (one per file, kebab-case)
│       │   │   └── ui/     # shadcn/ui generated components (do not edit)
│       │   ├── hooks/      # React hooks (use-theme.ts, use-resize.ts, etc.)
│       │   ├── lib/        # Utilities (utils.ts — shadcn cn() helper)
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
