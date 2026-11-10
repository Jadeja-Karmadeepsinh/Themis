import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "@/features/auth/actions";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  GithubLogo,
  GitPullRequest,
  CheckCircle,
  WarningCircle,
  ShieldCheck,
  Lightning,
  Sparkle,
  ArrowRight,
  Database,
  Cpu,
  LockKey,
  Terminal,
  Code,
  GitBranch,
} from "@phosphor-icons/react/dist/ssr";

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <div className="relative min-h-screen bg-[#070809] font-sans text-zinc-100 selection:bg-zinc-800 selection:text-white">
      {/* Background ambient lighting & grid pattern */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 opacity-25 blur-[120px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(99, 102, 241, 0.4), rgba(56, 189, 248, 0.15), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-white/[0.08] bg-[#070809]/80 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 transition opacity-90 hover:opacity-100">
            <Image
              src="/logo2.svg"
              alt="Themis"
              width={26}
              height={26}
              className="size-6 rounded-md object-contain"
            />
            <span className="text-sm font-semibold tracking-tight text-white">Themis</span>
          </Link>
          <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2.5 py-0.5 text-[11px] font-mono text-zinc-400 sm:inline-flex">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            v1.0
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {session ? (
            <Link
              href="/dashboard/repos"
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/20 bg-white px-3 text-xs font-medium text-black transition hover:bg-zinc-200"
            >
              Open Dashboard
              <ArrowRight className="size-3.5" />
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.05] px-3 text-xs font-medium text-white transition hover:bg-white/[0.1] hover:border-white/20"
            >
              <GithubLogo className="size-3.5" />
              Sign in
            </Link>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-4 pt-20 pb-28 text-center sm:pt-28 md:pt-32">
        {/* Release Pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.02] px-3.5 py-1 text-xs text-zinc-400 backdrop-blur-sm">
          <Sparkle className="size-3.5 text-indigo-400" />
          <span className="font-mono text-[11px] uppercase tracking-wider text-zinc-300">
            Autonomous Code Review Engine
          </span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400">Zero Hallucinations</span>
        </div>

        {/* Main Headline */}
        <h1 className="mt-8 max-w-4xl text-4xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl">
          Code reviews that understand your{" "}
          <span className="bg-gradient-to-b from-white via-zinc-200 to-zinc-500 bg-clip-text text-transparent">
            entire codebase.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
          Themis connects to GitHub, embeds your repository structure with vector search, and delivers
          rigorous, architectural-level pull request reviews directly in your review comments.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {session ? (
            <Link
              href="/dashboard/repos"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200 shadow-[0_0_24px_rgba(255,255,255,0.15)]"
            >
              Launch Dashboard
              <ArrowRight className="size-4" />
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="inline-flex h-11 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200 shadow-[0_0_24px_rgba(255,255,255,0.15)]"
              >
                <GithubLogo className="size-4" />
                Connect with GitHub
              </Link>
              <Link
                href="/dashboard/repos"
                className="inline-flex h-11 items-center gap-2 rounded-lg border border-white/[0.1] bg-white/[0.03] px-5 text-sm font-medium text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
              >
                View Live Demo
              </Link>
            </>
          )}
        </div>

        {/* Interactive GitHub PR Review UI Mockup (Linear / CodeRabbit Aesthetic) */}
        <div className="mt-16 w-full max-w-4xl text-left">
          <div className="overflow-hidden rounded-xl border border-white/[0.1] bg-[#0c0d0e] shadow-2xl shadow-black/80">
            {/* Window Top Bar */}
            <div className="flex items-center justify-between border-b border-white/[0.07] bg-[#111214] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-zinc-700" />
                <span className="size-2.5 rounded-full bg-zinc-700" />
                <span className="size-2.5 rounded-full bg-zinc-700" />
                <span className="ml-3 font-mono text-xs text-zinc-400">
                  github.com/themis-ai/core/pull/84
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                  <GitPullRequest className="size-3" />
                  Open #84
                </span>
              </div>
            </div>

            {/* PR Title and Branch Information */}
            <div className="border-b border-white/[0.06] bg-[#0c0d0e] p-4 sm:p-5">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-base font-medium text-zinc-100 sm:text-lg">
                    fix(auth): invalidate active sessions on credential rotation
                  </h2>
                  <div className="mt-1 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-mono text-zinc-300">karmadeep</span> wants to merge into{" "}
                    <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                      main
                    </span>{" "}
                    from{" "}
                    <span className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[11px] text-zinc-300">
                      auth/fix-session-leak
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono text-zinc-500 sm:mt-0">
                  +18 / -4 lines
                </div>
              </div>
            </div>

            {/* Diff Preview */}
            <div className="border-b border-white/[0.06] bg-[#090a0b] font-mono text-xs">
              <div className="flex items-center justify-between border-b border-white/[0.04] bg-[#111215] px-4 py-2 text-zinc-400">
                <div className="flex items-center gap-2">
                  <Code className="size-3.5 text-zinc-400" />
                  <span>features/auth/server/session.ts</span>
                </div>
                <span className="text-[11px] text-zinc-500">TypeScript</span>
              </div>

              <div className="p-3 text-[12px] leading-relaxed">
                <div className="text-zinc-600">@@ -32,7 +32,9 @@ export async function updatePassword(...)</div>
                <div className="bg-red-500/[0.08] text-red-300/90 px-2 py-0.5">
                  - const user = await prisma.user.update(&#123; where: &#123; id &#125;, data &#125;);
                </div>
                <div className="bg-emerald-500/[0.08] text-emerald-300 px-2 py-0.5">
                  + const [user] = await prisma.$transaction([
                </div>
                <div className="bg-emerald-500/[0.08] text-emerald-300 px-2 py-0.5">
                  +   prisma.session.deleteMany(&#123; where: &#123; userId &#125; &#125;),
                </div>
                <div className="bg-emerald-500/[0.08] text-emerald-300 px-2 py-0.5">
                  +   prisma.user.update(&#123; where: &#123; id &#125;, data &#125;)
                </div>
                <div className="text-zinc-400 px-2 py-0.5">
                  &nbsp;&nbsp;return &#123; success: true &#125;;
                </div>
              </div>
            </div>

            {/* Inlined Themis AI Review Comment Card */}
            <div className="p-4 sm:p-5">
              <div className="rounded-lg border border-indigo-500/20 bg-indigo-950/[0.12] p-4 text-xs">
                {/* Bot header */}
                <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2.5">
                    <Image
                      src="/logo2.svg"
                      alt="Themis Bot"
                      width={20}
                      height={20}
                      className="size-5 rounded"
                    />
                    <span className="font-semibold text-zinc-200">themis[bot]</span>
                    <span className="rounded bg-indigo-500/10 px-1.5 py-0.5 font-mono text-[10px] text-indigo-400">
                      BOT
                    </span>
                    <span className="text-zinc-500">reviewed 12 seconds ago</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
                    <Database className="size-3 text-indigo-400" />
                    <span>Context: 12 vectors indexed</span>
                  </div>
                </div>

                {/* Review Body */}
                <div className="space-y-3 pt-3 text-zinc-300">
                  <p className="font-medium text-zinc-200">
                    Strong implementation of atomic session revocation. One critical race condition identified:
                  </p>

                  <div className="rounded-md border border-amber-500/20 bg-amber-500/[0.06] p-3 text-amber-200/90">
                    <div className="flex items-start gap-2">
                      <WarningCircle className="size-4 shrink-0 text-amber-400 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-300">
                          Active Session Cookie in Current Request:
                        </span>{" "}
                        The current request's session token is also deleted by{" "}
                        <code className="rounded bg-black/40 px-1 font-mono text-amber-200">deleteMany</code>, which will log out the user immediately unless a fresh session token is issued in this response.
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md border border-emerald-500/20 bg-emerald-500/[0.06] p-3 text-emerald-200/90">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="size-4 shrink-0 text-emerald-400 mt-0.5" />
                      <div>
                        <span className="font-semibold text-emerald-300">Verified Correctness:</span>{" "}
                        All foreign key cascades match{" "}
                        <code className="rounded bg-black/40 px-1 font-mono text-emerald-200">
                          prisma/schema.prisma:Session
                        </code>
                        . Transaction guarantees zero orphan session leaks.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Architectural Pillars / Features Grid */}
        <div className="mt-28 w-full max-w-5xl text-left">
          <div className="text-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">
              Architected for Precision
            </h2>
            <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
              Engineered like a senior staff engineer.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
              <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                <Database className="size-4 text-sky-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Full Codebase Vector Search</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Diffs are never reviewed in isolation. Themis queries your repo&apos;s Pinecone vector index to inspect related utility functions, schemas, and types.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
              <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                <Lightning className="size-4 text-amber-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Resilient Event Queuing</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Powered by Inngest. Every review is broken into deterministic steps (chunking, embedding, synthesis, posting) with automatic retries and zero timeout limits.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
              <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                <ShieldCheck className="size-4 text-emerald-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Actionable Security Insights</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Catches injection vulnerabilities, improper permission checks, missing index bottlenecks, and race conditions before code merges to production.
              </p>
            </div>

            {/* Pillar 4 */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
              <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                <GitBranch className="size-4 text-indigo-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">On-Demand Repo Sync</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Sync any repository from the dashboard with a single click. Themis chunks source files, embeds AST tokens, and maintains updated context namespaces.
              </p>
            </div>

            {/* Pillar 5 */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
              <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                <LockKey className="size-4 text-rose-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">Native GitHub App Security</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                No personal access tokens required. Authenticates via GitHub App asymmetric RSA keys with granular repo-level permissions.
              </p>
            </div>

            {/* Pillar 6 */}
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 transition hover:border-white/[0.16] hover:bg-white/[0.04]">
              <div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-zinc-200">
                <Terminal className="size-4 text-violet-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">High-Speed Developer Dashboard</h3>
              <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                Built with Next.js App Router, TanStack Query, and Shadcn UI. Filter pull requests, inspect review logs, and manage team subscriptions seamlessly.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="mt-28 w-full max-w-4xl rounded-2xl border border-white/[0.1] bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-8 text-center sm:p-12">
          <Image
            src="/logo2.svg"
            alt="Themis"
            width={40}
            height={40}
            className="mx-auto size-10 rounded-xl"
          />
          <h3 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
            Upgrade your pull request review workflow.
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-zinc-400">
            Install the Themis GitHub App in less than two minutes. Free for up to 5 reviews per month.
          </p>
          <div className="mt-6 flex justify-center">
            {session ? (
              <Link
                href="/dashboard/repos"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex h-10 items-center gap-2 rounded-lg bg-white px-5 text-sm font-medium text-black transition hover:bg-zinc-200"
              >
                <GithubLogo className="size-4" />
                Get Started with GitHub
              </Link>
            )}
          </div>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-white/[0.08] bg-[#070809] py-8 text-xs text-zinc-500">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <Image
              src="/logo2.svg"
              alt="Themis"
              width={18}
              height={18}
              className="size-4 rounded"
            />
            <span className="font-medium text-zinc-300">Themis</span>
            <span>·</span>
            <span>Autonomous Pull Request Reviewer</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/dashboard" className="transition hover:text-white">
              Dashboard
            </Link>
            <Link href="/dashboard/repos" className="transition hover:text-white">
              Repositories
            </Link>
            <Link href="/dashboard/github" className="transition hover:text-white">
              GitHub App
            </Link>
            <a
              href="https://github.com/Jadeja-Karmadeepsinh/Themis"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
