const express = require("express");

const router = express.Router();

const {
  fetchProfile,
  editProfile
} = require("../controllers/profile.controller");

const { authenticate } =
  require("../middleware/auth.middleware");

router.get(
  "/",
  authenticate,
  fetchProfile
);

router.put(
  "/",
  authenticate,
  editProfile
);

module.exports = router;