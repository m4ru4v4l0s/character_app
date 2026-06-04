const chatService = require("../services/chatService");
const characterService = require("../services/characterService");

async function sendMessage(req, res) {
  const { messages } = req.body;
  const { id } = req.params;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mensajes inválidos" });
  }

  try {
    const character = await characterService.getById(id, req.session.user.id);
    if (!character) return res.status(404).json({ error: "Personaje no encontrado" });

    const reply = await chatService.chat(character, messages);
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}

async function sendMessage(req, res) {
  const { messages } = req.body;
  const { id } = req.params;

  console.log("📩 Mensaje recibido para personaje:", id);
  console.log("💬 Historial:", messages);

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Mensajes inválidos" });
  }

  try {
    const character = await characterService.getById(id, req.session.user.id);
    console.log("🎭 Personaje encontrado:", character);

    if (!character) return res.status(404).json({ error: "Personaje no encontrado" });

    const reply = await chatService.chat(character, messages);
    console.log("✅ Respuesta de Groq:", reply);

    res.json({ reply });
  } catch (err) {
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: "Error al generar respuesta" });
  }
}
module.exports = { sendMessage };