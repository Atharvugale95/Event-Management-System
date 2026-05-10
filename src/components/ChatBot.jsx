import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────
// CONFIGURATION — paste your n8n webhook URL here
// ─────────────────────────────────────────────────────────────
const N8N_WEBHOOK_URL = "https://atharvugale.app.n8n.cloud/webhook-test/sports-chatbot";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,600;1,600&display=swap');

  .chat-fab {
    position: fixed;
    bottom: 28px;
    right: 28px;
    z-index: 9999;
    width: 58px;
    height: 58px;
    border-radius: 50%;
    background: #1a1a1a;
    border: 2px solid #c8a97e;
    color: #c8a97e;
    font-size: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 24px rgba(0,0,0,0.25);
    transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .chat-fab:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    background: #222;
  }

  .chat-fab-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #c8a97e;
    color: #1a1a1a;
    font-size: 10px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    border: 2px solid #fff;
  }

  .chat-window {
    position: fixed;
    bottom: 100px;
    right: 28px;
    z-index: 9998;
    width: 370px;
    max-height: 560px;
    background: #fff;
    border: 1px solid #e8e4dd;
    border-radius: 20px;
    box-shadow: 0 16px 64px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'DM Sans', sans-serif;
    transform-origin: bottom right;
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s;
  }

  .chat-window.open  { transform: scale(1);    opacity: 1; pointer-events: all; }
  .chat-window.closed{ transform: scale(0.85); opacity: 0; pointer-events: none; }

  @media (max-width: 480px) {
    .chat-window {
      width: calc(100vw - 24px);
      right: 12px;
      bottom: 88px;
      max-height: 70vh;
    }
    .chat-fab { bottom: 16px; right: 16px; }
  }

  .chat-header {
    background: #1a1a1a;
    padding: 1rem 1.25rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-shrink: 0;
  }

  .chat-header-left { display: flex; align-items: center; gap: 0.75rem; }

  .chat-avatar {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #c8a97e, #b8956a);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .chat-header-name {
    font-family: 'Playfair Display', serif;
    font-size: 15px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
  }

  .chat-header-status {
    font-size: 11px;
    color: rgba(255,255,255,0.5);
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 1px;
  }

  .chat-status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4ade80;
    animation: chatPulse 2s infinite;
  }

  @keyframes chatPulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .chat-close-btn {
    width: 30px; height: 30px;
    border-radius: 50%;
    border: 1px solid rgba(255,255,255,0.15);
    background: transparent;
    color: rgba(255,255,255,0.6);
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: all 0.18s;
    line-height: 1;
  }
  .chat-close-btn:hover { border-color: #c8a97e; color: #c8a97e; }

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
    background: #f8f7f4;
    scroll-behavior: smooth;
  }
  .chat-messages::-webkit-scrollbar { width: 4px; }
  .chat-messages::-webkit-scrollbar-track { background: transparent; }
  .chat-messages::-webkit-scrollbar-thumb { background: #e0dbd2; border-radius: 99px; }

  .chat-suggestions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.25rem;
  }

  .chat-suggestion-btn {
    padding: 5px 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 12px;
    font-weight: 500;
    background: #fff;
    color: #1a1a1a;
    border: 1px solid #e0dbd2;
    border-radius: 20px;
    cursor: pointer;
    transition: all 0.18s;
    white-space: nowrap;
  }
  .chat-suggestion-btn:hover { background: #1a1a1a; color: #c8a97e; border-color: #1a1a1a; }
  .chat-suggestion-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .msg-row {
    display: flex;
    align-items: flex-end;
    gap: 0.5rem;
  }
  .msg-row.user { flex-direction: row-reverse; }

  .msg-icon {
    width: 28px; height: 28px;
    border-radius: 50%;
    background: #1a1a1a;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    flex-shrink: 0;
  }
  .msg-row.user .msg-icon { background: #c8a97e; }

  .msg-bubble {
    max-width: 78%;
    padding: 0.65rem 0.9rem;
    border-radius: 14px;
    font-size: 13.5px;
    line-height: 1.55;
    word-break: break-word;
  }
  .msg-row.bot .msg-bubble {
    background: #fff;
    color: #1a1a1a;
    border: 1px solid #e8e4dd;
    border-bottom-left-radius: 4px;
  }
  .msg-row.user .msg-bubble {
    background: #1a1a1a;
    color: #fff;
    border-bottom-right-radius: 4px;
  }

  .msg-time {
    font-size: 10.5px;
    color: #bbb;
    margin-top: 3px;
  }
  .msg-row.bot  .msg-time { text-align: left; }
  .msg-row.user .msg-time { text-align: right; }

  .typing-bubble {
    background: #fff;
    border: 1px solid #e8e4dd;
    border-radius: 14px;
    border-bottom-left-radius: 4px;
    padding: 0.65rem 1rem;
    display: flex;
    gap: 4px;
    align-items: center;
  }

  .typing-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #c8a97e;
    animation: typingBounce 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes typingBounce {
    0%,60%,100% { transform: translateY(0); opacity: 0.4; }
    30%          { transform: translateY(-5px); opacity: 1; }
  }

  .chat-input-area {
    padding: 0.9rem 1rem;
    border-top: 1px solid #e8e4dd;
    background: #fff;
    display: flex;
    gap: 0.6rem;
    align-items: flex-end;
    flex-shrink: 0;
  }

  .chat-input {
    flex: 1;
    font-family: 'DM Sans', sans-serif;
    font-size: 13.5px;
    color: #1a1a1a;
    border: 1px solid #e0dbd2;
    border-radius: 10px;
    padding: 9px 13px;
    resize: none;
    min-height: 40px;
    max-height: 100px;
    outline: none;
    transition: border-color 0.18s;
    line-height: 1.45;
    background: #f8f7f4;
  }
  .chat-input:focus { border-color: #c8a97e; background: #fff; }
  .chat-input::placeholder { color: #bbb; }

  .chat-send-btn {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: #1a1a1a;
    border: none;
    color: #c8a97e;
    font-size: 16px;
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.18s, transform 0.1s;
    flex-shrink: 0;
  }
  .chat-send-btn:hover  { background: #333; transform: scale(1.05); }
  .chat-send-btn:disabled { background: #e0dbd2; color: #bbb; cursor: not-allowed; transform: none; }

  .chat-footer-note {
    text-align: center;
    font-size: 10.5px;
    color: #ccc;
    padding: 0 1rem 0.6rem;
    background: #fff;
  }
`;

const SUGGESTIONS = [
  "What events are available?",
  "How do I register?",
  "What's the entry fee?",
  "Where are events held?",
  "Can I cancel my registration?",
];

const WELCOME_MESSAGE = {
  id: 1,
  role: "bot",
  text: "👋 Hi! I'm your Eventify's assistant.\n\nI can help you with event info, registration, fees, venues, and more. What would you like to know?",
  time: new Date(),
  showSuggestions: true,
};

function formatTime(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function ChatBot() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [unread, setUnread]     = useState(0);
  const messagesEndRef           = useRef(null);
  const inputRef                 = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: trimmed,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          timestamp: new Date().toISOString(),
          source: "sports-festival-chatbot",
        }),
      });

      if (!res.ok) throw new Error("Webhook error");

      const data = await res.json();

      const replyText =
        data.reply   ||
        data.message ||
        data.output  ||
        data.text    ||
        "I'm sorry, I couldn't get a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: replyText, time: new Date() },
      ]);

      if (!open) setUnread((n) => n + 1);

    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "⚠️ I'm having trouble connecting right now. Please try again in a moment.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* ── CHAT WINDOW ── */}
      <div className={`chat-window ${open ? "open" : "closed"}`}>

        <div className="chat-header">
          <div className="chat-header-left">
            <div className="chat-avatar">🏆</div>
            <div>
              <p className="chat-header-name">Festival Assistant</p>
              <p className="chat-header-status">
                <span className="chat-status-dot" />
                Online · Ready to help
              </p>
            </div>
          </div>
          <button className="chat-close-btn" onClick={() => setOpen(false)}>✕</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id}>
              <div className={`msg-row ${msg.role}`}>
                <div className="msg-icon">
                  {msg.role === "bot" ? "🏆" : "👤"}
                </div>
                <div>
                  <div className="msg-bubble">
                    {msg.text.split("\n").map((line, i, arr) => (
                      <span key={i}>
                        {line}
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </div>
                  <p className="msg-time">{formatTime(msg.time)}</p>
                </div>
              </div>

              {msg.showSuggestions && (
                <div className="chat-suggestions" style={{ marginLeft: "38px" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      className="chat-suggestion-btn"
                      onClick={() => sendMessage(s)}
                      disabled={loading}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="msg-row bot">
              <div className="msg-icon">🏆</div>
              <div className="typing-bubble">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <textarea
            ref={inputRef}
            className="chat-input"
            placeholder="Ask about events, registration, fees…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={() => sendMessage(input)}
            disabled={loading || !input.trim()}
            title="Send"
          >
            ➤
          </button>
        </div>

        <p className="chat-footer-note">Powered by n8n · Sports Festival 2026</p>
      </div>

      {/* ── FLOATING BUTTON ── */}
      <button
        className="chat-fab"
        onClick={() => setOpen((v) => !v)}
        title="Chat with us"
      >
        {open ? "✕" : "💬"}
        {!open && unread > 0 && (
          <span className="chat-fab-badge">{unread}</span>
        )}
      </button>
    </>
  );
}

export default ChatBot;