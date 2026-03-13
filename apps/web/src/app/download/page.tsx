import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function DownloadPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500">
              <svg
                className="h-4 w-4 text-white"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z"
                />
              </svg>
            </div>
            <span className="text-lg font-semibold">Daily Reflect</span>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm">
              홈으로
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 pt-32 pb-20">
        {/* Hero */}
        <section className="mb-16 text-center">
          <h1 className="text-4xl font-bold sm:text-5xl">다운로드</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Daily Reflect 데스크톱 에이전트를 설치하세요
          </p>
        </section>

        {/* Download card */}
        <section className="mb-16">
          <Card className="overflow-hidden border-white/5 bg-white/[0.03]">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15M9 12l3 3m0 0 3-3m-3 3V2.25"
                  />
                </svg>
              </div>
              <h2 className="mb-2 text-2xl font-bold">macOS</h2>
              <p className="mb-8 text-sm text-muted-foreground">
                macOS 12 (Monterey) 이상 | 약 10MB
              </p>
              <a href="/Daily-Reflect_0.1.0_aarch64.dmg" download>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 px-10 text-white hover:from-indigo-600 hover:to-violet-600"
                >
                  macOS용 다운로드 (.dmg)
                </Button>
              </a>
              <p className="mt-8 text-sm text-muted-foreground">
                Windows 버전은 현재 준비 중입니다.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Installation steps */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold">설치 방법</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                1
              </div>
              <div>
                <h3 className="font-semibold">다운로드</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  위 버튼을 클릭하여 .dmg 파일을 다운로드합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                2
              </div>
              <div>
                <h3 className="font-semibold">응용 프로그램 폴더로 이동</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  .dmg 파일을 열고, Daily Reflect 앱을 응용 프로그램 폴더로
                  드래그합니다.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-sm font-bold text-indigo-400">
                3
              </div>
              <div>
                <h3 className="font-semibold">실행</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  앱을 실행하면 메뉴바에 아이콘이 나타납니다. 초기 설정을
                  진행하세요.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Configuration guide */}
        <section className="mb-16">
          <h2 className="mb-8 text-2xl font-bold">설정 가이드</h2>
          <div className="space-y-8">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <h3 className="mb-4 text-lg font-semibold">
                1. Gemini API 키 발급
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="shrink-0 text-indigo-400">-</span>
                  <span>
                    <Link
                      href="https://aistudio.google.com/apikey"
                      target="_blank"
                      className="text-indigo-400 underline underline-offset-4 hover:text-indigo-300"
                    >
                      Google AI Studio
                    </Link>
                    에 접속하여 API 키를 발급받습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-indigo-400">-</span>
                  <span>
                    Daily Reflect 설정에서 API 키를 입력합니다.
                  </span>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <h3 className="mb-4 text-lg font-semibold">
                2. GitHub 연동 (선택)
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="shrink-0 text-indigo-400">-</span>
                  <span>
                    GitHub에서 Personal Access Token을 생성합니다 (repo 권한
                    필요).
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-indigo-400">-</span>
                  <span>
                    회고글을 저장할 레포지토리를 지정합니다.
                  </span>
                </li>
              </ol>
            </div>

            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <h3 className="mb-4 text-lg font-semibold">
                3. Notion 연동 (선택)
              </h3>
              <ol className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="shrink-0 text-indigo-400">-</span>
                  <span>
                    Notion Integration을 생성하고 토큰을 발급받습니다.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 text-indigo-400">-</span>
                  <span>
                    회고글을 저장할 데이터베이스를 연결합니다.
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* System requirements */}
        <section>
          <h2 className="mb-8 text-2xl font-bold">시스템 요구사항</h2>
          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-muted-foreground">운영체제</span>
                <span>macOS 12 (Monterey) 이상</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-muted-foreground">디스크 공간</span>
                <span>약 10MB</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-3">
                <span className="text-muted-foreground">네트워크</span>
                <span>AI 생성 및 저장소 연동 시 필요</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">권한</span>
                <span>접근성 권한 (활동 추적용)</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-sm text-muted-foreground sm:flex-row sm:justify-between">
          <p>&copy; 2026 Daily Reflect. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link
              href="https://github.com/daily-reflect"
              target="_blank"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              개인정보 처리방침
            </Link>
            <Link
              href="mailto:hello@dailyreflect.app"
              className="hover:text-foreground transition-colors"
            >
              문의
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
