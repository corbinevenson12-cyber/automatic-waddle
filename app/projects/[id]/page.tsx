import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { UploadPanel } from '@/components/UploadPanel';
import { VirtualNodeList } from '@/components/VirtualNodeList';

export default async function ProjectDashboard({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { nodes: { orderBy: { createdAt: 'desc' }, take: 1000 }, _count: { select: { nodes: true } } }
  });
  if (!project) return <p>Project not found</p>;

  const areaCounts = project.nodes.reduce<Record<string, number>>((acc, node) => {
    const key = node.areaTag ?? 'unassigned';
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <h1 className="text-2xl font-semibold">{project.name}</h1>
        <Link className="btn" href={`/projects/${project.id}/viewer`}>Open Viewer</Link>
        <Link className="btn" href={`/projects/${project.id}/editor`}>Open Graph Editor</Link>
      </div>
      <div className="grid gap-6 md:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <UploadPanel projectId={project.id} />
          <div className="card">
            <h2 className="mb-3 font-semibold">Timeline (virtualized)</h2>
            <VirtualNodeList nodes={project.nodes} />
          </div>
        </div>
        <aside className="space-y-4">
          <div className="card">
            <h2 className="mb-3 font-semibold">Areas</h2>
            {Object.entries(areaCounts).map(([area, count]) => <p key={area} className="text-sm">{area}: {count}</p>)}
          </div>
          <div className="card">
            <h2 className="mb-3 font-semibold">Health Check</h2>
            <p className="text-sm text-slate-300">Use /api/health-check?projectId={project.id} for cycles/dead ends/isolated nodes.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
