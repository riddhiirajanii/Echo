const {
  registerUser,
  loginUser
} = require("../../services/auth/auth.service");

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
  login
};