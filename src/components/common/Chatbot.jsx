import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance from "../../services/axiosInstance";
import { useSocket } from "../../context/SocketContext";
import "./Chatbot.css";

const QUICK_REPLIES = [
  "Track my order 📦",
  "Show me deals 🔥",
  "Headphones under ₹3000",
  "Shipping info 🚚",
  "Return policy ↩️",
];

const TABS = ["🤖 AI Assistant", "💬 Live Support"];

const MessageText = ({ text }) => {
  const lines = text.split("\n");
  return (
    <div className="chatbot__msg-text">
      {lines.map((line, i) => {
        if (!line.trim()) return <br key={i} />;
        const parts = line.split(/\*\*(.*?)\*\*/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
          </p>
        );
      })}
    </div>
  );
};

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="chatbot__product-card">
    {product.image && <img src={product.image} alt={product.name} className="chatbot__product-img" />}
    <div className="chatbot__product-info">
      <p className="chatbot__product-name">{product.name}</p>
      <div className="chatbot__product-price">
        <span className="chatbot__product-final">₹{product.finalPrice || product.price}</span>
        {product.discount > 0 && (
          <>
            <span className="chatbot__product-original">₹{product.price}</span>
            <span className="chatbot__product-badge">{product.discount}% off</span>
          </>
        )}
      </div>
      <p className="chatbot__product-stock">{product.stock > 0 ? "✅ In stock" : "❌ Out of stock"}</p>
    </div>
  </Link>
);

const Chatbot = () => {
  const { user } = useSelector((state) => state.auth);
  const { connected, adminMessages, sendLiveChatMessage, clearAdminMessages } = useSocket() || {};

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [aiMessages, setAiMessages] = useState([
    { id: 1, role: "bot", text: `👋 Hi ${user?.name?.split(" ")[0] || "there"}! I'm **ShopBot**, your AI shopping assistant!\n\nI can help you:\n- 🔍 Find products by name, category or budget\n- 📦 Track your orders\n- 💰 Show best deals\n- 🚚 Answer shipping & return questions`, products: [], time: new Date() },
  ]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiHistory, setAiHistory] = useState([]);
  const [liveMessages, setLiveMessages] = useState([
    { id: 1, role: "system", text: "👋 Welcome to Live Support! Send a message and our team will respond shortly.", time: new Date() },
  ]);
  const [liveInput, setLiveInput] = useState("");
  const [hasNewLive, setHasNewLive] = useState(false);

  const aiEndRef = useRef(null);
  const liveEndRef = useRef(null);
  const aiInputRef = useRef(null);

  useEffect(() => { aiEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [aiMessages, aiLoading]);
  useEffect(() => { liveEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [liveMessages]);
  useEffect(() => {
    if (isOpen && activeTab === 0) setTimeout(() => aiInputRef.current?.focus(), 300);
  }, [isOpen, activeTab]);

  useEffect(() => {
    if (!adminMessages?.length) return;
    const latest = adminMessages[adminMessages.length - 1];
    setLiveMessages((prev) => [...prev, { id: Date.now(), role: "admin", text: latest.message, time: new Date(latest.timestamp) }]);
    if (!isOpen || activeTab !== 1) setHasNewLive(true);
    clearAdminMessages?.();
  }, [adminMessages]);

  const sendAiMessage = async (text) => {
    const msg = text || aiInput.trim();
    if (!msg || aiLoading) return;
    setAiMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg, products: [], time: new Date() }]);
    setAiInput("");
    setAiLoading(true);
    const newHistory = [...aiHistory, { role: "user", text: msg }];
    try {
      const { data } = await axiosInstance.post("/chat", { message: msg, history: newHistory });
      setAiMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: data.reply, products: data.products || [], time: new Date() }]);
      setAiHistory([...newHistory, { role: "bot", text: data.reply }]);
    } catch {
      setAiMessages((prev) => [...prev, { id: Date.now() + 1, role: "bot", text: "Sorry, I'm having trouble connecting. Please try again! 🙏", products: [], time: new Date() }]);
    } finally {
      setAiLoading(false);
    }
  };

  const sendLiveMessage = () => {
    const msg = liveInput.trim();
    if (!msg) return;
    setLiveMessages((prev) => [...prev, { id: Date.now(), role: "user", text: msg, time: new Date() }]);
    sendLiveChatMessage?.(msg);
    setLiveInput("");
  };

  const handleKeyDown = (e, fn) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); fn(); } };
  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      <div className={`chatbot ${isOpen ? "chatbot--open" : ""}`}>
        {/* Header */}
        <div className="chatbot__header">
          <div className="chatbot__header-left">
            <div className="chatbot__header-avatar">🤖</div>
            <div>
              <p className="chatbot__header-name">ShopBot</p>
              <p className="chatbot__header-status">
                <span className={`chatbot__dot ${connected ? "chatbot__dot--online" : "chatbot__dot--offline"}`} />
                {connected ? "Online" : "Connecting..."}
              </p>
            </div>
          </div>
          <button className="chatbot__close-btn" onClick={() => setIsOpen(false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="chatbot__tabs">
          {TABS.map((tab, i) => (
            <button key={i} className={`chatbot__tab ${activeTab === i ? "chatbot__tab--active" : ""}`}
              onClick={() => { setActiveTab(i); if (i === 1) setHasNewLive(false); }}>
              {tab}
              {i === 1 && hasNewLive && <span className="chatbot__tab-badge" />}
            </button>
          ))}
        </div>

        {/* AI Panel */}
        {activeTab === 0 && (
          <>
            <div className="chatbot__messages">
              {aiMessages.map((msg) => (
                <div key={msg.id} className={`chatbot__msg chatbot__msg--${msg.role}`}>
                  {msg.role === "bot" && <div className="chatbot__msg-icon">🤖</div>}
                  <div className="chatbot__msg-wrap">
                    <div className="chatbot__bubble"><MessageText text={msg.text} /></div>
                    {msg.products?.length > 0 && (
                      <div className="chatbot__products">
                        {msg.products.map((p) => <ProductCard key={p.id} product={p} />)}
                      </div>
                    )}
                    <span className="chatbot__time">{formatTime(msg.time)}</span>
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div className="chatbot__msg chatbot__msg--bot">
                  <div className="chatbot__msg-icon">🤖</div>
                  <div className="chatbot__bubble chatbot__bubble--typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={aiEndRef} />
            </div>
            <div className="chatbot__quick">
              {QUICK_REPLIES.map((q) => (
                <button key={q} className="chatbot__quick-btn" onClick={() => sendAiMessage(q)} disabled={aiLoading}>{q}</button>
              ))}
            </div>
            <div className="chatbot__input-row">
              <input ref={aiInputRef} value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, () => sendAiMessage())}
                placeholder="Ask me anything..." className="chatbot__input" disabled={aiLoading} maxLength={300} />
              <button onClick={() => sendAiMessage()} disabled={aiLoading || !aiInput.trim()} className="chatbot__send-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </>
        )}

        {/* Live Chat Panel */}
        {activeTab === 1 && (
          <>
            <div className="chatbot__messages">
              {liveMessages.map((msg) => (
                <div key={msg.id} className={`chatbot__msg chatbot__msg--${msg.role === "system" ? "bot" : msg.role}`}>
                  {(msg.role === "admin" || msg.role === "system") && <div className="chatbot__msg-icon">👨‍💼</div>}
                  <div className="chatbot__msg-wrap">
                    {msg.role === "admin" && <p className="chatbot__msg-label">Support Agent</p>}
                    <div className={`chatbot__bubble ${msg.role === "system" ? "chatbot__bubble--system" : ""}`}>
                      <MessageText text={msg.text} />
                    </div>
                    <span className="chatbot__time">{formatTime(msg.time)}</span>
                  </div>
                </div>
              ))}
              <div ref={liveEndRef} />
            </div>
            <div className="chatbot__input-row">
              <input value={liveInput} onChange={(e) => setLiveInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, sendLiveMessage)}
                placeholder="Message support team..." className="chatbot__input" maxLength={300} />
              <button onClick={sendLiveMessage} disabled={!liveInput.trim()} className="chatbot__send-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </>
        )}
      </div>

      {/* FAB */}
      <button className={`chatbot__fab ${isOpen ? "chatbot__fab--open" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        )}
        {!isOpen && hasNewLive && <span className="chatbot__fab-badge" />}
      </button>
    </>
  );
};

export default Chatbot;