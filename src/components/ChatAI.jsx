import { useEffect, useRef, useState } from "react";
import { FaPlus, FaRobot, FaUser } from "react-icons/fa";
import "../styles/ChatAI.scss";
import { canMakeRequest, incrementRequestCount } from "../utils/requestLimit";

export default function ChatAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Salut, je suis Bommert GPT." },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  async function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    if (!canMakeRequest()) {
      alert("Limite de 100 requêtes par jour atteinte.");
      return;
    }

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      //   const res = await fetch(
      //     `http://localhost:8080/api/${encodeURIComponent(trimmed)}`
      //   );

      const res = await fetch(
        `https://springaicode-production.up.railway.app/api/${encodeURIComponent(
          trimmed
        )}`
      );

      if (!res.ok) throw new Error("Erreur serveur");
      const text = await res.text();

      setMessages((prev) => [...prev, { sender: "ai", text }]);
      incrementRequestCount();
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Erreur de connexion au serveur." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function newConversation() {
    setMessages([
      { sender: "ai", text: "Salut, je suis GPT Vincent Bommert." },
    ]);
    setInput("");
  }

  return (
    <div className="chat-container">
      <aside className="chat-sidebar">
        <button className="new-conv-btn" onClick={newConversation}>
          <FaPlus /> Nouvelle conversation
        </button>
      </aside>

      <main className="chat-main">
        <h2 className="chat-title">BOMMERT GPT</h2>

        <div className="chat-window">
          {messages.map((m, i) => (
            <div key={i} className={`chat-message ${m.sender}`}>
              <span className="icon">
                {m.sender === "user" ? <FaUser /> : <FaRobot />}
              </span>
              <span className="text">{m.text}</span>
            </div>
          ))}

          {loading && (
            <div className="chat-message ai loading">
              <span className="icon">
                <FaRobot />
              </span>
              <span className="text">...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-input-area">
          <textarea
            rows={2}
            className="chat-input"
            placeholder="Tape ton message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button
            className="chat-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
          >
            Envoyer
          </button>
        </footer>
      </main>
    </div>
  );
}
