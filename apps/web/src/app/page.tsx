"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { translations, detectLocale, type Locale } from "@/lib/i18n";

// ─── Intersection Observer Hook ───
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-visible");
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
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

// ─── Icons (inline SVG) ───
function IconActivity() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}

function IconAnalyze() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
      <path d="M11 8v6" />
      <path d="M8 11h6" />
    </svg>
  );
}

function IconWrite() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
    </svg>
  );
}

function IconShield() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function IconGithub({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function IconDownload() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" /><path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" /><path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

// ─── Feature Icons ───
const featureIcons = [
  // Auto tracking
  <svg key="track" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  // AI generation
  <svg key="ai" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>,
  // Multi storage
  <svg key="storage" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14a9 3 0 0 0 18 0V5" /><path d="M3 12a9 3 0 0 0 18 0" /></svg>,
  // Privacy
  <svg key="privacy" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>,
  // Multilingual
  <svg key="lang" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></svg>,
  // Custom style
  <svg key="style" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.874a2 2 0 0 1 .506-.852z" /></svg>,
];

// ─── Main Page ───
export default function Home() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [os, setOS] = useState("Desktop");
  const [isDark, setIsDark] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const t = translations[locale];

  useEffect(() => {
    setLocale(detectLocale());
    setOS(detectOS());
    setIsDark(document.documentElement.classList.contains("dark"));
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

  // Scroll reveal refs
  const howRef = useScrollReveal();
  const featRef = useScrollReveal();
  const previewRef = useScrollReveal();
  const privacyRef = useScrollReveal();
  const downloadRef = useScrollReveal();

  const GITHUB_URL = "https://github.com/junghwaYang/daily-reflect";
  const RELEASES_URL = `${GITHUB_URL}/releases`;

  return (
    <div className="min-h-screen">
      {/* ─── Header ─── */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a href="#" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#007AFF] text-white text-sm font-bold">
              D
            </span>
            Daily Reflect
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-8 md:flex">
            <a href="#how-it-works" className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              {t.nav.howItWorks}
            </a>
            <a href="#features" className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              {t.nav.features}
            </a>
            <a href="#privacy" className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              {t.nav.privacy}
            </a>
            <a href="#download" className="text-sm text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
              {t.nav.download}
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleDark}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
              aria-label="Toggle dark mode"
            >
              {isDark ? <IconSun /> : <IconMoon />}
            </button>
            <button
              onClick={toggleLocale}
              className="hidden h-9 rounded-full border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100 sm:flex sm:items-center"
            >
              {t.nav.langToggle}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 transition-colors hover:bg-gray-100 md:hidden dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                {mobileMenuOpen ? (
                  <>
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </>
                ) : (
                  <>
                    <path d="M4 8h16" />
                    <path d="M4 16h16" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200/60 bg-white px-6 py-4 dark:border-gray-800/60 dark:bg-gray-950 md:hidden">
            <nav className="flex flex-col gap-3">
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-400">{t.nav.howItWorks}</a>
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-400">{t.nav.features}</a>
              <a href="#privacy" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-400">{t.nav.privacy}</a>
              <a href="#download" onClick={() => setMobileMenuOpen(false)} className="text-sm text-gray-600 dark:text-gray-400">{t.nav.download}</a>
              <button onClick={() => { toggleLocale(); setMobileMenuOpen(false); }} className="w-fit text-sm text-gray-600 dark:text-gray-400">
                {t.nav.langToggle}
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* ─── Hero Section ─── */}
      <section className="hero-gradient relative flex min-h-[90vh] items-center justify-center px-6 pt-16">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {t.hero.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {i === 1 ? (
                  <span className="bg-gradient-to-r from-[#007AFF] to-[#4DA3FF] bg-clip-text text-transparent">
                    {line}
                  </span>
                ) : (
                  line
                )}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-[#007AFF] px-8 text-base font-semibold text-white shadow-lg shadow-[#007AFF]/25 transition-all hover:bg-[#0056CC] hover:shadow-xl hover:shadow-[#007AFF]/30"
            >
              <IconDownload />
              {t.hero.cta}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center gap-2 rounded-full border border-gray-300 bg-white px-8 text-base font-semibold text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
            >
              <IconGithub />
              {t.hero.github}
            </a>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="px-6 py-24 lg:py-32">
        <div ref={howRef} className="fade-in-section mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.howItWorks.title}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="stagger-children mt-16 grid gap-8 md:grid-cols-3">
            {[
              { icon: <IconActivity />, step: t.howItWorks.step1, num: "01" },
              { icon: <IconAnalyze />, step: t.howItWorks.step2, num: "02" },
              { icon: <IconWrite />, step: t.howItWorks.step3, num: "03" },
            ].map(({ icon, step, num }) => (
              <div
                key={num}
                className="relative rounded-2xl border border-gray-200 bg-gray-50 p-8 transition-all hover:border-[#007AFF]/30 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 dark:hover:border-[#007AFF]/30"
              >
                <span className="absolute right-6 top-6 text-4xl font-bold text-gray-100 dark:text-gray-800">
                  {num}
                </span>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#007AFF]/10 text-[#007AFF]">
                  {icon}
                </div>
                <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section
        id="features"
        className="border-y border-gray-200 bg-gray-50/50 px-6 py-24 dark:border-gray-800 dark:bg-gray-900/50 lg:py-32"
      >
        <div ref={featRef} className="fade-in-section mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.features.title}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t.features.subtitle}
            </p>
          </div>

          <div className="stagger-children mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {t.features.items.map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-[#007AFF]/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-950"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#007AFF]/10 text-[#007AFF]">
                  {featureIcons[i]}
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── App Preview ─── */}
      <section className="px-6 py-24 lg:py-32">
        <div ref={previewRef} className="fade-in-section mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.preview.title}
            </h2>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {t.preview.subtitle}
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {/* Status Screen Mock */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {t.preview.statusLabel}
                </span>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {t.preview.statusItems.map((item, i) => {
                    const widths = ["85%", "62%", "28%", "18%"];
                    return (
                      <div key={i} className="flex items-center justify-between gap-4">
                        <span className="shrink-0 text-sm text-gray-700 dark:text-gray-300">{item}</span>
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                          <div
                            className="h-full rounded-full bg-[#007AFF]"
                            style={{ width: widths[i], opacity: 1 - i * 0.15 }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Retro Screen Mock */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400" />
                  <span className="h-3 w-3 rounded-full bg-green-400" />
                </div>
                <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                  {t.preview.retroLabel}
                </span>
              </div>
              <div className="p-6">
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {t.preview.retroText}
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Generated by Gemini AI
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Privacy ─── */}
      <section
        id="privacy"
        className="border-y border-gray-200 bg-gray-50/50 px-6 py-24 dark:border-gray-800 dark:bg-gray-900/50 lg:py-32"
      >
        <div ref={privacyRef} className="fade-in-section mx-auto max-w-3xl text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-[#007AFF]/10 text-[#007AFF] shield-glow">
            <IconShield />
          </div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#007AFF]">
            {t.privacy.title}
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            {t.privacy.headline.split("\n").map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>

          <ul className="mx-auto mt-10 max-w-md space-y-4 text-left">
            {t.privacy.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#007AFF]/10 text-[#007AFF]">
                  <IconCheck />
                </span>
                <span className="text-gray-700 dark:text-gray-300">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── Download / CTA ─── */}
      <section id="download" className="px-6 py-24 lg:py-32">
        <div ref={downloadRef} className="fade-in-section mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t.download.title}
          </h2>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t.download.subtitle}
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href={RELEASES_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center gap-2 rounded-full bg-[#007AFF] px-10 text-lg font-semibold text-white shadow-lg shadow-[#007AFF]/25 transition-all hover:bg-[#0056CC] hover:shadow-xl hover:shadow-[#007AFF]/30"
            >
              <IconDownload />
              {t.download.ctaFor(os)}
            </a>
          </div>

          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900/30 dark:text-green-400">
              {t.download.openSource}
            </span>
            <span>{t.download.mit}</span>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-gray-200 bg-gray-50 px-6 py-10 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#007AFF] text-xs font-bold text-white">
              D
            </span>
            <span>Daily Reflect</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>{t.footer.openSource}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{t.footer.license}</span>
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span>
              {t.footer.madeBy}{" "}
              <a
                href="https://github.com/junghwaYang"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-gray-700 hover:text-[#007AFF] dark:text-gray-300"
              >
                junghwaYang
              </a>
            </span>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 transition-colors hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="GitHub"
            >
              <IconGithub />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
