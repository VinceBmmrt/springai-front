import { useEffect, useRef, useState } from "react";
import "../styles/ChatAI.scss";

export default function ChatAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");

    try {
      const res = await fetch(
        `http://localhost:8080/api/${encodeURIComponent(trimmed)}`
      );
      if (!res.ok) throw new Error("Erreur serveur");
      const text = await res.text();

      setMessages((prev) => [...prev, { sender: "ai", text }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Erreur de connexion au serveur." },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="chat-container">
      <h2>Chat IA avec Spring</h2>

      <div className="chat-window">
        {messages.map((m, i) => (
          <div key={i} className={`chat-message ${m.sender}`}>
            {m.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tape ton message..."
        />
        <button onClick={sendMessage}>Envoyer</button>
      </div>
    </div>
  );
}
