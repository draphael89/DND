import { Server } from 'socket.io';
import type { NextApiResponseServerIO } from '@/types/next';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const res = NextResponse.next() as unknown as NextApiResponseServerIO;

  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new Server(res.socket.server as any);
    res.socket.server.io = io;

    io.on('connection', socket => {
      socket.on('generate-start', data => {
        // Emit progress updates
        socket.emit('generate-progress', { progress: 0 });
        // Simulate progress (replace with actual progress tracking)
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          socket.emit('generate-progress', { progress });
          if (progress >= 100) {
            clearInterval(interval);
          }
        }, 500);
      });
    });
  }

  return new Response('Socket initialized', { status: 200 });
}