import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, token } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [orderUpdates, setOrderUpdates] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);

  useEffect(() => {
    if (!user || !token) return;
    const socket = io(
      import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:5000",
      { transports: ["websocket"] }
    );
    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      socket.emit("user:join", user._id || user.id);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("order:status_update", (data) => setOrderUpdates((prev) => [...prev, data]));
    socket.on("chat:admin_reply", (data) => setAdminMessages((prev) => [...prev, { ...data, role: "admin" }]));
    return () => socket.disconnect();
  }, [user, token]);

  const sendLiveChatMessage = (message) => {
    if (socketRef.current && user) {
      socketRef.current.emit("chat:user_message", {
        userId: user._id || user.id,
        userName: user.name,
        message,
      });
    }
  };

  return (
    <SocketContext.Provider value={{
      socket: socketRef.current, connected, orderUpdates,
      adminMessages, sendLiveChatMessage,
      clearAdminMessages: () => setAdminMessages([]),
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);