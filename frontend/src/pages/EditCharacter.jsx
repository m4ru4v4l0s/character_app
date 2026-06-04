import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCharacter, updateCharacter } from "../services/characterService";
import { useAuth } from "../context/AuthContext"; // ✅

export default function EditCharacter() {
  const { id } = useParams();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAdmin } = useAuth(); // ✅

  // ✅ Si no es admin, redirige al home
  useEffect(() => {
    if (isAdmin === false) navigate("/");
  }, [isAdmin]);

  useEffect(() => {
    getCharacter(id).then(res => setForm(res.data)).catch(() => navigate("/"));
  }, [id]);

  const handleSubmit = async () => {
    setError("");
    try {
      await updateCharacter(id, form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error al actualizar");
    }
  };

  if (!form) return <p style={{ padding: "40px", color: "var(--muted)" }}>Cargando...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "40px 24px" }}>
      <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Editar personaje</h1>
      <p style={{ color: "var(--muted)", marginBottom: "28px", fontSize: "14px" }}>
        Actualizá la info de {form.name}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <input placeholder="Nombre *" value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })} />
        <textarea placeholder="Descripción" rows={3} value={form.description || ""}
          onChange={e => setForm({ ...form, description: e.target.value })} />
        <textarea placeholder="Personalidad" rows={4} value={form.personality || ""}
          onChange={e => setForm({ ...form, personality: e.target.value })} />
        <input placeholder="URL de avatar" value={form.avatar_url || ""}
          onChange={e => setForm({ ...form, avatar_url: e.target.value })} />

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input type="checkbox" id="pub" checked={form.is_public === 1}
            onChange={e => setForm({ ...form, is_public: e.target.checked ? 1 : 0 })}
            style={{ width: "auto" }} />
          <label htmlFor="pub" style={{ fontSize: "14px", color: "var(--muted)" }}>
            Personaje público
          </label>
        </div>

        {error && <p className="error">{error}</p>}
        <div style={{ display: "flex", gap: "12px" }}>
          <button className="btn-ghost" onClick={() => navigate("/")}>Cancelar</button>
          <button className="btn-primary" onClick={handleSubmit}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}