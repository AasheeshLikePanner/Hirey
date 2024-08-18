// socket.js
import { io } from "socket.io-client";

let socket;

export const initiateSocketConnection = (userId) => {
  socket = io('ws://localhost:3000', {
    query: { userId },
  });

  socket.on('connect', () => {
    console.log('Connected to server with userId:', userId);
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from server');
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
};
