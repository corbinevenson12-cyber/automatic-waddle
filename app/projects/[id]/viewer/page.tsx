'use client';

import { useEffect, useMemo, useState } from 'react';

type Snapshot = { nodes: any[]; edges: any[] };

export default function ViewerPage({ params }: { params: { id: string } }) {
  const [snapshot, setSnapshot] = useState<Snapshot>({ nodes: [], edges: [] });
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [lowBandwidth, setLowBandwidth] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${params.id}/snapshot`).then((r) => r.json()).then((data) => {
      setSnapshot(data);
      setCurrentId(data.nodes[0]?.id ?? null);
    });
  }, [params.id]);

  const currentNode = useMemo(() => snapshot.nodes.find((n) => n.id === currentId), [snapshot.nodes, currentId]);
  const options = useMemo(() => {
    const from = snapshot.edges.filter((edge) => edge.fromNodeId === currentId);
    return Object.fromEntries(from.map((edge) => [edge.direction, edge.toNodeId]));
  }, [snapshot.edges, currentId]);

  useEffect(() => {
    const keyHandler = (e: KeyboardEvent) => {
      const map: Record<string, string> = { ArrowUp: 'FORWARD', w: 'FORWARD', ArrowDown: 'BACK', s: 'BACK', ArrowLeft: 'LEFT', a: 'LEFT', ArrowRight: 'RIGHT', d: 'RIGHT' };
      const dir = map[e.key];
      if (dir && options[dir]) setCurrentId(options[dir]);
    };
    window.addEventListener('keydown', keyHandler);
    return () => window.removeEventListener('keydown', keyHandler);
  }, [options]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Viewer</h1>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={lowBandwidth} onChange={(e) => setLowBandwidth(e.target.checked)} /> Low bandwidth mode</label>
      </div>
      <div className="card">
        {currentNode ? <img src={lowBandwidth ? currentNode.thumbnailUrl : currentNode.largeUrl || currentNode.imageUrl} className="h-[460px] w-full rounded object-cover" alt="current" /> : <p>No node selected</p>}
        <div className="mt-4 grid grid-cols-4 gap-2">
          {['FORWARD', 'BACK', 'LEFT', 'RIGHT'].map((dir) => <button key={dir} className="btn" onClick={() => options[dir] && setCurrentId(options[dir])}>{dir}</button>)}
        </div>
      </div>
      <div className="card">
        <h2 className="font-semibold">Mini-map (optimized SVG)</h2>
        <svg viewBox="0 0 400 120" className="mt-2 w-full">
          {snapshot.nodes.slice(0, 100).map((node, i) => <circle key={node.id} cx={5 + i * 4} cy={60} r={node.id === currentId ? 3 : 2} fill={node.id === currentId ? '#60a5fa' : '#334155'} />)}
        </svg>
      </div>
    </div>
  );
}
