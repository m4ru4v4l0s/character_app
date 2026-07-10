const express = require("express");
const router = express.Router();
const carritoController = require("../controllers/carritoController");
const { requireAuth } = require("../middleware/authMiddleware");

// Todas las rutas del carrito requieren estar logueado
router.use(requireAuth);

router.get("/", carritoController.ver); // Ver carrito
router.post("/:characterId", carritoController.agregar); // Agregar personaje
router.delete("/:characterId", carritoController.eliminar); // Quitar personaje
router.post("/accion/confirmar", carritoController.confirmar); // Confirmar compra
router.put("/:characterId", carritoController.actualizarCantidad); // Actualizar cantidad

module.exports = router;
