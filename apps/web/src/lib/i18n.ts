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
      headline: "하루를 기록하면,\nAI가 회고를 써줍니다",
      subtitle:
        "컴퓨터 활동을 자동으로 추적하고, AI가 매일 의미 있는 회고록을 작성해주는 오픈소스 데스크톱 앱",
      cta: "다운로드",
      github: "GitHub에서 보기",
    },
    howItWorks: {
      title: "어떻게 작동하나요?",
      subtitle: "세 단계로 매일 자동 회고가 완성됩니다",
      step1: {
        title: "활동 기록",
        description:
          "ActivityWatch가 어떤 앱을 사용했는지, 어떤 웹사이트를 방문했는지 자동으로 기록합니다.",
      },
      step2: {
        title: "하루 분석",
        description:
          "Daily Reflect가 하루의 활동 데이터를 수집하고 의미 있는 패턴을 분석합니다.",
      },
      step3: {
        title: "회고 작성",
        description:
          "Gemini AI가 분석된 데이터를 바탕으로 자연스러운 회고글을 자동 작성합니다.",
      },
    },
    features: {
      title: "주요 기능",
      subtitle: "당신의 하루를 더 의미있게 만들어주는 기능들",
      items: [
        {
          title: "자동 활동 추적",
          description: "ActivityWatch 연동으로 앱 사용, 웹 브라우징을 자동 기록",
        },
        {
          title: "AI 회고 생성",
          description: "Gemini AI가 활동 데이터를 분석하여 매일 회고글 작성",
        },
        {
          title: "다중 저장소",
          description: "로컬, GitHub, Notion에 동시 저장 가능",
        },
        {
          title: "완전한 프라이버시",
          description: "모든 데이터는 로컬에서 처리, 외부 전송 없음",
        },
        {
          title: "다국어 지원",
          description: "한국어와 English로 회고글 작성 가능",
        },
        {
          title: "커스텀 스타일",
          description: "일기체, 블로그, 불렛포인트 등 다양한 글쓰기 스타일",
        },
      ],
    },
    preview: {
      title: "앱 미리보기",
      subtitle: "깔끔한 인터페이스로 하루를 돌아보세요",
      statusLabel: "활동 현황",
      retroLabel: "오늘의 회고",
      statusItems: [
        "VS Code — 3시간 42분",
        "Chrome — 2시간 15분",
        "Slack — 45분",
        "Terminal — 32분",
      ],
      retroText:
        "오늘은 주로 VS Code에서 프론트엔드 작업에 집중했습니다. Chrome에서 기술 문서를 참고하며 새로운 컴포넌트를 구현했고, Slack을 통해 팀원들과 코드 리뷰를 진행했습니다. 생산적인 하루였습니다.",
    },
    privacy: {
      title: "프라이버시를 최우선으로",
      headline: "모든 데이터는\n당신의 컴퓨터에만 저장됩니다",
      points: [
        "활동 데이터는 로컬에서만 처리됩니다",
        "AI API 호출 시에도 최소한의 데이터만 전송합니다",
        "외부 서버에 개인 데이터를 저장하지 않습니다",
        "오픈소스이므로 직접 코드를 확인할 수 있습니다",
      ],
    },
    download: {
      title: "지금 시작하세요",
      subtitle: "무료, 오픈소스. 당신의 하루를 AI와 함께 돌아보세요.",
      cta: "다운로드",
      ctaFor: (os: string) => `${os}용 다운로드`,
      openSource: "오픈소스",
      mit: "MIT 라이선스",
    },
    footer: {
      madeBy: "Made by",
      license: "MIT License",
      openSource: "오픈소스 프로젝트",
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
      headline: "Record your day,\nAI writes your reflection",
      subtitle:
        "An open-source desktop app that automatically tracks your computer activity and generates meaningful daily reflections with AI",
      cta: "Download",
      github: "View on GitHub",
    },
    howItWorks: {
      title: "How It Works",
      subtitle: "Three simple steps to automatic daily reflections",
      step1: {
        title: "Track Activity",
        description:
          "ActivityWatch automatically records which apps you use and websites you visit.",
      },
      step2: {
        title: "Analyze Your Day",
        description:
          "Daily Reflect collects your daily activity data and analyzes meaningful patterns.",
      },
      step3: {
        title: "Write Reflection",
        description:
          "Gemini AI automatically writes natural reflections based on the analyzed data.",
      },
    },
    features: {
      title: "Features",
      subtitle: "Everything you need to make your days more meaningful",
      items: [
        {
          title: "Auto Activity Tracking",
          description:
            "Automatic recording of app usage and web browsing via ActivityWatch",
        },
        {
          title: "AI Reflection Generation",
          description:
            "Gemini AI analyzes activity data and writes daily reflections",
        },
        {
          title: "Multiple Storage",
          description: "Save simultaneously to local, GitHub, and Notion",
        },
        {
          title: "Complete Privacy",
          description:
            "All data processed locally, no external transmission",
        },
        {
          title: "Multilingual Support",
          description: "Write reflections in Korean and English",
        },
        {
          title: "Custom Styles",
          description:
            "Diary, blog, bullet points, and more writing styles",
        },
      ],
    },
    preview: {
      title: "App Preview",
      subtitle: "Look back on your day with a clean interface",
      statusLabel: "Activity Status",
      retroLabel: "Today's Reflection",
      statusItems: [
        "VS Code — 3h 42m",
        "Chrome — 2h 15m",
        "Slack — 45m",
        "Terminal — 32m",
      ],
      retroText:
        "Today I mainly focused on frontend work in VS Code. I implemented new components while referencing technical documentation in Chrome, and conducted code reviews with teammates via Slack. It was a productive day.",
    },
    privacy: {
      title: "Privacy First",
      headline: "All your data stays\non your computer only",
      points: [
        "Activity data is processed locally only",
        "Only minimal data is sent during AI API calls",
        "No personal data stored on external servers",
        "Open source — verify the code yourself",
      ],
    },
    download: {
      title: "Get Started Now",
      subtitle:
        "Free, open-source. Reflect on your day with AI.",
      cta: "Download",
      ctaFor: (os: string) => `Download for ${os}`,
      openSource: "Open Source",
      mit: "MIT License",
    },
    footer: {
      madeBy: "Made by",
      license: "MIT License",
      openSource: "Open Source Project",
    },
  },
} as const;

export function detectLocale(): Locale {
  if (typeof window === "undefined") return "ko";
  const lang = navigator.language || "";
  return lang.startsWith("ko") ? "ko" : "en";
}
