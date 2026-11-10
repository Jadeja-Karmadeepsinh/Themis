"use client";

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowClockwise, Check, WarningCircle } from '@phosphor-icons/react';
import { githubRepoKeys } from '@/features/github/lib/repos-query';
import { syncRepoCodebase } from '../actions/repo-sync';
import { Button } from '@/components/ui/button';
import { RepoSyncStatus } from '../types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type SyncRepoButtonProps = {
    repoFullName: string;
    branch: string;
    syncStatus: RepoSyncStatus | null;
};

function isSyncing(status: RepoSyncStatus | null, mutationPending: boolean) {
    if (mutationPending) {
        return true;
    }
    return status === "pending" || status === "syncing";
}

function getButtonLabel(status: RepoSyncStatus | null, mutationPending: boolean) {
    if (isSyncing(status, mutationPending)) {
        return "Syncing…";
    }
    if (status === "synced") {
        return "Re-sync";
    }
    if (status === "failed") {
        return "Retry";
    }
    return "Sync";
}

const SyncRepoButton = ({ repoFullName, branch, syncStatus }: SyncRepoButtonProps) => {
    const queryClient = useQueryClient();

    const syncRepo = useMutation({
        mutationFn: () => syncRepoCodebase(repoFullName, branch),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: githubRepoKeys.all });
            toast.success(`Sync started for ${repoFullName}`);
        },
        onError: (error) => {
            toast.error(`Failed to trigger sync: ${error.message}`);
        }
    });

    const syncing = isSyncing(syncStatus, syncRepo.isPending);

    return (
        <div className="flex items-center justify-end gap-2">
            {syncStatus === "synced" && (
                <span className="inline-flex items-center gap-1 rounded border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
                    <Check className="size-3" />
                    Synced
                </span>
            )}
            {syncStatus === "failed" && (
                <span className="inline-flex items-center gap-1 rounded border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[11px] font-medium text-rose-400">
                    <WarningCircle className="size-3" />
                    Failed
                </span>
            )}
            {syncing && (
                <span className="inline-flex items-center gap-1 rounded border border-blue-500/20 bg-blue-500/10 px-2 py-0.5 text-[11px] font-medium text-blue-400 animate-pulse">
                    <ArrowClockwise className="size-3 animate-spin" />
                    Syncing
                </span>
            )}

            <Button
                size="sm"
                variant={syncStatus === "synced" ? "ghost" : "outline"}
                disabled={syncing}
                onClick={() => syncRepo.mutate()}
                className={cn(
                    "h-7 text-xs",
                    syncStatus === "synced" && "text-muted-foreground hover:text-foreground",
                    syncStatus === "failed" && "border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
                )}
            >
                {syncing && <ArrowClockwise className="size-3 mr-1 animate-spin" />}
                {getButtonLabel(syncStatus, syncRepo.isPending)}
            </Button>
        </div>
    );
};

export default SyncRepoButton;
