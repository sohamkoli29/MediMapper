// client/src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user, token } = useAuth();

  useEffect(() => {
    if (user && token) {
      console.log('Connecting to socket server...');
      
      // Connect to socket server
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      });

      setSocket(newSocket);

      // Handle connection events
      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        setIsConnected(true);
        
        // Notify server that user is online
        if (user.id) {
          newSocket.emit('user_online', user.id);
        }
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Cleanup on unmount
      return () => {
        console.log('Cleaning up socket connection');
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // If no user, close existing socket
      if (socket) {
        console.log('No user, closing socket');
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [user, token]);

  const value = {
    socket,
    isConnected
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};