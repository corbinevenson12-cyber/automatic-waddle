import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { reciprocalDirection, validateEdge } from '@/lib/edgeValidation';

export async function POST(req: Request) {
  const body = await req.json();
  const existing = await prisma.edge.findMany({ where: { projectId: body.projectId, fromNodeId: body.fromNodeId } });
  const validation = validateEdge(existing, body.fromNodeId, body.direction, body.toNodeId);
  if (!validation.ok) return NextResponse.json(validation, { status: 400 });

  const edge = await prisma.edge.create({
    data: {
      projectId: body.projectId,
      fromNodeId: body.fromNodeId,
      toNodeId: body.toNodeId,
      direction: body.direction,
      confidence: body.confidence ?? 0.8,
      createdById: body.createdById
    }
  });

  let reciprocal = null;
  if (body.autoReciprocal) {
    reciprocal = await prisma.edge.create({
      data: {
        projectId: body.projectId,
        fromNodeId: body.toNodeId,
        toNodeId: body.fromNodeId,
        direction: reciprocalDirection(body.direction),
        confidence: 0.75,
        createdById: body.createdById
      }
    });
  }

  await prisma.activityEvent.create({ data: { projectId: body.projectId, actorId: body.createdById, type: 'EDGE_CREATED', payload: { edgeId: edge.id } } });

  return NextResponse.json({ edge, reciprocal });
}

export async function DELETE(req: Request) {
  const body = await req.json();
  await prisma.edge.delete({ where: { id: body.id } });
  await prisma.activityEvent.create({ data: { projectId: body.projectId, actorId: body.actorId, type: 'EDGE_DELETED', payload: { edgeId: body.id } } });
  return NextResponse.json({ ok: true });
}
