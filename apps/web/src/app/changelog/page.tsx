"use client";

import { useEffect, useState, useCallback } from "react";
import { translations, detectLocale, type Locale } from "@/lib/i18n";
import { SiteHeader, SiteFooter } from "../shared";

const REPO = "junghwaYang/daily-reflect";
const API_URL = `https://api.github.com/repos/${REPO}/releases`;

type Asset = { name: string; browser_download_url: string; size: number };
type Release = { tag_name: string; name: string; body: string; published_at: string; html_url: string; assets: Asset[]; prerelease: boolean };

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function formatSize(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function getAssetOS(name: string): string | null {
  if (name.endsWith(".dmg") || name.endsWith(".app.tar.gz")) return "macOS";
  if (name.endsWith("-setup.exe") || name.endsWith(".msi")) return "Windows";
  if (name.endsWith(".AppImage") || name.endsWith(".deb") || name.endsWith(".rpm")) return "Linux";
  return null;
}

function renderMarkdown(body: string) {
  return body
    .replace(/^### (.+)$/gm, '<h3 class="mt-4 mb-2 text-sm font-semibold">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="mt-5 mb-2 text-base font-semibold">$1</h2>')
    .replace(/^- \*\*(.+?)\*\* ?[—–-] ?(.+)$/gm, '<li class="ml-4 text-sm text-zinc-600 dark:text-zinc-400"><strong>$1</strong> — $2</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 text-sm text-zinc-600 dark:text-zinc-400">$1</li>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.+?)`/g, '<code class="rounded bg-zinc-100 px-1.5 py-0.5 text-xs dark:bg-zinc-800">$1</code>')
    .replace(/\n\n/g, "<br/>");
}

export default function ChangelogPage() {
  const [locale, setLocale] = useState<Locale>("ko");
  const [releases, setReleases] = useState<Release[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDark, setIsDark] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const t = translations[locale];
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

    fetch(API_URL)
      .then((r) => (r.ok ? r.json() : []))
      .then((data: Release[]) => setReleases(data))
      .catch(() => {})
      .finally(() => setLoading(false));

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toggleLocale = useCallback(() => setLocale((l) => (l === "ko" ? "en" : "ko")), []);
  const toggleDark = useCallback(() => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <SiteHeader t={t} basePath={basePath} scrolled={scrolled} isDark={isDark} mobileMenuOpen={mobileMenuOpen} toggleLocale={toggleLocale} toggleDark={toggleDark} setMobileMenuOpen={setMobileMenuOpen} />

      <main className="mx-auto max-w-[860px] px-6 py-16 pt-28">
        <h1 className="text-3xl font-bold tracking-tight">{t.changelog.title}</h1>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{t.changelog.subtitle}</p>

        {loading && <p className="mt-12 text-center text-sm text-zinc-400">{t.changelog.loading}</p>}

        {!loading && releases.length === 0 && (
          <p className="mt-12 text-center text-sm text-zinc-400">{t.changelog.noReleases}</p>
        )}

        <div className="mt-12 space-y-12">
          {releases.map((release, idx) => {
            const osAssets = release.assets.filter((a) => getAssetOS(a.name));
            return (
              <article key={release.tag_name} className="relative border-l-2 border-zinc-200 pl-8 dark:border-zinc-800">
                <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-zinc-300 bg-white dark:border-zinc-700 dark:bg-zinc-950" />

                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">{release.tag_name}</h2>
                  {idx === 0 && (
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      {t.changelog.latest}
                    </span>
                  )}
                  {release.prerelease && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                      Pre-release
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  {formatDate(release.published_at, locale)}
                </p>

                {release.body && (
                  <div className="prose-sm mt-4" dangerouslySetInnerHTML={{ __html: renderMarkdown(release.body) }} />
                )}

                {osAssets.length > 0 && (
                  <div className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
                    <div className="border-b border-zinc-200 px-4 py-2 dark:border-zinc-800">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">{t.changelog.assets}</span>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                      {osAssets.map((asset) => (
                        <a key={asset.name} href={asset.browser_download_url} className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-900">
                          <div className="flex items-center gap-3">
                            <span className="inline-flex rounded bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                              {getAssetOS(asset.name)}
                            </span>
                            <span className="text-zinc-700 dark:text-zinc-300">{asset.name}</span>
                          </div>
                          <span className="text-xs text-zinc-400">{formatSize(asset.size)}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <a href={release.html_url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 dark:text-zinc-500 dark:hover:text-zinc-300">
                  {t.changelog.viewOnGithub}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M7 17 17 7M7 7h10v10"/></svg>
                </a>
              </article>
            );
          })}
        </div>
      </main>

      <SiteFooter t={t} basePath={basePath} />
    </div>
  );
}
