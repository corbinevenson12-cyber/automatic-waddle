import { Server as IOServer } from 'socket.io';

let io: IOServer | null = null;

export function getIO() {
  return io;
}

export function attachIO(server: any) {
  if (io) return io;
  io = new IOServer(server, {
    path: '/api/realtime',
    cors: { origin: '*' }
  });

  io.on('connection', (socket) => {
    socket.on('join_project', (projectId: string) => {
      socket.join(`project:${projectId}`);
    });
  });

  return io;
}

export function emitProjectEvent(projectId: string, event: string, payload: unknown) {
  io?.to(`project:${projectId}`).emit(event, payload);
}
