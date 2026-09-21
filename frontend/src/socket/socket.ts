import { io } from 'socket.io-client';

export const socket = io('http://localhost:5000', {
  withCredentials: true,
  autoConnect: false,
});

socket.on('connect', () => {
  console.log('Frontend socket connected:', socket.id);
});

socket.on('disconnect', () => {
  console.log('Frontend socket disconnected');
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error.message);
});

socket.on('socket:ready', (data) => {
  console.log('Socket ready:', data.message);
});