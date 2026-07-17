const prisma = require("../../config/prisma");

const getProfile = async (userId) => {

  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      age: true,
      gender: true,
      profilePicture: true,
      createdAt: true
    }
  });

};

const updateProfile = async (userId, data) => {

  const {
    name,
    phone,
    age,
    gender,
    profilePicture
  } = data;

  return await prisma.user.update({

    where: {
      id: userId
    },

    data: {
      name,
      phone,
      age,
      gender,
      profilePicture
    }

  });

};

module.exports = {
  getProfile,
  updateProfile
};