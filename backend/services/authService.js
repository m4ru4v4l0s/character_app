const pool = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(username, email, password, rol = "usuario") {
  const hash = await bcrypt.hash(password, 10);
  const [result] = await pool.query(
    "INSERT INTO users (username, email, password, rol) VALUES (?, ?, ?, ?)",
    [username, email, hash, rol]
  );
  const user = { id: result.insertId, username, email, rol };
  const token = jwt.sign(user, process.env.JWT_SECRET);
  return { user, token };
}

async function login(email, password) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (rows.length === 0) throw new Error("Usuario no encontrado");

  const user = rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Contraseña incorrecta");

  // ✅ Se agrega rol al token
  const userData = { id: user.id, username: user.username, email: user.email, rol: user.rol };
  const token = jwt.sign(userData, process.env.JWT_SECRET);
  return { user: userData, token };
}

module.exports = { register, login };