# submarine

Tauri v2 데스크톱 앱. 프론트엔드는 React 19 + TypeScript + Vite, 백엔드는 Rust (Tauri).

## Commands

- `pnpm dev` — Vite dev server (port 1420)
- `pnpm build` — TypeScript 체크 + Vite 빌드
- `pnpm check` — Biome lint + format 체크
- `pnpm check:fix` — Biome 자동 수정
- `pnpm tauri dev` — Tauri 개발 모드 (프론트엔드 + Rust 동시 실행)
- `pnpm tauri build` — 프로덕션 빌드

## Code Style

### TypeScript (Frontend)

- **Formatter/Linter**: Biome (tabs, recommended rules)
- **One file per function** — 유틸리티, 훅, 컴포넌트는 각각 개별 파일로 분리. 파일 하나가 하나의 책임을 갖는다.
- **TypeScript strict mode** — `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` 활성화.
- **Import 정렬**: Biome `organizeImports` 사용.

### Rust (Backend)

- **모듈 단위 구성** — Rust는 파일 단위가 아닌 모듈(`mod`) 단위로 구성한다. 관련 기능을 하나의 모듈에 응집시키고, 공개 인터페이스는 `pub`로 최소한만 노출한다.
- **`cargo fmt`** + **`cargo clippy`** 로 포맷팅/린트.

## Git Workflow

- **PR은 squash merge**로 통일한다. merge commit이나 rebase merge를 사용하지 않는다.
- **PR 타이틀은 [Conventional Commits](https://www.conventionalcommits.org/) 형식을 따른다.** 예: `feat: add settings page`, `fix: handle null window title`, `refactor: extract ipc handler`.
- **이슈 타이틀은 자연어로 작성한다.** Conventional Commits 접두사를 붙이지 않는다.

## Project Structure

```
src/                    # Frontend (React + TypeScript)
├── main.tsx            # React 앱 진입점
├── App.tsx             # 루트 컴포넌트
├── App.css
├── assets/
└── vite-env.d.ts

src-tauri/              # Backend (Rust + Tauri)
├── src/
│   ├── main.rs         # Tauri 진입점
│   └── lib.rs          # Tauri commands, 플러그인 등록
├── Cargo.toml
├── tauri.conf.json     # Tauri 설정
├── capabilities/
└── icons/
```
