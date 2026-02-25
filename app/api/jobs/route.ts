import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

function simpleHash(input: string) {
  return crypto.createHash('sha1').update(input).digest('hex').slice(0, 16);
}

export async function POST(req: Request) {
  const { projectId } = await req.json();
  const nodes = await prisma.photoNode.findMany({ where: { projectId }, take: 1500 });

  let processed = 0;
  for (const node of nodes) {
    await prisma.photoNode.update({ where: { id: node.id }, data: { perceptualHash: simpleHash(node.thumbnailUrl) } });
    processed += 1;
  }

  await prisma.activityEvent.create({
    data: { projectId, type: 'NODE_UPDATED', payload: { job: 'hash_generation', processed } }
  });

  return NextResponse.json({ ok: true, processed });
}
