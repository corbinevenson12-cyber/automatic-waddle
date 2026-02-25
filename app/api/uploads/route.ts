import { NextResponse } from 'next/server';
import exifr from 'exifr';
import { prisma } from '@/lib/prisma';
import { uploadPlaceholder } from '@/lib/storage';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const { checkRateLimit } = await import("@/lib/rateLimit");
  if (!checkRateLimit(ip, 20)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  const form = await req.formData();
  const projectId = String(form.get('projectId'));
  const files = form.getAll('files') as File[];
  if (files.length > 200) return NextResponse.json({ error: 'Batch limit exceeded' }, { status: 400 });

  const existingCount = await prisma.photoNode.count({ where: { projectId } });
  if (existingCount + files.length > 1500) return NextResponse.json({ error: 'Project limit exceeded' }, { status: 400 });

  const demoUser = await prisma.user.upsert({ where: { email: 'demo@photopath.local' }, update: {}, create: { email: 'demo@photopath.local' } });

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const metadata = await exifr.parse(buffer, { gps: true, tiff: true, exif: true }).catch(() => ({}));
    const uploaded = await uploadPlaceholder(file.name);
    await prisma.photoNode.create({
      data: {
        projectId,
        uploaderId: demoUser.id,
        imageUrl: uploaded.imageUrl,
        thumbnailUrl: uploaded.thumbnailUrl,
        mediumUrl: uploaded.mediumUrl,
        largeUrl: uploaded.largeUrl,
        timestamp: metadata?.DateTimeOriginal ?? null,
        gpsLat: metadata?.latitude ?? null,
        gpsLng: metadata?.longitude ?? null,
        orientation: metadata?.Orientation ?? null,
        notes: 'Imported from upload panel'
      }
    });
  }

  return NextResponse.json({ count: files.length });
}
