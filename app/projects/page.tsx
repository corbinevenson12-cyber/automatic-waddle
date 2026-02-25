import { ProjectGrid } from '@/components/ProjectGrid';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <ProjectGrid />
      <form action="/api/seed-demo" method="post">
        <button className="btn">Seed Demo Project</button>
      </form>
    </div>
  );
}
