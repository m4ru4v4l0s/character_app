const chatService = require("../services/chatService");
const characterService = require("../services/characterService");
const carritoService = require("../services/carritoService");

const pool = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(username, email, password, rol = "usuario") {
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, rol) VALUES (?, ?, ?, ?)",
    [username, email, hash, rol],
  );
  const user = { id: result.insertId, username, email, rol };
  const token = jwt.sign(user, process.env.JWT_SECRET);
  return { user, token };
}

async function login(email, password) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  if (rows.length === 0) throw new Error("Usuario no encontrado");

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Contraseña incorrecta");

  // ✅ Se agrega rol al token
  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
    rol: user.rol,
  };
  const token = jwt.sign(userData, process.env.JWT_SECRET);
  return { user: userData, token };
}

// POST /api/chat/:id
async function sendMessage(req, res) {
  const { messages } = req.body;
  const { id } = req.params;

  console.log("📩 Mensaje recibido para personaje:", id);
  console.log("💬 Historial:", messages);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mensajes inválidos" });
  }

  try {
    const userId = req.usuario.id; // Unificado con el resto de controllers

    const character = await characterService.getById(id, userId);
    console.log("🎭 Personaje encontrado:", character);

    if (!character)
      return res.status(404).json({ error: "Personaje no encontrado" });

    // Verificar que el usuario tiene acceso: es el creador o lo compró
    const acceso = await carritoService.tieneAcceso(userId, id);
    if (!acceso) {
      return res.status(403).json({
        error: "No tenés acceso a este personaje. ¡Compralo primero!",
      });
    }

    const reply = await chatService.chat(character, messages);
    console.log("✅ Respuesta generada:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}

module.exports = { register, login, sendMessage };
