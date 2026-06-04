const authService = require("../services/authService");

async function register(req, res) {
  const { username, email, password, rol } = req.body; 
  if (!username || !email || !password)
    return res.status(400).json({ error: "Todos los campos son obligatorios" });

  try {
    const { user, token } = await authService.register(username, email, password, rol);
    res.status(201).json({ message: "Registro exitoso", user, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email y contraseña requeridos" });

  try {
    const { user, token } = await authService.login(email, password);
    res.json({ message: "Login exitoso", user, token });
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
}

async function logout(req, res) {
  res.json({ message: "Sesión cerrada" });
}

async function me(req, res) {
  res.json({ user: req.usuario });
}

module.exports = { register, login, logout, me };