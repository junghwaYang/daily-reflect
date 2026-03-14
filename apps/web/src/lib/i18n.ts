export type Locale = "ko" | "en";

export const translations = {
  ko: {
    nav: {
      features: "기능",
      howItWorks: "작동 방식",
      privacy: "프라이버시",
      download: "다운로드",
      guide: "가이드",
      changelog: "릴리즈",
      langToggle: "EN",
    },
    hero: {
      badge: "오픈소스 데스크톱 앱",
      headline: "하루를 기록하면,\nAI가 회고를 써줍니다",
      subtitle:
        "컴퓨터 활동을 자동으로 추적하고, Gemini AI가 매일 의미 있는 회고록을 작성해주는 오픈소스 데스크톱 앱",
      cta: "다운로드",
      github: "GitHub",
      trusted: "개발자와 크리에이터가 신뢰하는",
    },
    howItWorks: {
      title: "어떻게 작동하나요?",
      subtitle: "세 단계로 매일 자동 회고가 완성됩니다",
      step1: {
        title: "활동 기록",
        description:
          "ActivityWatch가 어떤 앱을 사용했는지, 어떤 웹사이트를 방문했는지 조용히 기록합니다. 당신은 아무것도 할 필요 없습니다.",
        visual: "tracking",
      },
      step2: {
        title: "패턴 분석",
        description:
          "Daily Reflect가 하루의 활동 데이터를 수집하고, 의미 있는 패턴과 시간 흐름을 분석합니다.",
        visual: "analyzing",
      },
      step3: {
        title: "회고 생성",
        description:
          "Gemini AI가 분석된 데이터를 바탕으로 당신만의 자연스러운 회고글을 자동 작성합니다.",
        visual: "writing",
      },
    },
    features: {
      title: "주요 기능",
      subtitle: "당신의 하루를 더 의미있게 만들어주는 기능들",
      items: [
        {
          title: "자동 활동 추적",
          description: "ActivityWatch 연동으로 앱 사용, 웹 브라우징을 자동 기록. 백그라운드에서 조용히 동작합니다.",
        },
        {
          title: "AI 회고 생성",
          description: "Gemini AI가 활동 데이터를 분석하여 매일 의미 있는 회고글을 작성합니다.",
        },
        {
          title: "다중 저장소",
          description: "로컬 파일, GitHub 저장소, Notion 페이지에 동시 저장이 가능합니다.",
        },
        {
          title: "완전한 프라이버시",
          description: "모든 데이터는 당신의 컴퓨터에서만 처리됩니다. 외부 서버 전송 없음.",
        },
        {
          title: "다국어 지원",
          description: "한국어와 English로 회고글 작성이 가능합니다.",
        },
        {
          title: "커스텀 스타일",
          description: "일기체, 블로그, 불렛포인트 등 원하는 글쓰기 스타일을 선택하세요.",
        },
      ],
    },
    preview: {
      title: "앱 미리보기",
      subtitle: "깔끔한 인터페이스로 하루를 돌아보세요",
      statusLabel: "오늘의 활동",
      retroLabel: "AI 회고",
      statusItems: [
        { app: "VS Code", time: "3시간 42분", percent: 85 },
        { app: "Chrome", time: "2시간 15분", percent: 62 },
        { app: "Slack", time: "45분", percent: 28 },
        { app: "Terminal", time: "32분", percent: 18 },
      ],
      retroText:
        "오늘은 주로 VS Code에서 프론트엔드 작업에 집중했습니다. Chrome에서 기술 문서를 참고하며 새로운 컴포넌트를 구현했고, Slack을 통해 팀원들과 코드 리뷰를 진행했습니다. 생산적인 하루였습니다.",
      generatedBy: "Gemini AI로 생성됨",
      date: "2026년 3월 14일",
      totalTime: "총 활동 시간: 7시간 14분",
    },
    privacy: {
      title: "프라이버시",
      headline: "당신의 데이터는\n당신의 것입니다",
      description: "Daily Reflect는 프라이버시를 최우선으로 설계되었습니다. 모든 활동 데이터는 당신의 컴퓨터에서만 처리되며, 우리는 어떤 데이터도 수집하지 않습니다.",
      points: [
        "활동 데이터는 100% 로컬에서만 처리됩니다",
        "AI API 호출 시에도 최소한의 데이터만 전송합니다",
        "외부 서버에 개인 데이터를 저장하지 않습니다",
        "오픈소스이므로 직접 코드를 확인할 수 있습니다",
      ],
    },
    download: {
      title: "오늘부터 시작하세요",
      subtitle: "무료, 오픈소스. 당신의 하루를 AI와 함께 돌아보세요.",
      cta: "다운로드",
      ctaFor: (os: string) => `${os}용 다운로드`,
      openSource: "오픈소스",
      mit: "MIT 라이선스",
      allDownloads: "전체 다운로드",
      osLabels: { macOS: ".dmg", Windows: ".exe", Linux: ".AppImage" },
      stats: [
        { label: "가격", value: "무료" },
        { label: "라이선스", value: "MIT" },
        { label: "플랫폼", value: "macOS / Windows / Linux" },
      ],
    },
    footer: {
      madeBy: "Made by",
      license: "MIT License",
      openSource: "오픈소스 프로젝트",
      description: "AI 기반 자동 일일 회고 앱",
    },
    changelog: {
      title: "릴리즈 노트",
      subtitle: "Daily Reflect의 버전별 변경사항",
      latest: "최신",
      download: "다운로드",
      assets: "설치 파일",
      noReleases: "릴리즈가 아직 없습니다.",
      loading: "불러오는 중...",
      viewOnGithub: "GitHub에서 보기",
      back: "홈으로",
    },
    guide: {
      title: "설치 및 사용 가이드",
      subtitle: "Daily Reflect를 시작하는 방법",
      back: "홈으로",
      toc: "목차",
      sections: {
        installAW: { title: "1. ActivityWatch 설치", description: "Daily Reflect는 활동 데이터 수집을 위해 ActivityWatch가 필요합니다." },
        installApp: { title: "2. Daily Reflect 설치", description: "OS에 맞는 설치 파일을 다운로드하세요." },
        setup: { title: "3. 초기 설정", description: "앱을 처음 실행하면 ActivityWatch 연결 상태를 자동으로 확인합니다." },
        apiKey: { title: "Gemini API 키 발급", description: "AI 회고 생성에 필요한 API 키를 발급받으세요." },
        statusTab: { title: "상태 탭", description: "ActivityWatch 연결 상태와 오늘의 활동을 실시간으로 확인합니다." },
        retroTab: { title: "회고 탭", description: "자동 생성된 회고글을 확인하고 관리합니다." },
        settingsTab: { title: "설정 탭", description: "AI, 저장소, 데이터 소스를 설정합니다." },
      },
      macosNote: "macOS에서는 처음 실행 시 Gatekeeper가 차단할 수 있습니다. 시스템 설정 → 개인 정보 보호 및 보안 → \"확인 없이 열기\"를 클릭하세요.",
      awSteps: ["위 링크에서 OS에 맞는 설치 파일을 다운로드", "설치 후 ActivityWatch를 실행 (메뉴바/시스템 트레이에 아이콘 표시)", "http://localhost:5600에서 대시보드가 열리면 정상 동작"],
      setupSteps: ["ActivityWatch 연결 — AW가 실행 중이면 자동 감지", "AI 설정 — 설정 > AI 글쓰기에서 Gemini API 키 입력", "저장소 설정 — 설정 > 저장 위치에서 원하는 저장소 활성화", "생성 시각 — 설정 > AI 글쓰기에서 회고 자동 생성 시각 지정 (기본 23:50)"],
      apiKeySteps: ["Google AI Studio에 접속", "\"Create API Key\" 클릭", "생성된 키(AIza...)를 앱 설정에 입력"],
      statusFeatures: ["ActivityWatch 연결 상태 확인", "오늘의 활동 시간, 유휴 시간, 이벤트 수 실시간 표시", "앱별 상세 활동 내역 확인"],
      retroFeatures: ["자동 생성된 회고글 목록 확인", "각 회고글 클릭하여 전체 내용 확인", "\"수동으로 회고 생성하기\" 버튼으로 즉시 생성 가능"],
      settingsAI: ["AI 연결 키 — Gemini API 키", "글쓰기 톤 — 일기체 / 블로그 / 불렛포인트 / 커스텀", "언어 — 한국어 / English", "생성 시각 — 매일 자동 생성 시각 (HH:MM)"],
      settingsStorage: ["로컬 저장 — 지정 폴더에 YYYY/YYYY-MM-DD.md 형식으로 저장", "GitHub — 지정 레포에 자동 커밋 (Personal Access Token 필요)", "Notion — 지정 데이터베이스에 새 페이지 생성 (Internal Integration Token 필요)"],
    },
  },
  en: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      privacy: "Privacy",
      download: "Download",
      guide: "Guide",
      changelog: "Releases",
      langToggle: "한국어",
    },
    hero: {
      badge: "Open Source Desktop App",
      headline: "Record your day,\nAI writes your reflection",
      subtitle:
        "An open-source desktop app that automatically tracks your computer activity and generates meaningful daily reflections with Gemini AI",
      cta: "Download",
      github: "GitHub",
      trusted: "Trusted by developers and creators",
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Three simple steps to automatic daily reflections",
      step1: {
        title: "Track Activity",
        description:
          "ActivityWatch quietly records which apps you use and websites you visit. You don't have to do anything.",
        visual: "tracking",
      },
      step2: {
        title: "Analyze Patterns",
        description:
          "Daily Reflect collects your daily activity data and analyzes meaningful patterns and time flows.",
        visual: "analyzing",
      },
      step3: {
        title: "Generate Reflection",
        description:
          "Gemini AI automatically writes your personalized, natural reflections based on the analyzed data.",
        visual: "writing",
      },
    },
    features: {
      title: "Features",
      subtitle: "Everything you need to make your days more meaningful",
      items: [
        {
          title: "Auto Activity Tracking",
          description:
            "Automatic recording of app usage and web browsing via ActivityWatch. Runs quietly in the background.",
        },
        {
          title: "AI Reflection Generation",
          description:
            "Gemini AI analyzes activity data and writes meaningful daily reflections.",
        },
        {
          title: "Multiple Storage",
          description: "Save simultaneously to local files, GitHub repositories, and Notion pages.",
        },
        {
          title: "Complete Privacy",
          description:
            "All data processed on your computer only. No external server transmission.",
        },
        {
          title: "Multilingual Support",
          description: "Write reflections in Korean and English.",
        },
        {
          title: "Custom Styles",
          description:
            "Diary, blog, bullet points, and more writing styles to choose from.",
        },
      ],
    },
    preview: {
      title: "App Preview",
      subtitle: "Look back on your day with a clean interface",
      statusLabel: "Today's Activity",
      retroLabel: "AI Reflection",
      statusItems: [
        { app: "VS Code", time: "3h 42m", percent: 85 },
        { app: "Chrome", time: "2h 15m", percent: 62 },
        { app: "Slack", time: "45m", percent: 28 },
        { app: "Terminal", time: "32m", percent: 18 },
      ],
      retroText:
        "Today I mainly focused on frontend work in VS Code. I implemented new components while referencing technical documentation in Chrome, and conducted code reviews with teammates via Slack. It was a productive day.",
      generatedBy: "Generated by Gemini AI",
      date: "March 14, 2026",
      totalTime: "Total active time: 7h 14m",
    },
    privacy: {
      title: "Privacy",
      headline: "Your data belongs\nto you alone",
      description: "Daily Reflect is designed with privacy as the top priority. All activity data is processed only on your computer, and we collect nothing.",
      points: [
        "Activity data is 100% processed locally",
        "Only minimal data is sent during AI API calls",
        "No personal data stored on external servers",
        "Open source — verify the code yourself",
      ],
    },
    download: {
      title: "Start Today",
      subtitle: "Free, open-source. Reflect on your day with AI.",
      cta: "Download",
      ctaFor: (os: string) => `Download for ${os}`,
      openSource: "Open Source",
      mit: "MIT License",
      allDownloads: "All Downloads",
      osLabels: { macOS: ".dmg", Windows: ".exe", Linux: ".AppImage" },
      stats: [
        { label: "Price", value: "Free" },
        { label: "License", value: "MIT" },
        { label: "Platforms", value: "macOS / Windows / Linux" },
      ],
    },
    footer: {
      madeBy: "Made by",
      license: "MIT License",
      openSource: "Open Source Project",
      description: "AI-powered automatic daily reflection app",
    },
    changelog: {
      title: "Release Notes",
      subtitle: "Version history of Daily Reflect",
      latest: "Latest",
      download: "Download",
      assets: "Installers",
      noReleases: "No releases yet.",
      loading: "Loading...",
      viewOnGithub: "View on GitHub",
      back: "Home",
    },
    guide: {
      title: "Installation & Usage Guide",
      subtitle: "How to get started with Daily Reflect",
      back: "Home",
      toc: "Table of Contents",
      sections: {
        installAW: { title: "1. Install ActivityWatch", description: "Daily Reflect requires ActivityWatch to collect activity data." },
        installApp: { title: "2. Install Daily Reflect", description: "Download the installer for your OS." },
        setup: { title: "3. Initial Setup", description: "On first launch, the app automatically checks the ActivityWatch connection." },
        apiKey: { title: "Getting a Gemini API Key", description: "Get the API key needed for AI reflection generation." },
        statusTab: { title: "Status Tab", description: "Check ActivityWatch connection and today's activity in real time." },
        retroTab: { title: "Reflection Tab", description: "View and manage auto-generated reflections." },
        settingsTab: { title: "Settings Tab", description: "Configure AI, storage, and data sources." },
      },
      macosNote: "On macOS, Gatekeeper may block the first launch. Go to System Settings → Privacy & Security → click \"Open Anyway\".",
      awSteps: ["Download the installer for your OS from the link above", "Install and launch ActivityWatch (icon appears in menu bar / system tray)", "Confirm it's running at http://localhost:5600"],
      setupSteps: ["ActivityWatch Connection — auto-detected if AW is running", "AI Setup — enter Gemini API key under Settings > AI Writing", "Storage Setup — enable preferred storage under Settings > Save Location", "Generation Time — set daily auto-generation time under Settings > AI Writing (default: 23:50)"],
      apiKeySteps: ["Go to Google AI Studio", "Click \"Create API Key\"", "Paste the generated key (AIza...) into app settings"],
      statusFeatures: ["Check ActivityWatch connection status", "View today's active time, idle time, and event count in real time", "See detailed per-app activity breakdown"],
      retroFeatures: ["Browse auto-generated reflections", "Click any entry to read the full content", "Use \"Generate Reflection Now\" button for immediate generation"],
      settingsAI: ["API Key — Gemini API key", "Writing Tone — Diary / Blog / Bullet Points / Custom", "Language — Korean / English", "Generation Time — daily auto-generation time (HH:MM)"],
      settingsStorage: ["Local Storage — saves to folder in YYYY/YYYY-MM-DD.md format", "GitHub — auto-commits to repository (Personal Access Token required)", "Notion — creates page in database (Internal Integration Token required)"],
    },
  },
} as const;

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  const lang = navigator.language || "";
  return lang.startsWith("ko") ? "ko" : "en";
}
