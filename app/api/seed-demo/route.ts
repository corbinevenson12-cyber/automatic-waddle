import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const user = await prisma.user.upsert({ where: { email: 'demo@photopath.local' }, update: {}, create: { email: 'demo@photopath.local', name: 'Demo User' } });
  const project = await prisma.project.create({
    data: {
      name: 'Demo Museum Walk',
      description: 'Seeded sample for PhotoPath',
      createdById: user.id,
      members: { create: { userId: user.id, role: 'ADMIN' } }
    }
  });

  for (let i = 0; i < 20; i += 1) {
    const node = await prisma.photoNode.create({
      data: {
        projectId: project.id,
        uploaderId: user.id,
        imageUrl: `https://picsum.photos/seed/${project.id}-${i}/2048/1024`,
        thumbnailUrl: `https://picsum.photos/seed/${project.id}-${i}/256/128`,
        mediumUrl: `https://picsum.photos/seed/${project.id}-${i}/1280/640`,
        largeUrl: `https://picsum.photos/seed/${project.id}-${i}/2048/1024`,
        timestamp: new Date(Date.now() + i * 60_000),
        areaTag: i < 10 ? 'lobby' : 'gallery'
      }
    });
    if (i > 0) {
      const prev = await prisma.photoNode.findFirst({ where: { projectId: project.id }, orderBy: { timestamp: 'desc' }, skip: 1 });
      if (prev) {
        await prisma.edge.create({ data: { projectId: project.id, fromNodeId: prev.id, toNodeId: node.id, direction: 'FORWARD', confidence: 0.95 } });
      }
    }
  }

  return NextResponse.redirect(new URL('/projects', req.url));
}
