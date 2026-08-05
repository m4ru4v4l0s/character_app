import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CharacterCard from "../components/CharacterCard";
import { useAuth } from "../context/AuthContext"; // ✅
import { getCharacters, searchCharacters } from "../services/characterService";

export default function Home() {
  const [characters, setCharacters] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth(); // ✅
  const navigate = useNavigate();

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      const res = await getCharacters();
      setCharacters(res.data);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim() === "") {
      loadCharacters();
    } else {
      const res = await searchCharacters(val);
      setCharacters(res.data);
    }
  };

  const handleDeleted = (id) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ marginBottom: "40px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "8px",
          }}
        >
          <h1 style={{ fontSize: "36px", fontWeight: 800 }}>
            Explorá personajes
          </h1>
          {/* Creo que este boton no es necesario
            {isAdmin && (
            <button className="btn-primary" onClick={() => navigate("/create")}>
              + Crear personaje
            </button>
          )}*/}
        </div>
        <p style={{ color: "var(--muted)", marginBottom: "24px" }}>
          Chateá con tus favoritos o creá los tuyos
        </p>
        <input
          placeholder="🔍 Buscar personajes..."
          value={query}
          onChange={handleSearch}
          style={{ maxWidth: "400px" }}
        />
      </div>

      {loading ? (
        <p style={{ color: "var(--muted)" }}>Cargando...</p>
      ) : characters.length === 0 ? (
        <p style={{ color: "var(--muted)" }}>No se encontraron personajes</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: "20px",
          }}
        >
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
