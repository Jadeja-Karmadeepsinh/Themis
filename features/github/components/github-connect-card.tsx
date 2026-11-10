"use client";

import {
    ArrowClockwise,
    ArrowSquareOut,
    CheckCircle,
    Folders,
    Gear,
    GithubLogo,
    Plugs,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useTransition } from "react";

import type { GithubInstallationStatus } from "@/features/dashboard/lib/types";
import {
    statusBadge,
    statusButtonClass,
} from "@/features/dashboard/lib/status-style";
import { getGithubInstallUrl } from "@/features/github/utils/github-app";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { disconnectGithubApp, syncGithubApp } from "../actions";
import { DASHBOARD_ROUTES } from "@/features/dashboard/lib/routes";

type GithubConnectCardProps = {
    userId: string;
    installation: GithubInstallationStatus;
};

function ConnectedDetails({
    accountLogin,
    installedAt,
}: {
    accountLogin: string | null;
    installedAt: string | null;
}) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="size-4 text-emerald-500" weight="fill" />
                <span className="text-muted-foreground">Connected GitHub Account:</span>
                <span className="font-semibold text-foreground">
                    @{accountLogin}
                </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
                Themis has access to your designated GitHub repositories. Pull requests created or updated on those repositories are automatically reviewed using your configured AI models and guidelines.
            </p>
            {installedAt && (
                <p className="text-[11px] text-muted-foreground/60 font-mono">
                    Linked: {new Date(installedAt).toLocaleString()}
                </p>
            )}
        </div>
    );
}

function DisconnectedDetails() {
    return (
        <div className="space-y-3">
            <ul className="list-inside list-disc space-y-1 text-xs text-muted-foreground">
                <li>Access public and private repositories you designate</li>
                <li>Receive webhooks for pull request creation and updates</li>
                <li>Post AI-generated automated reviews directly on PR diffs</li>
            </ul>
            <div className="rounded border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-200/90 leading-relaxed">
                <span className="font-medium">Already clicked Save on GitHub?</span> Click <strong>Check / Sync Connection</strong> below to immediately fetch and link your GitHub installation.
            </div>
        </div>
    );
}

function ConnectedActions({ installUrl }: { installUrl: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                nativeButton={false}
                render={<Link href={DASHBOARD_ROUTES.repos} />}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
                <Folders className="size-4" />
                View Repositories
            </Button>

            <Button
                nativeButton={false}
                render={
                    <a
                        href={installUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                    />
                }
                variant="outline"
            >
                <Gear className="size-4" />
                Configure Repositories on GitHub
                <ArrowSquareOut className="size-3 opacity-60" />
            </Button>

            <Button
                variant="outline"
                disabled={isPending}
                onClick={() => startTransition(async () => {
                    await syncGithubApp();
                })}
            >
                <ArrowClockwise className={cn("size-4", isPending && "animate-spin")} />
                {isPending ? "Syncing…" : "Sync Repositories"}
            </Button>

            <form action={disconnectGithubApp}>
                <Button
                    type="submit"
                    variant="outline"
                    className={statusButtonClass.danger}
                >
                    <Plugs className="size-4" />
                    Disconnect
                </Button>
            </form>
        </div>
    );
}

function DisconnectedActions({ installUrl }: { installUrl: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className="flex flex-wrap items-center gap-2">
            <Button
                nativeButton={false}
                render={
                    <a
                        href={installUrl}
                        target="_blank"
                        rel="noreferrer noopener"
                    />
                }
                className={statusButtonClass.success}
            >
                <GithubLogo className="size-4" />
                Install / Configure GitHub App
                <ArrowSquareOut className="size-3 opacity-80" />
            </Button>

            <Button
                variant="outline"
                disabled={isPending}
                onClick={() => startTransition(async () => {
                    await syncGithubApp();
                })}
            >
                <ArrowClockwise className={cn("size-4", isPending && "animate-spin")} />
                {isPending ? "Checking…" : "Check / Sync Connection"}
            </Button>
        </div>
    );
}

export function GithubConnectCard({
    userId,
    installation,
}: GithubConnectCardProps) {
    const { connected, accountLogin, installedAt } = installation;
    const installUrl = getGithubInstallUrl(userId);

    let cardBorderClass = "border-border";
    let iconWrapperClass = "border-border bg-muted";
    let statusTone: "success" | "neutral" = "neutral";
    let statusLabel = "Not connected";

    if (connected) {
        cardBorderClass = "border-emerald-500/30";
        iconWrapperClass =
            "border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
        statusTone = "success";
        statusLabel = "Connected";
    }

    return (
        <div className="flex flex-1 flex-col gap-6 p-6">
            <Card className={cn("max-w-2xl transition-colors", cardBorderClass)}>
                <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span
                                className={cn(
                                    "flex size-10 items-center justify-center border",
                                    iconWrapperClass
                                )}
                            >
                                <GithubLogo className="size-5" />
                            </span>
                            <div>
                                <CardTitle className="text-lg">GitHub App</CardTitle>
                                <CardDescription>
                                    Connect Themis to your GitHub account or organization to enable automated PR code reviews.
                                </CardDescription>
                            </div>
                        </div>
                        <span className={statusBadge(statusTone)}>{statusLabel}</span>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {connected ? (
                        <ConnectedDetails
                            accountLogin={accountLogin}
                            installedAt={installedAt}
                        />
                    ) : (
                        <DisconnectedDetails />
                    )}
                </CardContent>
                <CardFooter className="pt-2">
                    {connected ? (
                        <ConnectedActions installUrl={installUrl} />
                    ) : (
                        <DisconnectedActions installUrl={installUrl} />
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
