const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail
} = require("../controllers/auth.controller");

router.post("/register", register);

router.post("/verifyemail", verifyEmail);

router.post("/login", login);

module.exports = router;