import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/authService";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 60px)", display: "flex",
      alignItems: "center", justifyContent: "center", padding: "24px"
    }}>
      <div style={{
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: "20px", padding: "40px", width: "100%", maxWidth: "400px"
      }}>
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Bienvenido 👋</h1>
        <p style={{ color: "var(--muted)", marginBottom: "28px", fontSize: "14px" }}>
          Iniciá sesión para chatear con tus personajes
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <input placeholder="Email" type="email"
            value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Contraseña" type="password"
            value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <p className="error">{error}</p>}
          <button className="btn-primary" onClick={handleSubmit}>Iniciar sesión</button>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px", fontSize: "13px", color: "var(--muted)" }}>
          ¿No tenés cuenta?{" "}
          <Link to="/register" style={{ color: "var(--accent)", textDecoration: "none" }}>
            Registrate
          </Link>
        </p>
      </div>
    </div>
  );
}