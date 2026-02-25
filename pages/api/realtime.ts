import type { NextApiRequest } from 'next';
import type { NextApiResponseServerIO } from '@/types/socket';
import { Server as ServerIO } from 'socket.io';

export const config = { api: { bodyParser: false } };

export default function handler(_: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    const io = new ServerIO(res.socket.server, { path: '/api/realtime' });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      socket.on('join_project', (projectId: string) => socket.join(`project:${projectId}`));
      socket.on('presence_update', (payload: { projectId: string; status: string }) => {
        socket.to(`project:${payload.projectId}`).emit('presence_update', payload);
      });
      socket.on('graph_event', (payload: { projectId: string; type: string; data: any }) => {
        socket.to(`project:${payload.projectId}`).emit(payload.type, payload.data);
      });
    });
  }
  res.end();
}
