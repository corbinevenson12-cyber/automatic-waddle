import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sortNodes } from '@/lib/sortWizard';

export async function POST(req: Request) {
  const body = await req.json();
  const nodes = await prisma.photoNode.findMany({ where: { projectId: body.projectId }, take: 1500 });
  const sorted = sortNodes(nodes);
  const uncertain = sorted.filter((s) => s.uncertainJump).map((s) => s.id);

  await prisma.activityEvent.create({
    data: {
      projectId: body.projectId,
      type: 'SORT_COMPLETED',
      payload: { uncertainCount: uncertain.length }
    }
  });

  return NextResponse.json({ order: sorted.map((s) => ({ id: s.id, confidenceToNext: s.confidenceToNext })), uncertain });
}
