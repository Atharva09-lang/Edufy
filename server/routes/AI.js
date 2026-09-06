const express = require("express");
const router = express.Router();

const { chatWithAI } = require("../controllers/AI");

// Public endpoint for Ask AI / Course Advisor / AI Doubt Solver
router.post("/chat", chatWithAI);

module.exports = router;