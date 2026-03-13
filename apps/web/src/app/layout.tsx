import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteTitle = "Daily Reflect — AI가 매일 회고를 써줍니다";
const siteDescription =
  "컴퓨터 활동을 자동으로 추적하고, AI가 매일 의미 있는 회고록을 작성해주는 오픈소스 데스크톱 앱. An open-source desktop app that uses AI to write daily reflections from your computer activity.";

export const metadata: Metadata = {
  metadataBase: new URL("https://junghwayang.github.io"),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "daily reflect",
    "AI 회고",
    "자동 일기",
    "activity tracking",
    "daily journal",
    "open source",
  ],
  alternates: {
    canonical: "/daily-reflect/",
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: "https://junghwayang.github.io/daily-reflect/",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
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
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://www.google-analytics.com"
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`(function () {
            try {
              var theme = localStorage.getItem('theme');
              if (theme === 'light') {
                document.documentElement.classList.remove('dark');
              } else {
                document.documentElement.classList.add('dark');
              }
            } catch (e) {}
          })();`}
        </Script>
      </head>
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}
