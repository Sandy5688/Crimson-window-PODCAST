import React, { createContext, useState, useEffect, useContext } from 'react';
import io from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [feedUpdates, setFeedUpdates] = useState([]);

  useEffect(() => {
    const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';  // Env for prod
    let newSocket;

    try {
      newSocket = io(socketUrl);

      newSocket.on('connect', () => {
        console.log('Socket connected');
      });

      // Adjusted to match Repo A event: 'feedUpdated'
      newSocket.on('feedUpdated', (data) => {
        setFeedUpdates((prev) => [...prev, data]);
        console.log('Feed updated:', data);
      });

      // Additional listener for dashboard activity (if Repo A emits)
      newSocket.on('activityUpdated', (data) => {
        console.log('Activity updated:', data);
        // Trigger dashboard refresh if needed
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
      });

      setSocket(newSocket);
    } catch (error) {
      console.error('Socket init failed:', error);  // Graceful fail
    }

    return () => {
      if (newSocket) newSocket.close();  // Cleanup
    };
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
