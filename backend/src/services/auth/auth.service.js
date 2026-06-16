const prisma = require("../../config/prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (
  name,
  email,
  password
) => {

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email
      }
    });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword =
    await bcrypt.hash(password, 10);

  const user =
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    });

  const { password: _, ...safeUser } = user;

   return safeUser;
};

const loginUser = async (email, password) => {

  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  
  const token = jwt.sign(
    { userId: user.id,
      email: user.email
     },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const { password: _, ...safeUser } = user;

  return {
    user: safeUser,
    token
  };
};

module.exports = {
  registerUser,
  loginUser
};