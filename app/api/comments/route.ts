import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const comment = await prisma.comment.create({
    data: {
      projectId: body.projectId,
      nodeId: body.nodeId,
      authorId: body.authorId,
      body: body.body,
      pinX: body.pinX,
      pinY: body.pinY
    }
  });
  await prisma.activityEvent.create({ data: { projectId: body.projectId, actorId: body.authorId, type: 'COMMENT_CREATED', payload: { nodeId: body.nodeId } } });
  return NextResponse.json(comment);
}
