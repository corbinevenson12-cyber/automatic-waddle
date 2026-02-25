import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const [nodes, edges] = await Promise.all([
    prisma.photoNode.findMany({
      where: { projectId: params.id },
      select: { id: true, thumbnailUrl: true, imageUrl: true, largeUrl: true, areaTag: true },
      take: 1500
    }),
    prisma.edge.findMany({ where: { projectId: params.id }, select: { id: true, fromNodeId: true, toNodeId: true, direction: true } })
  ]);
  return NextResponse.json({ nodes, edges });
}
