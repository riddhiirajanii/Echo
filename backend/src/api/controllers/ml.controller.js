const {
  getUserFeatures,
  getTrainingData
} = require("../../services/ml/feature.service");


const getMLFeatures = async (req, res) => {

  try {

    const features =
      await getUserFeatures(
        req.user.userId
      );

    res.json({
      success: true,
      features
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to generate ML features."
    });

  }

};

const getTrainingDataController = async (req, res) => {

  try {

    const data = await getTrainingData(
      req.user.userId
    );

    res.json({
      success: true,
      data
    });

  } catch (error) {

    console.error(
      "Training data error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to generate training data"
    });

  }

};


module.exports = {
  getMLFeatures,
  getTrainingDataController
};