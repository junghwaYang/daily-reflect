"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { translations, detectLocale, type Locale } from "@/lib/i18n";
import { SiteHeader, SiteFooter } from "./shared";

// ─── Scroll Reveal ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) el.classList.add("is-visible"); },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ─── OS Detection ───
function detectOS(): string {
  if (typeof window === "undefined") return "Desktop";
  const ua = navigator.userAgent;
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Linux")) return "Linux";
  return "Desktop";
}

// ─── Icons ───
function IconGithub({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// ─── Release Fetcher ───
type DownloadURLs = { macOS?: string; Windows?: string; Linux?: string; macOSFix?: string; version?: string };

function useLatestRelease() {
  const [downloads, setDownloads] = useState<DownloadURLs>({});
  useEffect(() => {
    fetch("https://api.github.com/repos/junghwaYang/daily-reflect/releases/latest")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data: { tag_name: string; assets: { name: string; browser_download_url: string }[] }) => {
        const urls: DownloadURLs = { version: data.tag_name };
        for (const a of data.assets) {
          if (a.name.endsWith(".dmg")) urls.macOS = a.browser_download_url;
          else if (a.name.endsWith("-setup.exe")) urls.Windows = a.browser_download_url;
          else if (a.name.endsWith(".AppImage")) urls.Linux = a.browser_download_url;
          else if (a.name.endsWith(".command")) urls.macOSFix = a.browser_download_url;
        }
        setDownloads(urls);
      })
      .catch(() => {});
  }, []);
  return downloads;
}

// ─── Main ───
export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [os, setOS] = useState("Desktop");
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const release = useLatestRelease();

  const t = translations[locale];

  useEffect(() => {
    setLocale(detectLocale());
    setOS(detectOS());

    // Default to dark
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

  const toggleLocale = useCallback(() => {
    setLocale((l) => (l === "ko" ? "en" : "ko"));
  }, []);

  const toggleDark = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [isDark]);

  const howRef = useScrollReveal();
  const previewRef = useScrollReveal();
  const featRef = useScrollReveal();
  const privacyRef = useScrollReveal();
  const downloadRef = useScrollReveal();

  const GITHUB_URL = "https://github.com/junghwaYang/daily-reflect";
  const RELEASES_URL = `${GITHUB_URL}/releases`;
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/daily-reflect";

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader t={t} basePath={basePath} scrolled={scrolled} isDark={isDark} mobileMenuOpen={mobileMenuOpen} toggleLocale={toggleLocale} toggleDark={toggleDark} setMobileMenuOpen={setMobileMenuOpen} />

      {/* ── HERO ── */}
      <section className="relative flex min-h-[100vh] flex-col items-center justify-center px-6 pt-14">
        {/* Radial gradient background — very subtle */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full opacity-[0.07] blur-[100px] dark:opacity-[0.15]" style={{ background: "radial-gradient(circle, #6366f1 0%, #a855f7 40%, transparent 70%)" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl text-center">
          {/* Badge */}
          <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="group mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-3.5 py-1 text-xs text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:border-zinc-700 dark:hover:text-zinc-300">
            {t.hero.badge}
            <IconArrowRight size={12} />
          </a>

          {/* Headline */}
          <h1 className="text-4xl font-bold leading-[1.15] tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mt-6 max-w-[540px] text-base leading-relaxed text-zinc-500 dark:text-zinc-400 sm:text-lg">
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a href={release[os as keyof DownloadURLs] as string ?? RELEASES_URL} {...(release[os as keyof DownloadURLs] ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
              {t.download.ctaFor(os)}
              {release.version && <span className="text-xs opacity-60">{release.version}</span>}
            </a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900">
              <IconGithub />
              {t.hero.github}
            </a>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white dark:from-zinc-950" />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900 lg:py-32">
        <div ref={howRef} className="fade-in-section mx-auto max-w-[1000px]">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t.howItWorks.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t.howItWorks.subtitle}
            </h2>
          </div>

          <div className="stagger-children mt-16 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
            {[t.howItWorks.step1, t.howItWorks.step2, t.howItWorks.step3].map((step, i) => (
              <div key={i} className="bg-white p-8 dark:bg-zinc-950">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-xs font-semibold tabular-nums text-zinc-400 dark:border-zinc-800 dark:text-zinc-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PREVIEW ── */}
      <section className="px-6 py-24 lg:py-32">
        <div ref={previewRef} className="fade-in-section mx-auto max-w-[1000px]">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t.preview.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t.preview.subtitle}
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {[
              { label: t.preview.statusLabel, src: `${basePath}/screenshot-status.png` },
              { label: t.preview.retroLabel, src: `${basePath}/screenshot-retro.png` },
            ].map(({ label, src }) => (
              <div key={label} className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900">
                {/* Window chrome */}
                <div className="flex items-center gap-2 border-b border-zinc-200 px-4 py-2.5 dark:border-zinc-800">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  </div>
                  <span className="ml-2 text-[11px] text-zinc-400 dark:text-zinc-500">{label}</span>
                </div>
                <img src={src} alt={label} className="w-full" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900 lg:py-32">
        <div ref={featRef} className="fade-in-section mx-auto max-w-[1000px]">
          <div className="text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
              {t.features.title}
            </p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
              {t.features.subtitle}
            </h2>
          </div>

          <div className="stagger-children mt-16 grid gap-px overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 sm:grid-cols-2 lg:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-800">
            {t.features.items.map((feature, i) => (
              <div key={i} className="bg-white p-7 dark:bg-zinc-950">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                  {featureIcons[i]}
                </div>
                <h3 className="text-sm font-semibold">{feature.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRIVACY ── */}
      <section id="privacy" className="px-6 py-24 lg:py-32">
        <div ref={privacyRef} className="fade-in-section mx-auto max-w-[680px]">
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-8 dark:border-zinc-800 dark:bg-zinc-900 sm:p-12">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-800">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-500 dark:text-zinc-400">
                  <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{t.privacy.title}</h2>
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{t.privacy.description}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {t.privacy.points.map((point, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900">
                    <IconCheck />
                  </span>
                  <span className="text-sm text-zinc-600 dark:text-zinc-300">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DOWNLOAD CTA ── */}
      <section id="download" className="border-t border-zinc-100 px-6 py-24 dark:border-zinc-900 lg:py-32">
        <div ref={downloadRef} className="fade-in-section mx-auto max-w-[540px] text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {t.download.title}
          </h2>
          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {t.download.subtitle}
          </p>

          {release.version && (
            <div className="mt-8 grid gap-2 sm:grid-cols-3">
              {(["macOS", "Windows", "Linux"] as const).map((platform) => {
                const url = release[platform];
                const isCurrentOS = os === platform;
                return (
                  <div key={platform} className="flex flex-col gap-1">
                    <a
                      href={url ?? RELEASES_URL}
                      {...(url ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                      className={`inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors ${
                        isCurrentOS
                          ? "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                          : "border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300 dark:hover:bg-zinc-900"
                      }`}
                    >
                      {platform}
                      <span className="text-xs opacity-60">{t.download.osLabels[platform]}</span>
                    </a>
                    {platform === "macOS" && release.macOSFix && (
                      <a href={release.macOSFix} className="text-center text-[11px] text-zinc-400 underline hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                        {locale === "ko" ? "설치 도우미 (필수)" : "Install Helper (required)"}
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!release.version && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                {t.download.ctaFor(os)}
              </a>
            </div>
          )}

          <div className="mt-5 space-y-1.5 text-left">
            <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
              ⚠ {t.download.macosWarning}
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-400 dark:text-zinc-500">
              ⚠ {t.download.windowsWarning}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-center">
            <a href={RELEASES_URL} target="_blank" rel="noopener noreferrer" className="text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
              {t.download.allDownloads} {release.version && `(${release.version})`} →
            </a>
          </div>

          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-zinc-400 dark:text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {t.download.openSource}
            </span>
            <span>{t.download.mit}</span>
            <span>macOS / Windows / Linux</span>
          </div>
        </div>
      </section>

      <SiteFooter t={t} basePath={basePath} />
    </div>
  );
}

// Feature icons — thin stroke, monochrome
const featureIcons = [
  <svg key="0" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  <svg key="1" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /></svg>,
  <svg key="2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" /><path d="m6.08 9.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" /><path d="m6.08 14.5-3.5 1.6a1 1 0 0 0 0 1.81l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9a1 1 0 0 0 0-1.83l-3.5-1.59" /></svg>,
  <svg key="3" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" /></svg>,
  <svg key="4" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>,
  <svg key="5" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.874a2 2 0 0 1 .506-.852z" /></svg>,
];
