import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  GithubLogo,
  GitBranch,
  ShieldCheck,
  Lightning,
  Sparkle,
  ArrowRight,
  Database,
  LockKey,
} from "@phosphor-icons/react/dist/ssr";

export default async function HomePage() {
  const session = await getServerSession();

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border/60 bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-3">
          <Image
            src="/logo2.svg"
            alt="Themis Logo"
            width={34}
            height={34}
            className="object-contain"
          />
          <span className="text-lg font-bold tracking-tight">Themis</span>
          <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
            AI Code Reviewer
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ModeToggle />
          {session ? (
            <Button nativeButton={false} render={<Link href="/dashboard/repos" />}>
              Open Dashboard
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button nativeButton={false} render={<Link href="/sign-in" />}>
              <GithubLogo className="size-4" />
              Sign in with GitHub
            </Button>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16 text-center md:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3.5 py-1 text-xs font-medium text-muted-foreground">
            <Sparkle className="size-3.5 text-amber-500" />
            <span>Next-Gen Semantic Pull Request Reviews</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Ship clean code faster with{" "}
            <span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Themis
            </span>
          </h1>

          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg md:text-xl">
            Themis connects to your GitHub repositories, indexes codebase context using
            vector embeddings, and delivers automated, context-aware PR reviews directly
            in your pull request comments.
          </p>

          {/* CTA Buttons */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            {session ? (
              <Button
                size="lg"
                className="h-12 px-6 text-base"
                nativeButton={false}
                render={<Link href="/dashboard/repos" />}
              >
                Go to Repositories
                <ArrowRight className="size-4" />
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  className="h-12 px-6 text-base"
                  nativeButton={false}
                  render={<Link href="/sign-in" />}
                >
                  <GithubLogo className="size-5" />
                  Sign In with GitHub
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-6 text-base"
                  nativeButton={false}
                  render={<Link href="/dashboard/repos" />}
                >
                  Explore Dashboard
                </Button>
              </>
            )}
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-border">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Lightning className="size-5" />
              </div>
              <h3 className="text-base font-semibold">Instant Webhook Reviews</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                As soon as a PR is opened or updated, Themis triggers background review
                jobs via Inngest and posts actionable findings.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-border">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Database className="size-5" />
              </div>
              <h3 className="text-base font-semibold">Pinecone Semantic Search</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Embeds PR diff chunks and your codebase architecture into vector embeddings
                to eliminate hallucinations and ground reviews in real code.
              </p>
            </div>

            <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm transition hover:border-border">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="size-5" />
              </div>
              <h3 className="text-base font-semibold">Security & Bug Detection</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Detects logic flaws, auth oversights, exposed secrets, SQL injections, and
                performance bottlenecks before merging.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Themis · AI Code Reviewer. Powered by Next.js, Pinecone & Inngest.</p>
      </footer>
    </div>
  );
}
