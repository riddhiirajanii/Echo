const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const {
  createAssessment,
  getAssessments,
  fetchAssessmentById,
  removeAssessment,
  editAssessment
} = require("../controllers/assessment.controller");

router.post("/", authenticate, createAssessment);

router.get("/", authenticate, getAssessments);

router.get("/:id", authenticate, fetchAssessmentById);

router.delete("/:id", authenticate, removeAssessment);

router.put("/:id", authenticate, editAssessment);

module.exports = router;