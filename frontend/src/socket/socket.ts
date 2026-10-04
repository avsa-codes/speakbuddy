import { io } from 'socket.io-client';
import { API_URL } from '../config/api';

export const socket = io(`${API_URL}`, {
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