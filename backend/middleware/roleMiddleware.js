function requireAdmin(req, res, next) {
  console.log(req.usuario?.rol);
  if (req.usuario?.rol === "Admin") {
    next();
  } else {
    res.status(403).json({ error: "Acceso denegado: se requiere rol admin" });
  }
}

module.exports = { requireAdmin };