const { default: selfesteem } = require("../../../frontend/src/data/assessments/selfesteem");

const ASSESSMENT_SCORING = {

  anxiety: {
    ranges: {
      low: [0, 4],
      mild: [5, 9],
      moderate: [10, 14],
      severe: [15, 21]
    }
  },

  depression: {
    ranges: {
      low: [0, 4],
      mild: [5, 9],
      moderate: [10, 14],
      moderatelySevere: [15, 19],
      severe: [20, 27]
    }
  },

  burnout: {
    ranges: {
      low: [0, 9],
      moderate: [10, 19],
      high: [20, 30]
    }
  },

  ocd: {
    ranges: {
      low: [0, 7],
      moderate: [8, 15],
      high: [16, 30]
    }
  },
  relationship_anxiety: {
    ranges: {
      low: [0, 7],
      moderate: [8, 15],
      high: [16, 30]
    }
  }, 
  selfesteem: {
    ranges: {
      low: [0, 10],
      moderate: [11, 20],
      high: [21, 30]
    }
  },
  sleep: {
    ranges:{
      low: [0, 5], 
      moderate: [6, 12],
      high: [13, 24]
    }
  },
  trauma:{
    ranges:{
      low: [0, 7],
      moderate: [8, 15],
      high: [16, 30]
    }
  }


};

const calculateSeverity = (assessmentType, score) => {

  const config = ASSESSMENT_SCORING[assessmentType];

  if (!config) {
    throw new Error(
      `Unknown assessment type: ${assessmentType}`
    );
  }

  for (const [severity, range] of Object.entries(config.ranges)) {

    const [min, max] = range;

    if (score >= min && score <= max) {
      return severity;
    }

  }

  throw new Error(
    `Score ${score} is outside the valid range for ${assessmentType}`
  );
};

module.exports = {
  ASSESSMENT_SCORING,
  calculateSeverity
};