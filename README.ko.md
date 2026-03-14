# Daily Reflect

🌐 [한국어](README.ko.md) | [English](README.md)

AI가 하루 활동을 분석해 자동으로 회고글을 작성하는 데스크톱 앱.

[ActivityWatch](https://activitywatch.net/)로 수집한 활동 데이터를 바탕으로, Gemini AI가 매일 지정된 시각에 하루를 돌아보는 회고글을 생성합니다. 생성된 글은 로컬 마크다운 파일, GitHub, Notion에 자동 저장됩니다.

## 주요 기능

- **자동 활동 추적** — ActivityWatch와 연동하여 앱 사용 시간, 활동/유휴 시간을 실시간 모니터링
- **AI 회고 자동 생성** — 매일 설정한 시각에 Gemini 2.5 Flash가 하루를 분석하고 회고글 작성
- **다중 저장소** — 로컬 마크다운, GitHub 레포, Notion 데이터베이스에 동시 저장 가능
- **커스텀 글쓰기 스타일** — 일기체, 블로그, 불렛포인트 또는 직접 정의한 톤으로 작성
- **다국어 지원** — 한국어, English
- **시스템 트레이 상주** — 백그라운드에서 동작하며 트레이 메뉴로 빠르게 접근
- **완전한 로컬 데이터** — 모든 활동 데이터는 로컬에서만 처리, 외부 서버 전송 없음

## 스크린샷

| 상태 | 회고 | 설정 |
|:---:|:---:|:---:|
| ![상태](docs/screenshots/screenshot-status.png) | ![회고](docs/screenshots/screenshot-retro.png) | ![설정](docs/screenshots/screenshot-settings.png) |

## 시작하기

### 1. ActivityWatch 설치

Daily Reflect는 활동 데이터 수집을 위해 [ActivityWatch](https://activitywatch.net/)가 필요합니다.

| OS | 다운로드 |
|---|---|
| macOS | [ActivityWatch-macos.dmg](https://activitywatch.net/downloads/) |
| Windows | [ActivityWatch-windows.exe](https://activitywatch.net/downloads/) |
| Linux | [ActivityWatch-linux.zip](https://activitywatch.net/downloads/) |

1. 위 링크에서 OS에 맞는 설치 파일을 다운로드
2. 설치 후 ActivityWatch를 실행 (메뉴바/시스템 트레이에 아이콘 표시)
3. `http://localhost:5600`에서 ActivityWatch 대시보드가 열리면 정상 동작

> ActivityWatch는 오픈소스(MPL-2.0) 활동 트래커로, 모든 데이터가 로컬에 저장됩니다.

### 2. Daily Reflect 설치

#### 빌드된 앱 사용 (권장)

[최신 릴리즈](https://github.com/junghwaYang/daily-reflect/releases/latest)에서 OS에 맞는 파일을 다운로드하세요:

| OS | 파일 | 비고 |
|---|---|---|
| **macOS** | `Daily_Reflect_x.x.x_universal.dmg` | Intel & Apple Silicon ([설치 안내](#macos-첫-실행)) |
| **Windows** | `Daily_Reflect_x.x.x_x64-setup.exe` | 설치 파일 (권장) |
| **Linux** | `Daily_Reflect_x.x.x_amd64.AppImage` | 설치 없이 바로 실행 |
| **Linux (Debian/Ubuntu)** | `Daily_Reflect_x.x.x_amd64.deb` | `sudo dpkg -i *.deb` |

#### macOS 첫 실행

Daily Reflect는 Apple 공증을 받지 않은 앱이라 macOS Gatekeeper가 첫 실행을 차단합니다.

1. [릴리즈 페이지](https://github.com/junghwaYang/daily-reflect/releases/latest)에서 `.dmg`와 함께 `fix-macos.command` 다운로드
2. `.dmg`에서 앱 설치 (Applications 폴더로 드래그)
3. `fix-macos.command` 더블클릭 — 제한 해제 후 앱이 자동 실행됩니다

#### Windows 첫 실행

Windows SmartScreen 경고가 나타날 수 있습니다. **추가 정보** → **실행** 을 클릭하세요.

#### 소스에서 빌드

```bash
# 저장소 클론
git clone https://github.com/junghwaYang/daily-reflect.git
cd daily-reflect

# 의존성 설치
pnpm install

# 개발 모드 실행
cd apps/agent
npx tauri dev

# 프로덕션 빌드
npx tauri build
```

**빌드 요구사항:**
- Node.js 18+
- pnpm 9+
- Rust 1.75+
- [Tauri 2 prerequisites](https://v2.tauri.app/start/prerequisites/)

### 3. 초기 설정

앱을 처음 실행하면 ActivityWatch 연결 상태를 자동으로 확인합니다.

1. **ActivityWatch 연결** — AW가 실행 중이면 자동 감지되어 메인 화면으로 전환
2. **AI 설정** — 설정 > AI 글쓰기에서 Gemini API 키 입력
3. **저장소 설정** — 설정 > 저장 위치에서 원하는 저장소 활성화
4. **생성 시각** — 설정 > AI 글쓰기에서 회고 자동 생성 시각 지정 (기본 23:50)

### Gemini API 키 발급

1. [Google AI Studio](https://aistudio.google.com/apikey)에 접속
2. "Create API Key" 클릭
3. 생성된 키(`AIza...`)를 앱 설정에 입력

## 사용법

### 상태 탭

- ActivityWatch 연결 상태 확인
- 오늘의 활동 시간, 유휴 시간, 이벤트 수 실시간 표시
- 앱별 상세 활동 내역 확인

### 회고 탭

- 자동 생성된 회고글 목록 확인
- 각 회고글 클릭하여 전체 내용 확인
- "수동으로 회고 생성하기" 버튼으로 즉시 생성 가능

### 설정 탭

#### AI 글쓰기
- **AI 연결 키** — Gemini API 키
- **글쓰기 톤** — 일기체 / 블로그 / 불렛포인트 / 커스텀
- **언어** — 한국어 / English
- **생성 시각** — 매일 자동 생성 시각 (HH:MM)

#### 저장 위치
- **로컬 저장** — 지정 폴더에 `YYYY/YYYY-MM-DD.md` 형식으로 저장
- **GitHub** — 지정 레포에 자동 커밋 (Personal Access Token 필요, `repo` scope)
- **Notion** — 지정 데이터베이스에 새 페이지 생성 (Internal Integration Token 필요)

#### 데이터 소스
- ActivityWatch 연결 상태 확인
- 회고에서 제외할 앱 목록 관리

## 프로젝트 구조

```
daily-reflect/
├── apps/
│   ├── agent/                  # Tauri 데스크톱 앱
│   │   ├── src/                # 프론트엔드 (HTML/CSS/JS)
│   │   │   ├── index.html
│   │   │   ├── main.js
│   │   │   └── styles.css
│   │   └── src-tauri/          # 백엔드 (Rust)
│   │       └── src/
│   │           ├── main.rs     # Tauri 진입점
│   │           ├── lib.rs      # 메인 앱 로직, 커맨드, 스케줄러
│   │           ├── tracker.rs  # ActivityWatch API 클라이언트
│   │           ├── ai.rs       # Gemini AI 연동
│   │           ├── config.rs   # 설정 관리 (JSON)
│   │           ├── buffer.rs   # SQLite 로컬 저장소
│   │           ├── github.rs   # GitHub Contents API 연동
│   │           ├── notion.rs   # Notion API 연동
│   │           └── tray.rs     # 시스템 트레이 메뉴
│   └── web/                    # 랜딩 페이지 (Next.js)
├── docs/                       # 문서 및 스크린샷
├── packages/
│   └── shared/                 # 공유 타입/상수
├── supabase/                   # DB 스키마 및 시드
├── .github/workflows/          # CI/CD (GitHub Pages 배포)
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

## 기술 스택

| 영역 | 기술 |
|---|---|
| 데스크톱 프레임워크 | Tauri 2 |
| 백엔드 | Rust |
| 프론트엔드 | HTML/CSS/JS (vanilla) |
| AI | Gemini 2.5 Flash |
| 활동 추적 | ActivityWatch API |
| 로컬 DB | SQLite (rusqlite) |
| 외부 저장소 | GitHub API, Notion API |
| 웹 | Next.js 16, React 19, Tailwind CSS 4, shadcn/ui |
| DB | Supabase (PostgreSQL) |
| 빌드 | pnpm + Turborepo |

## 개인정보 보호

- 모든 활동 데이터는 **로컬에서만** 수집·처리됩니다
- ActivityWatch 데이터는 `localhost:5600`에서만 접근
- AI 회고 생성 시에만 활동 요약이 Gemini API로 전송됩니다
- GitHub/Notion 저장은 사용자가 명시적으로 활성화한 경우에만 동작

## 배포

랜딩 페이지는 `main` 브랜치의 `apps/web/` 경로에 변경이 푸시되면 **GitHub Pages**로 자동 배포됩니다.

- **URL**: [https://junghwayang.github.io/daily-reflect](https://junghwayang.github.io/daily-reflect)
- **워크플로우**: `.github/workflows/deploy-web.yml`
- **트리거**: `main` 브랜치 푸시 (경로: `apps/web/**`)

## 라이선스

MIT

## 기여

이슈와 PR을 환영합니다. [Issues](https://github.com/junghwaYang/daily-reflect/issues)에서 버그 리포트나 기능 제안을 남겨주세요.
