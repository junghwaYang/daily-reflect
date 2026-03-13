export type Locale = "ko" | "en";

export const translations = {
  ko: {
    nav: {
      features: "기능",
      howItWorks: "작동 방식",
      privacy: "프라이버시",
      download: "다운로드",
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
  },
  en: {
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      privacy: "Privacy",
      download: "Download",
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
  },
} as const;

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  const lang = navigator.language || "";
  return lang.startsWith("ko") ? "ko" : "en";
}
