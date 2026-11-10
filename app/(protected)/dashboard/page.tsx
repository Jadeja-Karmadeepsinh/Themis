import Link from "next/link";
import { requireAuth } from "@/features/auth/actions";
import { getInstallationStatus } from "@/features/github/server/installation";
import { getUserSubscription } from "@/features/billing/server/subscription";
import { getUsageSummary } from "@/features/billing/server/usage";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import {
  GitBranch,
  GithubLogo,
  Gear,
  Sparkle,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Clock,
} from "@phosphor-icons/react/dist/ssr";

export default async function DashboardOverviewPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);
  const subscription = await getUserSubscription(session.user.id);
  const usage = await getUsageSummary(session.user.id);

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Overview"
        description="Monitor your connected repositories, AI review activity, and account status."
      />

      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Welcome Banner */}
        <div className="flex flex-col gap-2 rounded-xl border border-border/80 bg-gradient-to-r from-muted/50 to-muted/20 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-bold tracking-tight">
              Welcome back, {session.user.name ?? "Developer"}! 👋
            </h2>
            <p className="text-sm text-muted-foreground">
              Themis is actively monitoring your connected GitHub repositories for pull requests.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 md:pt-0">
            <Button nativeButton={false} render={<Link href="/dashboard/repos" />}>
              <GitBranch className="size-4" />
              Manage Repositories
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">GitHub App Status</CardTitle>
              <GithubLogo className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 pt-1">
                <span
                  className={statusBadge(
                    installation.connected ? "success" : "neutral"
                  )}
                >
                  {installation.connected ? "Connected" : "Not Connected"}
                </span>
                {installation.accountLogin && (
                  <span className="text-xs text-muted-foreground">
                    @{installation.accountLogin}
                  </span>
                )}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {installation.connected
                  ? "Access granted to selected repositories"
                  : "Install the app to enable pull request reviews"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscription Plan</CardTitle>
              <Sparkle className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-2xl font-bold capitalize">
                  {subscription.plan}
                </span>
                <span
                  className={statusBadge(
                    subscription.status === "active" ? "success" : "neutral"
                  )}
                >
                  {subscription.status}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                {subscription.plan === "pro"
                  ? "Unlimited AI reviews enabled"
                  : "Free tier (5 reviews / month)"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Reviews Used</CardTitle>
              <Clock className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usage.used}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  {usage.limit === null ? "/ Unlimited" : `/ ${usage.limit}`}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Resets on the 1st of next month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col justify-between transition hover:border-foreground/20">
            <CardHeader>
              <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <GitBranch className="size-5" />
              </div>
              <CardTitle className="text-base">Repositories</CardTitle>
              <CardDescription>
                View all public and private repositories and trigger on-demand codebase vector syncs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-between"
                nativeButton={false}
                render={<Link href="/dashboard/repos" />}
              >
                <span>View Repositories</span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between transition hover:border-foreground/20">
            <CardHeader>
              <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <GithubLogo className="size-5" />
              </div>
              <CardTitle className="text-base">GitHub App</CardTitle>
              <CardDescription>
                Connect or disconnect the Themis GitHub App, manage repository access and permissions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-between"
                nativeButton={false}
                render={<Link href="/dashboard/github" />}
              >
                <span>GitHub Connection</span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col justify-between transition hover:border-foreground/20">
            <CardHeader>
              <div className="mb-2 inline-flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Gear className="size-5" />
              </div>
              <CardTitle className="text-base">Settings & Billing</CardTitle>
              <CardDescription>
                Manage your profile, view current plan details, or upgrade to Pro for unlimited reviews.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full justify-between"
                nativeButton={false}
                render={<Link href="/dashboard/settings" />}
              >
                <span>Open Settings</span>
                <ArrowRight className="size-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
