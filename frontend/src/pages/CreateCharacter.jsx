import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createCharacter } from "../services/characterService";
import { useAuth } from "../context/AuthContext"; // ✅

export default function CreateCharacter() {
  const [form, setForm] = useState({
    name: "", description: "", personality: "", avatar_url: "", is_public: 1
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // ✅

  // ✅ Si no es admin, redirige al home
  useEffect(() => {
    if (isAdmin === false) navigate("/");
  }, [isAdmin]);

  const handleSubmit = async () => {
    setError("");
    try {
      await createCharacter(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error al crear");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Crear personaje</h1>
      <p style={{ color: "var(--muted)", marginBottom: "28px", fontSize: "14px" }}>
        Dale vida a un nuevo personaje
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input placeholder="Nombre *" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Descripción" rows={3} value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <textarea placeholder="Personalidad (instrucciones para el bot)" rows={4}
          value={form.personality}
          onChange={e => setForm({ ...form, personality: e.target.value })} />
        <input placeholder="URL de avatar (opcional)" value={form.avatar_url}
          onChange={e => setForm({ ...form, avatar_url: e.target.value })} />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input type="checkbox" id="pub" checked={form.is_public === 1}
            onChange={e => setForm({ ...form, is_public: e.target.checked ? 1 : 0 })}
            style={{ width: "auto" }} />
          <label htmlFor="pub" style={{ fontSize: "14px", color: "var(--muted)" }}>
            Personaje público (visible para todos)
          </label>
        </div>

        {error && <p className="error">{error}</p>}

        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-ghost" onClick={() => navigate("/")}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>Crear personaje</button>
        </div>
      </div>
    </div>
  );
}