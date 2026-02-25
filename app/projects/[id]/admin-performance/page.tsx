'use client';

import { useEffect, useState } from 'react';

export default function AdminPerformancePage({ params }: { params: { id: string } }) {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    fetch(`/api/projects/${params.id}/snapshot`).then(() => setMs(performance.now() - start));
  }, [params.id]);

  return (
    <div className="card">
      <h1 className="text-2xl font-semibold">Admin Performance Test</h1>
      <p className="mt-2 text-sm text-slate-300">Snapshot render+fetch time: {ms ? `${ms.toFixed(2)} ms` : 'measuring...'}</p>
    </div>
  );
}
