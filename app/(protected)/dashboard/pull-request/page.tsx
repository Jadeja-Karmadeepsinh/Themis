import type { Metadata } from "next";
import Link from "next/link";
import { requireAuth } from "@/features/auth/actions";
import { getInstallationStatus } from "@/features/github/server/installation";
import { getPullRequestsForUser } from "@/features/reviews/server/get-pull-requests";
import { PullRequestList } from "@/features/reviews/components/pull-request-list";
import { DashboardHeader } from "@/features/dashboard/components/dashboard-header";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Pull Requests · Dashboard",
  description: "Track incoming pull requests and automated AI review comments.",
};

function ReposNotConnected() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
      <p className="text-sm text-muted-foreground">
        Install the GitHub App first to track pull requests.
      </p>
      <Button nativeButton={false} render={<Link href={DASHBOARD_ROUTES.github} />}>
        Go to GitHub App
      </Button>
    </div>
  );
}

export default async function DashboardPullRequestsPage() {
  const session = await requireAuth();
  const installation = await getInstallationStatus(session.user.id);

  if (!installation.connected) {
    return (
      <div className="flex flex-1 flex-col">
        <DashboardHeader
          title="Pull Requests"
          description="Track incoming pull requests and automated AI review comments."
        />
        <ReposNotConnected />
      </div>
    );
  }

  const pullRequests = await getPullRequestsForUser(session.user.id);

  return (
    <div className="flex flex-1 flex-col">
      <DashboardHeader
        title="Pull Requests"
        description="Track incoming pull requests and automated AI review comments."
      />
      <PullRequestList pullRequests={pullRequests} />
    </div>
  );
}

