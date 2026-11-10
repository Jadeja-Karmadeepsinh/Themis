"use client";

import { useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  GitPullRequest,
  ArrowSquareOut,
  Clock,
  Sparkle,
  MagnifyingGlass,
  FileText,
} from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { statusBadge } from "@/features/dashboard/lib/status-style";
import type { PullRequestItem } from "../server/get-pull-requests";

type FilterStatus = "all" | "reviewed" | "processing" | "pending";

function getStatusBadgeTone(status: string): "success" | "info" | "warning" | "danger" | "neutral" {
  switch (status) {
    case "reviewed":
      return "success";
    case "processing":
      return "info";
    case "rate_limited":
      return "danger";
    case "pending":
    default:
      return "neutral";
  }
}

export function PullRequestList({ pullRequests }: { pullRequests: PullRequestItem[] }) {
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");
  const [selectedReview, setSelectedReview] = useState<PullRequestItem | null>(null);

  const filtered = useMemo(() => {
    return pullRequests.filter((pr) => {
      const matchesFilter = filter === "all" || pr.status === filter;
      const term = search.trim().toLowerCase();
      const matchesSearch =
        term === "" ||
        pr.title.toLowerCase().includes(term) ||
        pr.repoFullName.toLowerCase().includes(term) ||
        (pr.authorLogin && pr.authorLogin.toLowerCase().includes(term));
      return matchesFilter && matchesSearch;
    });
  }, [pullRequests, filter, search]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Controls: Search and Status Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search pull requests, repos, or authors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs value={filter} onValueChange={(val) => setFilter(val as FilterStatus)}>
          <TabsList>
            <TabsTrigger value="all">
              All ({pullRequests.length})
            </TabsTrigger>
            <TabsTrigger value="reviewed">
              Reviewed ({pullRequests.filter((p) => p.status === "reviewed").length})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing ({pullRequests.filter((p) => p.status === "processing").length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({pullRequests.filter((p) => p.status === "pending").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* PR Table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/80 p-12 text-center">
          <div className="mb-3 inline-flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <GitPullRequest className="size-6" />
          </div>
          <h3 className="text-base font-semibold">No pull requests found</h3>
          <p className="mt-1 max-w-sm text-xs text-muted-foreground">
            {pullRequests.length === 0
              ? "When pull requests are opened on your connected repositories, Themis will automatically analyze them and show reviews here."
              : "No pull requests match the current search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="w-[45%]">Pull Request</TableHead>
                <TableHead>Repository</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((pr) => (
                <TableRow key={pr.id}>
                  <TableCell>
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 font-medium">
                        <span>{pr.title}</span>
                        <span className="text-xs text-muted-foreground">#{pr.prNumber}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {pr.authorLogin ? <span>by @{pr.authorLogin}</span> : null}
                        <span>·</span>
                        <span>base: {pr.baseBranch}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {pr.repoFullName}
                  </TableCell>

                  <TableCell>
                    <span className={statusBadge(getStatusBadgeTone(pr.status))}>
                      {pr.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      <span>
                        {formatDistanceToNow(new Date(pr.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {pr.reviewComment ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedReview(pr)}
                        >
                          <Sparkle className="size-3.5 text-blue-500" />
                          View Review
                        </Button>
                      ) : null}

                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={
                          <a
                            href={`https://github.com/${pr.repoFullName}/pull/${pr.prNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        }
                      >
                        <ArrowSquareOut className="size-3.5" />
                        GitHub
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Sparkle className="size-5 text-blue-500" />
              AI Review for {selectedReview?.title} (#{selectedReview?.prNumber})
            </DialogTitle>
            <DialogDescription>
              {selectedReview?.repoFullName} · Generated by Themis
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 rounded-lg border border-border bg-muted/40 p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap">
            {selectedReview?.reviewComment ?? "No review generated yet."}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

