function requireAdmin(req, res, next) {
  if (req.usuario?.rol === "admin") {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado: se requiere rol admin" });
  }
}

module.exports = { requireAdmin };