const express = require("express");
const router = express.Router();

const {
  getInsights
} = require("../controllers/insights.controller");

const { authenticate } = require("../middleware/auth.middleware");

router.get("/", authenticate, getInsights);

module.exports = router;