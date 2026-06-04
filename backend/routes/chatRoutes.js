const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const { requireAuth } = require("../middleware/authMiddleware");

router.post("/:id/message", requireAuth, chatController.sendMessage);

module.exports = router;