import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCharacter, sendChatMessage } from "../services/characterService";

export default function Chat() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    getCharacter(id)
      .then(res => {
        setCharacter(res.data);
        setMessages([{
          role: "assistant",
          text: `¡Hola! Soy ${res.data.name}. ${res.data.description || "¿En qué te puedo ayudar?"}`
        }]);
      })
      .catch(() => navigate("/"));
  }, [id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", text: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const historyForAPI = newMessages
      .filter(m => m.role !== "system")
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text
      }));

    try {
      const res = await sendChatMessage(id, historyForAPI);
      setMessages(prev => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        text: "Ups, no pude responder ahora. Intentá de nuevo 🙏"
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (!character) return <p style={{ padding: "40px", color: "var(--muted)" }}>Cargando...</p>;

  return (
    <div style={{
      maxWidth: "720px", margin: "0 auto", padding: "24px",
      display: "flex", flexDirection: "column", height: "calc(100vh - 60px)"
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        marginBottom: "24px", paddingBottom: "20px",
        borderBottom: "1px solid var(--border)"
      }}>
        <button className="btn-ghost" onClick={() => navigate("/")}>← Volver</button>
        <div style={{
          width: 42, height: 42, borderRadius: "50%",
          background: "var(--surface2)", border: "2px solid var(--accent2)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px"
        }}>
          {character.avatar_url
            ? <img src={character.avatar_url} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
            : "🤖"}
        </div>
        <div>
          <h2 style={{ fontSize: "18px", fontWeight: 700 }}>{character.name}</h2>
          <p style={{ color: "var(--muted)", fontSize: "12px" }}>por @{character.creator}</p>
        </div>
      </div>

      {/* Mensajes */}
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "16px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
          }}>
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user" ? "var(--accent2)" : "var(--surface)",
              border: msg.role === "user" ? "none" : "1px solid var(--border)",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "12px 16px",
              fontSize: "14px",
              lineHeight: 1.6,
              color: "var(--text)"
            }}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "18px 18px 18px 4px", padding: "12px 20px",
              color: "var(--muted)", fontSize: "20px", letterSpacing: "4px"
            }}>
              •••
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        display: "flex", gap: "10px", marginTop: "20px",
        paddingTop: "16px", borderTop: "1px solid var(--border)"
      }}>
        <input
          placeholder={`Escribile a ${character.name}...`}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          style={{ flex: 1 }}
        />
        <button className="btn-primary" style={{ width: "auto", padding: "12px 20px" }}
          onClick={sendMessage} disabled={loading}>
          ➤
        </button>
      </div>
    </div>
  );
}