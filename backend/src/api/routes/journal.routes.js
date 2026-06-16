const express = require("express");
const router = express.Router();

const {
  createJournal,
  fetchJournals,
  editJournal,
  removeJournal,
  fetchJournalById
} = require("../controllers/journal.controller");

const {
  authenticate
} = require("../middleware/auth.middleware");

router.post("/", authenticate, createJournal);

router.get("/", authenticate, fetchJournals);

router.put("/:id", authenticate, editJournal);

router.delete("/:id", authenticate, removeJournal);

router.get("/:id", authenticate, fetchJournalById);

module.exports = router;