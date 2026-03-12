import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { GameState, initialState } from '../types/game';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL);

    socketInstance.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WebSocket');
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    });

    socketInstance.on('syncState', (state: GameState) => {
      setGameState(state);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const updateState = (updates: Partial<GameState>) => {
    if (socket) {
      socket.emit('updateState', updates);
    }
  };

  const resetState = () => {
    if (socket) {
      socket.emit('resetState');
    }
  };

  return { socket, gameState, isConnected, updateState, resetState };
};
