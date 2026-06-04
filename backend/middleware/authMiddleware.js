const jwt = require("jsonwebtoken");

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ error: "Token requerido" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err)
      return res.status(403).json({ error: "Token inválido" });
    req.usuario = usuario;
    next();
  });
}

module.exports = { requireAuth };