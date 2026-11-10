import { Pinecone } from '@pinecone-database/pinecone';

let pinecone: Pinecone | null = null;
let cachedHost: string | null = null;

const PINECONE_API_VERSION = "2026-07";

export function getPineconeClient(): Pinecone {
    if (!pinecone) {
        pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY! });
    }
    return pinecone;
}

export async function getPineconeIndexHost(): Promise<string> {
    if (cachedHost) return cachedHost;
    if (process.env.PINECONE_HOST) {
        cachedHost = process.env.PINECONE_HOST.replace(/^https?:\/\//, "");
        return cachedHost;
    }
    const pc = getPineconeClient();
    const indexName = process.env.PINECONE_INDEX!;
    const desc = await pc.describeIndex(indexName);
    cachedHost = desc.host;
    return cachedHost;
}

export type DocumentChunkInput = {
    id: string;
    filePath: string;
    text: string;
};

const BATCH_SIZE = 80;

export async function upsertDocumentChunks(
    namespace: string,
    chunks: DocumentChunkInput[]
): Promise<void> {
    if (chunks.length === 0) return;

    const host = await getPineconeIndexHost();
    const apiKey = process.env.PINECONE_API_KEY!;
    const url = `https://${host}/namespaces/${encodeURIComponent(namespace)}/documents/upsert`;

    for (let start = 0; start < chunks.length; start += BATCH_SIZE) {
        const batch = chunks.slice(start, start + BATCH_SIZE);
        const documents = batch.map((chunk) => ({
            _id: chunk.id,
            title: chunk.filePath,
            chunk_text: chunk.text,
        }));

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Api-Key": apiKey,
                "Content-Type": "application/json",
                "X-Pinecone-API-Version": PINECONE_API_VERSION,
            },
            body: JSON.stringify({ documents }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`Pinecone documents upsert failed (${response.status}): ${errBody}`);
        }
    }
}

export async function deleteDocumentNamespace(namespace: string): Promise<void> {
    const host = await getPineconeIndexHost();
    const apiKey = process.env.PINECONE_API_KEY!;
    const url = `https://${host}/namespaces/${encodeURIComponent(namespace)}`;

    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Api-Key": apiKey,
            "X-Pinecone-API-Version": PINECONE_API_VERSION,
        },
    });

    if (!response.ok && response.status !== 404) {
        const errBody = await response.text();
        console.warn(`Pinecone namespace delete returned ${response.status}: ${errBody}`);
    }
}

export type DocumentSearchHit = {
    id: string;
    score: number;
    title?: string;
    chunkText?: string;
};

export async function searchDocumentChunks(
    namespace: string,
    query: string,
    topK = 10
): Promise<DocumentSearchHit[]> {
    const host = await getPineconeIndexHost();
    const apiKey = process.env.PINECONE_API_KEY!;
    const url = `https://${host}/namespaces/${encodeURIComponent(namespace)}/documents/search`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Api-Key": apiKey,
            "Content-Type": "application/json",
            "X-Pinecone-API-Version": PINECONE_API_VERSION,
        },
        body: JSON.stringify({
            top_k: topK,
            include_fields: ["title", "chunk_text"],
            score_by: [
                {
                    type: "embed",
                    field: "chunk_text",
                    query,
                },
            ],
        }),
    });

    if (!response.ok) {
        if (response.status === 404) return [];
        const errBody = await response.text();
        throw new Error(`Pinecone documents search failed (${response.status}): ${errBody}`);
    }

    const data = await response.json();
    const matches: any[] = data.matches || [];

    return matches.map((match) => ({
        id: match._id,
        score: match._score,
        title: match.title,
        chunkText: match.chunk_text,
    }));
}
