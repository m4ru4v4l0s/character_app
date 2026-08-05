import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { agregarAlCarrito } from "../services/carritoService";
import { deleteCharacter } from "../services/characterService";
import "./styles/card.css";

export default function CharacterCard({ character, onDeleted }) {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [cantidad, setCantidad] = useState(1);
  const [mensaje, setMensaje] = useState("");

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${character.name}?`)) return;
    try {
      await deleteCharacter(character.id_character);
      onDeleted(character.id_character);
    } catch {
      alert("Error al eliminar");
    }
  };

  async function handleAgregar() {
    try {
      await agregarAlCarrito(character.id_character, cantidad);
      setMensaje(`¡${cantidad} agregado${cantidad > 1 ? "s" : ""}!`);
      setCantidad(1);
      setTimeout(() => setMensaje(""), 2000);
    } catch (err) {
      setMensaje(err.message);
    }
  }

  return (
    <div
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        transition: "border-color 0.2s, transform 0.2s",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--surface2)",
            border: "2px solid var(--accent2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
          }}
        >
          {character.avatar_url ? (
            <img
              src={character.avatar_url}
              alt=""
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            "🤖"
          )}
        </div>
        <span
          style={{
            fontSize: "11px",
            padding: "3px 8px",
            borderRadius: "20px",
            background: character.is_public
              ? "rgba(167,139,250,0.15)"
              : "rgba(248,113,113,0.15)",
            color: character.is_public ? "var(--accent)" : "var(--danger)",
          }}
        >
          {character.is_public ? "Público" : "Privado"}
        </span>
      </div>

      <div>
        <h3 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "4px" }}>
          {character.name}
        </h3>
        <p style={{ color: "var(--muted)", fontSize: "13px", lineHeight: 1.5 }}>
          {character.description?.slice(0, 80) || "Sin descripción"}...
        </p>
      </div>

      <p className="character-price">
        ${Number(character.price).toLocaleString("es-AR")}
      </p>
      {mensaje && <span>{mensaje}</span>}
      <div className="carrito-actions">
        <div className="carrito-cantidad-selector">
          <button
            className="btn-cantidad"
            onClick={() => setCantidad(Math.max(1, cantidad - 1))}
          >
            −
          </button>
          <span className="cantidad-numero">{cantidad}</span>
          <button
            className="btn-cantidad"
            onClick={() => setCantidad(cantidad + 1)}
          >
            +
          </button>
        </div>
        <button className="btn-add-cart" onClick={handleAgregar}>
          🛒 Agregar
        </button>
      </div>

      <p style={{ color: "var(--muted)", fontSize: "12px" }}>
        por <span style={{ color: "var(--accent)" }}>@{character.creator}</span>
      </p>

      <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
        <button
          className="btn-primary"
          style={{ flex: 1 }}
          onClick={() => navigate(`/chat/${character.id_character}`)}
        >
          💬 Chatear
        </button>
        {isAdmin && (
          <>
            <button
              className="btn-ghost"
              onClick={() => navigate(`/edit/${character.id_character}`)}
            >
              ✏️
            </button>
            <button className="btn-danger" onClick={handleDelete}>
              🗑️
            </button>
          </>
        )}
      </div>
    </div>
  );
}
