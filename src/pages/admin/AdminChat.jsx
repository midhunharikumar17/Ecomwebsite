import { useState, useEffect, useRef } from "react";
import { useSocket } from "../../context/SocketContext";
import "./AdminChat.css";

const AdminChat = () => {
  const { socket } = useSocket() || {};
  const [conversations, setConversations] = useState({});
  const [activeUser, setActiveUser] = useState(null);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
    // Join as admin
    socket.emit("admin:join");

    socket.on("chat:user_message", (data) => {
      const { userId, userName, message, timestamp } = data;
      setConversations((prev) => ({
        ...prev,
        [userId]: {
          userName,
          unread: activeUser !== userId ? (prev[userId]?.unread || 0) + 1 : 0,
          messages: [
            ...(prev[userId]?.messages || []),
            { role: "user", text: message, time: new Date(timestamp) },
          ],
        },
      }));
      if (!activeUser) setActiveUser(userId);
    });

    return () => { socket.off("chat:user_message"); };
  }, [socket, activeUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeUser]);

  const sendReply = () => {
    if (!reply.trim() || !activeUser || !socket) return;
    socket.emit("chat:admin_reply", { userId: activeUser, message: reply.trim() });
    setConversations((prev) => ({
      ...prev,
      [activeUser]: {
        ...prev[activeUser],
        messages: [...(prev[activeUser]?.messages || []),
          { role: "admin", text: reply.trim(), time: new Date() }],
      },
    }));
    setReply("");
  };

  const selectUser = (userId) => {
    setActiveUser(userId);
    setConversations((prev) => ({
      ...prev,
      [userId]: { ...prev[userId], unread: 0 },
    }));
  };

  const userList = Object.entries(conversations);
  const activeConvo = activeUser ? conversations[activeUser] : null;
  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div className="admin-chat">
      {/* Sidebar */}
      <div className="admin-chat__sidebar">
        <div className="admin-chat__sidebar-header">
          <h3>Live Support</h3>
          <span className="admin-chat__count">{userList.length} chats</span>
        </div>
        {userList.length === 0 ? (
          <div className="admin-chat__empty-sidebar">
            <p>💬</p>
            <p>No active chats</p>
          </div>
        ) : (
          userList.map(([userId, convo]) => (
            <div
              key={userId}
              className={`admin-chat__user ${activeUser === userId ? "admin-chat__user--active" : ""}`}
              onClick={() => selectUser(userId)}
            >
              <div className="admin-chat__user-avatar">{convo.userName?.charAt(0).toUpperCase()}</div>
              <div className="admin-chat__user-info">
                <p className="admin-chat__user-name">{convo.userName}</p>
                <p className="admin-chat__user-preview">
                  {convo.messages?.[convo.messages.length - 1]?.text?.slice(0, 28)}...
                </p>
              </div>
              {convo.unread > 0 && <span className="admin-chat__unread">{convo.unread}</span>}
            </div>
          ))
        )}
      </div>

      {/* Chat Area */}
      <div className="admin-chat__main">
        {!activeConvo ? (
          <div className="admin-chat__placeholder">
            <span>💬</span>
            <p>Select a conversation to start replying</p>
          </div>
        ) : (
          <>
            <div className="admin-chat__main-header">
              <div className="admin-chat__main-avatar">{activeConvo.userName?.charAt(0).toUpperCase()}</div>
              <div>
                <p className="admin-chat__main-name">{activeConvo.userName}</p>
                <p className="admin-chat__main-sub">Customer</p>
              </div>
            </div>

            <div className="admin-chat__messages">
              {activeConvo.messages?.map((msg, i) => (
                <div key={i} className={`admin-chat__msg admin-chat__msg--${msg.role}`}>
                  <div className="admin-chat__msg-bubble">{msg.text}</div>
                  <span className="admin-chat__msg-time">{formatTime(msg.time)}</span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="admin-chat__input-row">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendReply(); }}
                placeholder={`Reply to ${activeConvo.userName}...`}
                className="admin-chat__input"
              />
              <button onClick={sendReply} disabled={!reply.trim()} className="admin-chat__send">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminChat;