import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth(); // ✅ isAdmin
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav style={{
      background: "var(--surface)",
      borderBottom: "1px solid var(--border)",
      padding: "0 32px",
      height: "60px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: "none" }}>
        <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "20px", color: "var(--accent)" }}>
          char.ai
        </span>
      </Link>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* ✅ Solo admin ve el botón de crear */}
          {isAdmin && (
            <Link to="/create">
              <button className="btn-ghost">+ Crear personaje</button>
            </Link>
          )}

          <Link to="/carrito">🛒 Carrito</Link>
          
          <span style={{ color: "var(--muted)", fontSize: "13px" }}>
            {user.username}
            {/* ✅ Badge visual para el admin */}
            {isAdmin && (
              <span style={{
                marginLeft: "6px", fontSize: "10px", padding: "2px 6px",
                borderRadius: "20px", background: "rgba(167,139,250,0.2)",
                color: "var(--accent)", fontWeight: 600
              }}>
                admin
              </span>
            )}
          </span>
          <button className="btn-ghost" onClick={handleLogout}>Salir</button>
        </div>
      )}
    </nav>
  );
}