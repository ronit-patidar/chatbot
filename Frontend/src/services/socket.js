import { io } from 'socket.io-client';
import { API_BASE_URL } from '../api/api';

let socket = null;

export const getSocket = () => {
  if (!socket) {
    const token = localStorage.getItem('token');
    socket = io(API_BASE_URL, {
      withCredentials: true,
      auth: {
        token: token || '',
      },
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const currentSocket = getSocket();
  const token = localStorage.getItem('token');
  if (token) {
    currentSocket.auth = { token };
  }
  if (!currentSocket.connected) {
    currentSocket.connect();
  }
  return currentSocket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
