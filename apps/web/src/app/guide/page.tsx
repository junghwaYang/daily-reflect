"use client";

import { useEffect, useState, useCallback } from "react";
import { translations, detectLocale, type Locale } from "@/lib/i18n";
import { SiteHeader, SiteFooter } from "../shared";

export default function GuidePage() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = translations[locale];
  const g = t.guide;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/daily-reflect";

  useEffect(() => {
    setLocale(detectLocale());
    const stored = localStorage.getItem("theme");
    if (stored === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLocale = useCallback(() => setLocale((l) => (l === "ko" ? "en" : "ko")), []);
  const toggleDark = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [isDark]);

  const sections = g.sections;

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader t={t} basePath={basePath} scrolled={scrolled} isDark={isDark} mobileMenuOpen={mobileMenuOpen} toggleLocale={toggleLocale} toggleDark={toggleDark} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="mx-auto max-w-[860px] px-6 py-16 pt-28">
        <h1 className="text-3xl font-bold tracking-tight">{g.title}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{g.subtitle}</p>

        {/* TOC */}
        <nav className="mt-10 rounded-xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="mb-3 text-sm font-semibold">{g.toc}</h2>
          <ul className="space-y-1.5">
            {Object.entries(sections).map(([key, sec]) => (
              <li key={key}>
                <a href={`#${key}`} className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                  {sec.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-16 space-y-16">
          {/* Install ActivityWatch */}
          <Section id="installAW" title={sections.installAW.title} description={sections.installAW.description}>
            <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">OS</th>
                    <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">{locale === "ko" ? "다운로드" : "Download"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  {["macOS", "Windows", "Linux"].map((os) => (
                    <tr key={os}>
                      <td className="px-4 py-2.5 font-medium">{os}</td>
                      <td className="px-4 py-2.5">
                        <a href="https://activitywatch.net/downloads/" target="_blank" rel="noopener noreferrer" className="text-zinc-500 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                          ActivityWatch-{os.toLowerCase()}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <OrderedList items={g.awSteps} />
            <Callout>
              {locale === "ko"
                ? "ActivityWatch는 오픈소스(MPL-2.0) 활동 트래커로, 모든 데이터가 로컬에 저장됩니다."
                : "ActivityWatch is an open-source (MPL-2.0) activity tracker that stores all data locally."}
            </Callout>
          </Section>

          {/* Install Daily Reflect */}
          <Section id="installApp" title={sections.installApp.title} description={sections.installApp.description}>
            <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                    <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">OS</th>
                    <th className="px-4 py-2 text-left font-medium text-zinc-600 dark:text-zinc-400">{locale === "ko" ? "파일" : "File"}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                  <tr>
                    <td className="px-4 py-2.5 font-medium">macOS</td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">.dmg (Intel & Apple Silicon)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Windows</td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">.exe ({locale === "ko" ? "설치 파일" : "Installer"})</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2.5 font-medium">Linux</td>
                    <td className="px-4 py-2.5 text-zinc-600 dark:text-zinc-400">.AppImage / .deb</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4">
              <a href="https://github.com/junghwaYang/daily-reflect/releases/latest" target="_blank" rel="noopener noreferrer"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-zinc-900 px-4 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                {locale === "ko" ? "최신 릴리즈 다운로드" : "Download Latest Release"}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
              </a>
            </div>
          </Section>

          {/* Initial Setup */}
          <Section id="setup" title={sections.setup.title} description={sections.setup.description}>
            <OrderedList items={g.setupSteps} />
          </Section>

          {/* API Key */}
          <Section id="apiKey" title={sections.apiKey.title} description={sections.apiKey.description}>
            <OrderedList items={g.apiKeySteps} />
            <div className="mt-4">
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-zinc-500 underline hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
                Google AI Studio
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
              </a>
            </div>
          </Section>

          <hr className="border-zinc-200 dark:border-zinc-800" />

          <h2 className="text-2xl font-bold tracking-tight">{locale === "ko" ? "사용법" : "Usage"}</h2>

          {/* Status Tab */}
          <Section id="statusTab" title={sections.statusTab.title} description={sections.statusTab.description}>
            <BulletList items={g.statusFeatures} />
          </Section>

          {/* Reflection Tab */}
          <Section id="retroTab" title={sections.retroTab.title} description={sections.retroTab.description}>
            <BulletList items={g.retroFeatures} />
          </Section>

          {/* Settings Tab */}
          <Section id="settingsTab" title={sections.settingsTab.title} description={sections.settingsTab.description}>
            <h4 className="mt-4 text-sm font-semibold">
              {locale === "ko" ? "AI 글쓰기" : "AI Writing"}
            </h4>
            <BulletList items={g.settingsAI} />

            <h4 className="mt-6 text-sm font-semibold">
              {locale === "ko" ? "저장 위치" : "Save Location"}
            </h4>
            <BulletList items={g.settingsStorage} />
          </Section>
        </div>
      </main>

      <SiteFooter t={t} basePath={basePath} />
    </div>
  );
}

function Section({ id, title, description, children }: { id: string; title: string; description: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function OrderedList({ items }: { items: readonly string[] }) {
  return (
    <ol className="mt-3 space-y-2">
      {items.map((item, i) => (
        <li key={item} className="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-medium text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
            {i + 1}
          </span>
          {item}
        </li>
      ))}
    </ol>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-600 dark:text-zinc-400">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-zinc-400 dark:bg-zinc-600" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400">
      {children}
    </div>
  );
}
