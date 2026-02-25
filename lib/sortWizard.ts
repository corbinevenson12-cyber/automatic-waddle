import type { PhotoNode } from '@prisma/client';

function hammingDistance(a: string, b: string) {
  const len = Math.min(a.length, b.length);
  let d = 0;
  for (let i = 0; i < len; i += 1) {
    if (a[i] !== b[i]) d += 1;
  }
  return d + Math.abs(a.length - b.length);
}

export type OrderedNode = PhotoNode & { confidenceToNext?: number; uncertainJump?: boolean };

export function sortNodes(nodes: PhotoNode[]): OrderedNode[] {
  const sorted = [...nodes].sort((a, b) => {
    const at = a.timestamp ? new Date(a.timestamp).getTime() : Number.MAX_SAFE_INTEGER;
    const bt = b.timestamp ? new Date(b.timestamp).getTime() : Number.MAX_SAFE_INTEGER;
    return at - bt;
  });

  return sorted.map((node, index) => {
    const next = sorted[index + 1];
    if (!next) return node;
    const gapMs = Math.abs((next.timestamp?.getTime() ?? 0) - (node.timestamp?.getTime() ?? 0));
    const similarityPenalty = node.perceptualHash && next.perceptualHash
      ? hammingDistance(node.perceptualHash, next.perceptualHash)
      : 18;
    const confidenceToNext = Math.max(0, 1 - gapMs / (1000 * 60 * 15) - similarityPenalty / 64);
    return { ...node, confidenceToNext, uncertainJump: confidenceToNext < 0.35 };
  });
}

export function suggestLikelyNext(nodes: PhotoNode[], currentNodeId: string) {
  const ordered = sortNodes(nodes);
  const idx = ordered.findIndex((n) => n.id === currentNodeId);
  return ordered[idx + 1] ?? null;
}
