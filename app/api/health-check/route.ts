import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get('projectId');
  if (!projectId) return NextResponse.json({ error: 'projectId required' }, { status: 400 });

  const [nodes, edges] = await Promise.all([
    prisma.photoNode.findMany({ where: { projectId }, select: { id: true } }),
    prisma.edge.findMany({ where: { projectId }, select: { fromNodeId: true, toNodeId: true } })
  ]);

  const out = new Map<string, number>();
  const incoming = new Map<string, number>();
  nodes.forEach((n) => {
    out.set(n.id, 0);
    incoming.set(n.id, 0);
  });
  edges.forEach((e) => {
    out.set(e.fromNodeId, (out.get(e.fromNodeId) ?? 0) + 1);
    incoming.set(e.toNodeId, (incoming.get(e.toNodeId) ?? 0) + 1);
  });

  const deadEnds = [...out.entries()].filter(([, c]) => c === 0).map(([id]) => id);
  const isolated = nodes.filter((n) => (out.get(n.id) ?? 0) === 0 && (incoming.get(n.id) ?? 0) === 0).map((n) => n.id);

  return NextResponse.json({ cycles: 'Run DFS in worker for exact cycle list', deadEnds: deadEnds.length, isolated: isolated.length });
}
