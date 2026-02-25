'use client';

import useSWR from 'swr';
import Link from 'next/link';

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export function ProjectGrid() {
  const { data, mutate } = useSWR('/api/projects', fetcher);

  async function createProject() {
    await fetch('/api/projects', {
      method: 'POST',
      body: JSON.stringify({ name: `Project ${new Date().toLocaleTimeString()}` })
    });
    mutate();
  }

  return (
    <section className="space-y-4">
      <button className="btn" onClick={createProject}>Create Project</button>
      <div className="grid gap-4 md:grid-cols-3">
        {(data?.items ?? []).map((project: any) => (
          <Link href={`/projects/${project.id}`} key={project.id} className="card block hover:border-blue-500">
            <h3 className="font-semibold">{project.name}</h3>
            <p className="mt-1 text-xs text-slate-400">{project._count.nodes} photos · {project._count.members} members</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
