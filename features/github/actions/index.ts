"use server";

import { getServerSession } from "@/features/auth/actions";
import { redirect } from "next/navigation";
import { deleteInstallation, saveInstallation } from "../server/installation";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import { getGithubApp } from "../utils/github-app";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function disconnectGithubApp() {
    const session = await getServerSession();
  
    if (!session) {
      redirect("/sign-in");
    }
  
    await deleteInstallation(session.user.id);
    revalidatePath(DASHBOARD_ROUTES.github);
    redirect(DASHBOARD_ROUTES.github);
}

export async function syncGithubApp() {
    const session = await getServerSession();
  
    if (!session) {
      redirect("/sign-in");
    }

    const app = getGithubApp();
    const { data: installations } = await app.octokit.request("GET /app/installations");

    if (installations.length > 0) {
      const account = await prisma.account.findFirst({
        where: { userId: session.user.id, providerId: "github" },
      });

      const matched = installations.find((inst) => {
        if (account && String(inst.account?.id) === account.accountId) return true;
        return false;
      }) || (installations.length === 1 ? installations[0] : null);

      if (matched) {
        await saveInstallation(session.user.id, matched.id);
      }
    }

    revalidatePath(DASHBOARD_ROUTES.github);
    revalidatePath(DASHBOARD_ROUTES.repos);
    redirect(DASHBOARD_ROUTES.github);
}
