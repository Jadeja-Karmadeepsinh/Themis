import { getServerSession } from "@/features/auth/actions";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";
import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import { getGithubApp } from "@/features/github/utils/github-app";
import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";


function getAccountLogin(
    account: { login?: string; slug?: string } | null | undefined
): string | null {
    if (!account) {
        return null;
    }

    if ("login" in account && account.login) {
        return account.login;
    }

    if (account.slug) {
        return account.slug;
    }

    return null;
}
function buildDisconnectedStatus(): GithubInstallationStatus {
    return { connected: false, accountLogin: null, installedAt: null };
}


export async function getInstallationStatus(userId: string): Promise<GithubInstallationStatus> {
    let installation = await prisma.githubInstallation.findUnique({
        where: {
            userId
        }
    });

    if (!installation) {
        try {
            const account = await prisma.account.findFirst({
                where: { userId, providerId: "github" },
            });

            const app = getGithubApp();
            const { data: installations } = await app.octokit.request("GET /app/installations");

            let matched = installations.find((inst) => {
                if (account && String(inst.account?.id) === account.accountId) return true;
                return false;
            });

            if (!matched && installations.length === 1) {
                matched = installations[0];
            }

            if (matched) {
                await saveInstallation(userId, matched.id);
                installation = await prisma.githubInstallation.findUnique({
                    where: { userId },
                });
            }
        } catch (e) {
            console.error("Auto-sync error in getInstallationStatus:", e);
        }
    }

    if (!installation) {
        return buildDisconnectedStatus();
    }

    return {
        connected: true,
        accountLogin: installation.accountLogin,
        installedAt: installation.createdAt.toISOString()
    };
}


export async function saveInstallation(userId: string, installationId: number) {
    const app = getGithubApp();

    const { data } = await app.octokit.request(
        "GET /app/installations/{installation_id}",
        { installation_id: installationId }
    )

    const accountLogin = getAccountLogin(data.account);

    await prisma.githubInstallation.upsert({
        where: { userId },
        create: {
            userId,
            installationId,
            accountLogin,
            accountType: data.target_type ?? null,
        },
        update: {
            installationId,
            accountLogin,
            accountType: data.target_type ?? null,
        }
    })
}


export async function deleteInstallation(userId: string) {
    await prisma.githubInstallation.delete({ where: { userId } });
}

export async function getUserIdByInstallationId(installationId: number) {
    const installation = await prisma.githubInstallation.findFirst({
        where: { installationId },
        select: { userId: true },
    });

    if (!installation) {
        return null;
    }

    return installation.userId;
}

export async function getUserInstallationId(userId: string) {
    let installation = await prisma.githubInstallation.findUnique({
        where: { userId },
        select: { installationId: true },
    });

    if (!installation) {
        await getInstallationStatus(userId);
        installation = await prisma.githubInstallation.findUnique({
            where: { userId },
            select: { installationId: true },
        });
    }

    if (!installation) {
        return null;
    }

    return installation.installationId;
}

