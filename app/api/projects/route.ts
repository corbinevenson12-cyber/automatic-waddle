import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSessionUser } from '@/lib/auth';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get('cursor') ?? undefined;
  const items = await prisma.project.findMany({
    take: 20,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { nodes: true, members: true } } }
  });
  return NextResponse.json({ items, nextCursor: items[items.length - 1]?.id ?? null });
}

export async function POST(req: Request) {
  const user = await getSessionUser() ?? await prisma.user.upsert({ where: { email: 'demo@photopath.local' }, update: {}, create: { email: 'demo@photopath.local', name: 'Demo User' } });
  const body = await req.json();
  const project = await prisma.project.create({
    data: {
      name: body.name,
      description: body.description,
      createdById: user.id,
      members: { create: [{ userId: user.id, role: 'ADMIN' }] }
    }
  });
  return NextResponse.json(project);
}
