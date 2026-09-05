const express = require("express");

const router = express.Router();

const {
  authenticate
} = require("../middleware/auth.middleware");

const {
  getMLFeatures,
   getTrainingDataController
} = require("../controllers/ml.controller");

router.get(
  "/features",
  authenticate,
  getMLFeatures
);

router.get(
  "/training-data",
  authenticate,
  getTrainingDataController
);


module.exports = router;