import { prisma } from "@/lib/db";
import { getUserInstallationId } from "@/features/github/server/installation";

export type PullRequestItem = {
  id: string;
  installationId: number;
  repoFullName: string;
  prNumber: number;
  title: string;
  authorLogin: string | null;
  headSha: string;
  baseBranch: string;
  status: string;
  reviewComment: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function getPullRequestsForUser(userId: string): Promise<PullRequestItem[]> {
  const installationId = await getUserInstallationId(userId);

  if (!installationId) {
    return [];
  }

  return prisma.pullRequest.findMany({
    where: {
      installationId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

