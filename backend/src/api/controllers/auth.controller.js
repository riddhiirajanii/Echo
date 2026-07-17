const prisma = require("../../config/prisma");

const {
  registerUser,
  loginUser
} = require("../../services/auth/auth.service");
const { default: SendVerificationCode } = require("../middleware/Email");


const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    const user =
      await registerUser(
        name,
        email,
        password
      );

    SendVerificationCode(user.email, user.verificationCode);

    res.json({
      success: true,
      user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

const verifyEmail = async (req, res) => {

  try { 
    const {code} = req.body;
    const user = await prisma.user.findFirst({
      where: {
        verificationCode: code
      }
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code"
      });
    }

    if (user.isVerified) {
    return res.status(400).json({
        success:false,
        message:"Email already verified"
    });
}
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isVerified: true,
        verificationCode: null
      }
    });
    res.json({
      success: true,
      message: "Email verified successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const login = async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    const user =
      await loginUser(
        email,
        password
      );

    res.json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {

    res.status(400).json({
      success: false,
      message: error.message
    });

  }
};

module.exports = {
  register,
  login, 
  verifyEmail
};