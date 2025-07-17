import { Server as SocketIOServer } from 'socket.io';
import { logger } from './logger';

export const initSocketHandlers = (io: SocketIOServer): void => {
  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Handle user joining a room (e.g., live stream)
    socket.on('join-room', (roomId: string) => {
      socket.join(roomId);
      logger.info(`Socket ${socket.id} joined room ${roomId}`);
    });

    // Handle user leaving a room
    socket.on('leave-room', (roomId: string) => {
      socket.leave(roomId);
      logger.info(`Socket ${socket.id} left room ${roomId}`);
    });

    // Handle live stream chat messages
    socket.on('chat-message', (data: { roomId: string; message: string; userId: string }) => {
      io.to(data.roomId).emit('chat-message', {
        ...data,
        timestamp: new Date()
      });
    });

    // Handle live stream viewer count updates
    socket.on('viewer-join', (roomId: string) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const viewerCount = room ? room.size : 0;
      io.to(roomId).emit('viewer-count-update', viewerCount);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
    });
  });

  logger.info('Socket.IO handlers initialized');
};