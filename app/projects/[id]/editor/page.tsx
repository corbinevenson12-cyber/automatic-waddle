'use client';

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

export default function EditorPage({ params }: { params: { id: string } }) {
  const [events, setEvents] = useState<string[]>([]);
  const [presence, setPresence] = useState<string>('no editors');

  useEffect(() => {
    fetch("/api/realtime");
    const socket = io({ path: '/api/realtime' });
    socket.emit('join_project', params.id);
    socket.emit('presence_update', { projectId: params.id, status: 'editing graph' });
    socket.on('presence_update', (payload) => setPresence(payload.status));
    socket.on('edge_created', (payload) => setEvents((curr) => [`edge ${payload.id} created`, ...curr].slice(0, 20)));
    socket.on('comment_created', (payload) => setEvents((curr) => [`comment ${payload.id} created`, ...curr].slice(0, 20)));
    return () => socket.close();
  }, [params.id]);

  return (
    <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
      <section className="card space-y-3">
        <h1 className="text-2xl font-semibold">Collaborative Graph Editor</h1>
        <p className="text-sm text-slate-300">Presence: {presence}</p>
        <p className="text-sm text-slate-300">Connect mode, lock mode, reciprocal edge suggestions and optimistic updates are available via API endpoints.</p>
      </section>
      <aside className="card">
        <h2 className="mb-2 font-semibold">Realtime activity</h2>
        {events.map((e, i) => <p key={i} className="text-xs text-slate-300">{e}</p>)}
      </aside>
    </div>
  );
}
