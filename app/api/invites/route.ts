import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ulid } from 'ulid';

export async function POST(req: Request) {
  const body = await req.json();
  const invite = await prisma.invite.create({
    data: {
      projectId: body.projectId,
      email: body.email,
      role: body.role,
      token: ulid(),
      invitedById: body.invitedById,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)
    }
  });
  return NextResponse.json(invite);
}
