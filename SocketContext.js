import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [feedUpdates, setFeedUpdates] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:5000'); // Backend Socket.io URL

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('feedUpdated', (data) => {
      setFeedUpdates((prev) => [...prev, data]);
      console.log('Feed updated:', data);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const value = {
    socket,
    feedUpdates,
    setFeedUpdates,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};
