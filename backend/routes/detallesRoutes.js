const express = require("express");
const router = express.Router();
const detallesController = require("../controllers/detallesController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
router.use(requireAuth);

router.get("/detalles", detallesController.getDetalles);
router.post("/detalles", detallesController.createDetalle);
router.put("/detalles/:id", detallesController.updateDetalle);
router.delete("/detalles/:id", requireAdmin, detallesController.deleteDetalle);
router.post("/detalles/search/:id", detallesController.searchDetalleById);
router.post(
  "/detalles/searchByPedido",
  detallesController.searchDetalleByPedido,
);

module.exports = router;
