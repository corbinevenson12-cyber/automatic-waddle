import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { issueSession } from '@/lib/auth';
import { ulid } from 'ulid';

export async function POST(req: Request) {
  const data = await req.formData();
  const email = String(data.get('email') || '').toLowerCase();
  if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });
  const user = await prisma.user.upsert({ where: { email }, update: {}, create: { email, name: email.split('@')[0] } });
  const token = ulid();
  console.log(`[magic-link] ${email} => /api/auth/magic-link?token=${token}&uid=${user.id}`);
  return NextResponse.redirect(new URL(`/login?sent=1`, req.url));
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('uid');
  if (!userId) return NextResponse.json({ error: 'Invalid link' }, { status: 400 });
  const session = issueSession(userId);
  const res = NextResponse.redirect(new URL('/projects', req.url));
  res.cookies.set('photopath_session', session, { httpOnly: true, secure: true, sameSite: 'lax', path: '/' });
  return res;
}
