const chatService = require("../services/chatService");
const characterService = require("../services/characterService");
const carritoService = require("../services/carritoService");

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

    if (!character) return res.status(404).json({ error: "Personaje no encontrado" });

    // Verificar que el usuario tiene acceso: es el creador o lo compró
    const acceso = await carritoService.tieneAcceso(userId, id);
    if (!acceso) {
      return res.status(403).json({ error: "No tenés acceso a este personaje. ¡Compralo primero!" });
    }

    const reply = await chatService.chat(character, messages);
    console.log("✅ Respuesta generada:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}

module.exports = { sendMessage };