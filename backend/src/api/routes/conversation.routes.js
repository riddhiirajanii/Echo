const express = require("express");

const router = express.Router();

const { authenticate } =
require("../middleware/auth.middleware");

const {

  createConversationController,

  getConversationsController,

  getConversationController,

  renameConversationController,

  deleteConversationController

} = require("../controllers/conversation.controller");

router.post(
  "/",
  authenticate,
  createConversationController
);

router.get(
  "/",
  authenticate,
  getConversationsController
);

router.get(
  "/:id",
  authenticate,
  getConversationController
);

router.put(
  "/:id",
  authenticate,
  renameConversationController
);

router.delete(
  "/:id",
  authenticate,
  deleteConversationController
);

module.exports = router;