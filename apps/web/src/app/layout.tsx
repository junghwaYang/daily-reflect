import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Daily Reflect — AI가 매일 회고를 써줍니다",
  description:
    "컴퓨터 활동을 자동으로 추적하고, AI가 매일 의미 있는 회고록을 작성해주는 오픈소스 데스크톱 앱. An open-source desktop app that uses AI to write daily reflections from your computer activity.",
  keywords: [
    "daily reflect",
    "AI 회고",
    "자동 일기",
    "activity tracking",
    "daily journal",
    "open source",
  ],
  openGraph: {
    title: "Daily Reflect — AI가 매일 회고를 써줍니다",
    description:
      "컴퓨터 활동을 자동으로 추적하고, AI가 매일 의미 있는 회고록을 작성해주는 오픈소스 데스크톱 앱",
    type: "website",
    url: "https://github.com/junghwaYang/daily-reflect",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}
