require("dotenv").config();
const Groq = require("groq-sdk");
const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function chat(character, messages) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 1024,
    messages: [
      {
        role: "system",
        content: `Sos el personaje "${character.name}".
Descripción: ${character.description || "Sin descripción"}.
Personalidad: ${character.personality || "Respondé de forma amigable"}.
Respondé SIEMPRE en personaje, en español, nunca rompas el personaje.`
      },
      ...messages
    ]
  });

  return response.choices[0].message.content;
}

module.exports = { chat };