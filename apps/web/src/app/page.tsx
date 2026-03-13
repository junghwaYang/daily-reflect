import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background gradient */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-500/20 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[600px] translate-x-1/4 translate-y-1/4 rounded-full bg-violet-500/15 blur-[100px]" />
      </div>

      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="flex items-center gap-3">
            <Link href="https://github.com/daily-reflect" target="_blank">
              <Button variant="ghost" size="sm">
                GitHub
              </Button>
            </Link>
            <Link href="/download">
              <Button
                size="sm"
                className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
              >
                다운로드
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <section className="flex min-h-screen flex-col items-center justify-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            오픈소스 데스크톱 에이전트
          </div>
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            하루를 기록하지 않아도,
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              회고는 자동으로.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
            데스크톱 에이전트가 활동을 추적하고, AI가 회고록을 만들어 GitHub이나
            Notion에 자동으로 저장합니다.
          </p>
          <div className="mt-10 flex items-center gap-4">
            <Link href="/download">
              <Button
                size="lg"
                className="bg-gradient-to-r from-indigo-500 to-violet-500 px-8 text-white hover:from-indigo-600 hover:to-violet-600"
              >
                macOS 다운로드
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="lg">
                동작 원리 보기
              </Button>
            </Link>
          </div>

          {/* Terminal demo animation */}
          <div className="mt-16 w-full max-w-xl">
            <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950 shadow-2xl shadow-indigo-500/10">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
                <span className="ml-2 text-xs text-muted-foreground">
                  Terminal
                </span>
              </div>
              <div className="p-5 font-mono text-sm leading-7 text-left">
                <div className="text-zinc-400">
                  <span className="text-green-400">$</span> daily-reflect status
                </div>
                <div className="mt-3 animate-fade-in-1 text-emerald-400">
                  &#10003; 추적 중... (오늘 7시간 20분)
                </div>
                <div className="animate-fade-in-2 text-zinc-300">
                  &#10003; VSCode 3h 05m | Chrome 1h 35m | Slack 45m
                </div>
                <div className="animate-fade-in-3 text-indigo-400">
                  &#10003; 회고글 생성 예정: 오늘 23:50
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="pb-32">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              어떻게 동작하나요?
            </h2>
            <p className="mt-3 text-muted-foreground">
              3단계만으로 매일 자동 회고를 받아보세요
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <Card className="group relative overflow-hidden border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
              <CardContent className="p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                    <div className="h-5 w-5 rounded-md border-2 border-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    STEP 01
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  설치하고 잊어버리세요
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  데스크톱 에이전트를 설치하면 백그라운드에서 조용히 활동을
                  추적합니다. 어떤 앱을 얼마나 사용했는지 자동으로 기록됩니다.
                </p>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="group relative overflow-hidden border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
              <CardContent className="p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                    <div className="h-5 w-5 rounded-full border-2 border-violet-400 relative">
                      <div className="absolute inset-1 rounded-full bg-violet-400" />
                    </div>
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    STEP 02
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  AI가 하루를 요약합니다
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  매일 밤 설정한 시각에 AI가 활동 로그를 분석하여 자연스러운
                  회고글을 작성합니다. 일기체, 블로그체, 불렛 포인트 중 원하는
                  스타일을 선택하세요.
                </p>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="group relative overflow-hidden border-white/5 bg-white/[0.03] transition-colors hover:bg-white/[0.06]">
              <CardContent className="p-8">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20">
                    <div className="h-5 w-5 rotate-45 border-2 border-indigo-400" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">
                    STEP 03
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-semibold">
                  GitHub 또는 Notion에 자동 저장
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  회고글이 자동으로 GitHub 레포에 커밋되거나 Notion
                  데이터베이스에 저장됩니다. 잔디도 채워지고, 기록도 남습니다.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Target audience */}
        <section className="pb-32">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              이런 분들에게 추천합니다
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
                <div className="h-4 w-4 rounded-sm bg-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">개발자</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                TIL을 쓰고 싶은데 매번 까먹으시나요? GitHub 레포에 자동으로
                쌓입니다.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-2xl">
                <div className="h-4 w-4 rounded-full bg-violet-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">PM / 디자이너</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                하루가 어디 갔는지 모르겠다면, Notion에 매일 정리해드립니다.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-2xl">
                <div className="h-4 w-4 rotate-45 bg-indigo-400" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">프리랜서</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                클라이언트별 작업 시간 파악이 자동으로.
              </p>
            </div>
          </div>
        </section>

        {/* Preview section */}
        <section className="pb-32">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              회고글 미리보기
            </h2>
            <p className="mt-3 text-muted-foreground">
              활동 로그가 어떻게 회고글로 변환되는지 확인하세요
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Left: Activity log */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                활동 로그
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>VSCode</span>
                    <span className="text-muted-foreground">3h 05m</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400" style={{ width: "65%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Chrome</span>
                    <span className="text-muted-foreground">1h 35m</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-violet-400" style={{ width: "35%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Slack</span>
                    <span className="text-muted-foreground">45m</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" style={{ width: "16%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Figma</span>
                    <span className="text-muted-foreground">1h 10m</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-indigo-400" style={{ width: "25%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Terminal</span>
                    <span className="text-muted-foreground">45m</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/5">
                    <div className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-violet-500" style={{ width: "16%" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Generated retrospective */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                AI 생성 회고글
              </h3>
              <div className="font-mono text-sm leading-7 text-zinc-300">
                <p className="text-muted-foreground text-xs mb-4">
                  retrospectives/2026-03-12.md
                </p>
                <p className="font-bold text-white mb-3">
                  # 2026년 3월 12일 회고
                </p>
                <p className="mb-3">
                  오늘은 주로 <span className="text-indigo-400">VSCode</span>에서
                  작업했다. 약 3시간 동안 프론트엔드 리팩토링에 집중했고, 컴포넌트
                  구조를 개선하는 데 상당한 진전이 있었다.
                </p>
                <p className="mb-3">
                  <span className="text-violet-400">Chrome</span>에서는 1시간 반
                  정도 기술 문서를 찾아보며 새로운 패턴을 학습했다.
                </p>
                <p>
                  <span className="text-indigo-400">Figma</span>에서 디자인
                  검토도 진행. 전반적으로 생산적인 하루였다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Integration section */}
        <section className="pb-32">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">저장소 연동</h2>
            <p className="mt-3 text-muted-foreground">
              회고글이 자동으로 저장됩니다
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">GitHub</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                지정한 레포에{" "}
                <code className="rounded bg-white/10 px-1.5 py-0.5 text-xs text-indigo-400">
                  retrospectives/2026-03-12.md
                </code>{" "}
                형태로 자동 커밋. 잔디도 채워집니다.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M4 4h16v16H4V4zm7.5 2.5v4.25H7.25V15h4.25v-4.25H15.75V6.5H11.5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">Notion</h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                데이터베이스에 매일 새 페이지가 자동 생성됩니다. 날짜별로
                정리되어 한눈에 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy section */}
        <section className="pb-32">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              프라이버시를 최우선으로
            </h2>
          </div>
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 md:p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    활동 데이터는{" "}
                    <strong className="text-white">
                      당신의 컴퓨터에만 저장
                    </strong>
                    됩니다
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    서버로 전송되지 않습니다
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20">
                    <div className="h-2 w-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    수집 항목: 앱 이름, 창 제목, 사용 시간뿐
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20">
                    <div className="h-2 w-2 rounded-full bg-red-400" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    키 입력, 스크린샷, 파일 내용은{" "}
                    <strong className="text-white">절대 수집하지 않습니다</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Download CTA */}
        <section className="pb-32">
          <Card className="overflow-hidden border-white/5 bg-gradient-to-br from-indigo-500/10 to-violet-500/10">
            <CardContent className="flex flex-col items-center p-12 text-center">
              <h2 className="text-3xl font-bold sm:text-4xl">
                지금 시작하세요
              </h2>
              <p className="mt-3 max-w-md text-muted-foreground">
                매일 자동으로 쌓이는 회고록, 오늘부터 시작해보세요.
              </p>
              <Link href="/download" className="mt-8">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 px-10 text-white hover:from-indigo-600 hover:to-violet-600"
                >
                  macOS 다운로드
                </Button>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                Windows — 곧 출시
              </p>
              <p className="mt-6 text-xs text-muted-foreground">
                무료로 사용 가능 · 오픈소스 · 데이터는 로컬에만
              </p>
            </CardContent>
          </Card>
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
