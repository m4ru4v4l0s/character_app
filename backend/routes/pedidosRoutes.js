const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
router.use(requireAuth);

router.get("/pedidos", pedidosController.getPedidos);
router.post("/pedidos", pedidosController.createPedido);
router.put("/pedidos/:id", pedidosController.updatePedido);
router.delete("/pedidos/:id", requireAdmin, pedidosController.deletePedido);
router.post("/pedidos/search/:id", pedidosController.searchPedidoById);
router.post("/pedidos/searchByUser", pedidosController.searchPedidoByUser);

module.exports = router;
