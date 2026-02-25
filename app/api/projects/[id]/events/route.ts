import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor') ?? undefined;
  const events = await prisma.activityEvent.findMany({
    where: { projectId: params.id },
    take: 30,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ items: events, nextCursor: events[events.length - 1]?.id ?? null });
}
