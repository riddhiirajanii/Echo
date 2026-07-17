const {
  getProfile,
  updateProfile
} = require("../../services/profile/profile.service");

const fetchProfile = async (req, res) => {

  try {

    const profile =
      await getProfile(req.user.userId);

    res.json({
      success: true,
      profile
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch profile."
    });

  }

};

const editProfile = async (req, res) => {

  try {

    const profile =
      await updateProfile(
        req.user.userId,
        req.body
      );

    res.json({
      success: true,
      profile
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Unable to update profile."
    });

  }

};

module.exports = {
  fetchProfile,
  editProfile
};