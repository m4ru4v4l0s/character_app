const express = require("express");
const router = express.Router();
const characterController = require("../controllers/characterController");
const { requireAuth } = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");
router.use(requireAuth);

router.get("/", characterController.getAll);
router.get("/search", characterController.search);
router.get("/:id", characterController.getById);

//asmin
router.post("/", requireAdmin, characterController.create);
router.put("/:id", requireAdmin, characterController.update);
router.delete("/:id", requireAdmin, characterController.remove);

module.exports = router;