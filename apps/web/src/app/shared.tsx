"use client";

import { useState, useEffect, type Dispatch, type SetStateAction } from "react";

type Translations = { nav: { howItWorks: string; features: string; privacy: string; download: string; guide: string; changelog: string; langToggle: string }; footer: { madeBy: string; license: string; openSource: string } };

function IconGithub({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-label="GitHub">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const GITHUB_URL = "https://github.com/junghwaYang/daily-reflect";

function useCurrentPath() {
  const [path, setPath] = useState("/");
  useEffect(() => {
    setPath(window.location.pathname);
  }, []);
  return path;
}

function isActive(href: string, currentPath: string): boolean {
  if (href.includes("#")) return false;
  const normalized = currentPath.replace(/\/$/, "");
  const hrefNormalized = href.replace(/\/$/, "");
  return normalized === hrefNormalized;
}

export function SiteHeader({ t, basePath, scrolled, isDark, mobileMenuOpen, toggleLocale, toggleDark, setMobileMenuOpen }: {
  t: Translations; basePath: string; scrolled: boolean; isDark: boolean; mobileMenuOpen: boolean;
  toggleLocale: () => void; toggleDark: () => void; setMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const currentPath = useCurrentPath();

  const navItems = [
    { href: `${basePath}/#how-it-works`, label: t.nav.howItWorks },
    { href: `${basePath}/#features`, label: t.nav.features },
    { href: `${basePath}/#privacy`, label: t.nav.privacy },
    { href: `${basePath}/guide/`, label: t.nav.guide },
    { href: `${basePath}/changelog/`, label: t.nav.changelog },
  ];

  return (
    <header className={`fixed top-0 z-50 w-full transition-all duration-200 ${
      scrolled
        ? "border-b border-zinc-200 bg-white/80 backdrop-blur-lg dark:border-zinc-800 dark:bg-zinc-950/80"
        : "border-b border-transparent bg-white/60 backdrop-blur-md dark:bg-zinc-950/60"
    }`}>
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
        <a href={basePath} className="flex items-center gap-2">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-zinc-900 dark:text-zinc-50" aria-label="Daily Reflect">
            <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-sm font-semibold tracking-tight">Daily Reflect</span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map(({ href, label }) => {
            const active = isActive(href, currentPath);
            return (
              <a key={href} href={href} className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                active
                  ? "font-medium text-zinc-900 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}>
                {label}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <button type="button" onClick={toggleLocale} className="rounded-md px-2.5 py-1.5 text-xs font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50">
            {t.nav.langToggle}
          </button>
          <button type="button" onClick={toggleDark} className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50" aria-label="Toggle theme">
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50" aria-label="GitHub">
            <IconGithub />
          </a>
          <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 md:hidden" aria-label="Menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              {mobileMenuOpen ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 8h16"/><path d="M4 16h16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-zinc-200 bg-white px-6 py-3 dark:border-zinc-800 dark:bg-zinc-950 md:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map(({ href, label }) => {
              const active = isActive(href, currentPath);
              return (
                <a key={href} href={href} onClick={() => setMobileMenuOpen(false)} className={`rounded-md px-3 py-2 text-sm ${
                  active
                    ? "font-medium text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                }`}>{label}</a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter({ t, basePath }: { t: Translations; basePath: string }) {
  return (
    <footer className="border-t border-zinc-100 px-6 py-8 dark:border-zinc-900">
      <div className="mx-auto flex max-w-[1000px] flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <a href={basePath} className="font-medium text-zinc-600 dark:text-zinc-300">Daily Reflect</a>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span>{t.footer.openSource}</span>
        </div>
        <div className="flex items-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
          <span>{t.footer.license}</span>
          <span className="text-zinc-300 dark:text-zinc-700">/</span>
          <span>
            {t.footer.madeBy}{" "}
            <a href="https://github.com/junghwaYang" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-zinc-50">
              junghwaYang
            </a>
          </span>
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-zinc-400 transition-colors hover:text-zinc-900 dark:hover:text-zinc-50" aria-label="GitHub">
            <IconGithub />
          </a>
        </div>
      </div>
    </footer>
  );
}
