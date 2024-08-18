// socket-context.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { initiateSocketConnection, getSocket } from "./socket";
import { useSelector } from "react-redux";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const userData = useSelector((state) => state.auth.userData);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const fetchUserIdAndConnectSocket = async () => {
      const res = userData;  // Fetch user ID here
      if(!userData) return;
      const userId = res.id;

      initiateSocketConnection(userId);
      setSocket(getSocket());

    };

    fetchUserIdAndConnectSocket();
    return () => {
      if (socket) socket.disconnect();
    };
  }, [userData]);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};
