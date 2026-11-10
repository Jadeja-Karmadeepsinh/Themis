import type { CodeChunk } from "@/features/reviews/types/review";
import { searchDocumentChunks, upsertDocumentChunks } from "@/features/pinecone/client";

const CONTEXT_RESULTS = 10;

export function buildPrNamespace(repoFullName: string, prNumber: number) {
    return `${repoFullName.replace("/", "--")}--pr-${prNumber}`;
}

export async function saveChunksToPinecone(
    namespace: string,
    chunks: CodeChunk[]
) {
    // namespace() scopes vectors so this PR never mixes with repo-wide sync data
    await upsertDocumentChunks(namespace, chunks);
}

export async function searchPrContext(namespace: string, query: string) {
    const hits = await searchDocumentChunks(namespace, query, CONTEXT_RESULTS);
    const snippets: string[] = [];

    for (const hit of hits) {
        if (!hit.chunkText) {
            continue;
        }

        snippets.push(`File: ${hit.title ?? "unknown"}\n${hit.chunkText}`);
    }

    return snippets;
}
