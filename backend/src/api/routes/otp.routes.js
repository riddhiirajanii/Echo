const express = require("express");
const router = express.Router();

const { sendOTP, verifyEmailOTP } = require("../controllers/otp.controller"); 

router.post(
    "/send-otp",
    sendOTP
);

router.post(
    "/verify-otp",
    verifyEmailOTP
);

module.exports = router;