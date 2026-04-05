# submarine

Tauri v2 desktop app. Frontend is React 19 + TypeScript + Vite, backend is Rust (Tauri).

## Commands

- `pnpm dev` — Vite dev server (port 1420)
- `pnpm build` — TypeScript check + Vite build
- `pnpm check` — Biome lint + format check
- `pnpm check:fix` — Biome auto-fix
- `pnpm tauri dev` — Tauri dev mode (frontend + Rust simultaneously)
- `pnpm tauri build` — Production build

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
src/                    # Frontend (React + TypeScript)
├── main.tsx            # React app entry point
├── App.tsx             # Root component
├── App.css
├── assets/
└── vite-env.d.ts

src-tauri/              # Backend (Rust + Tauri)
├── src/
│   ├── main.rs         # Tauri entry point
│   └── lib.rs          # Tauri commands, plugin registration
├── Cargo.toml
├── tauri.conf.json     # Tauri configuration
├── capabilities/
└── icons/
```
