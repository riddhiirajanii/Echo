const prisma = require("../../config/prisma");

const {
  calculateSeverity
} = require("../../config/assessmentScoring.config");


// CREATE ASSESSMENT
const saveAssessment = async (
  assessmentType,
  answers,
  userId
) => {

  if (!Array.isArray(answers)) {
    throw new Error("Answers must be an array.");
  }

  const score = answers.reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );

  const severity = calculateSeverity(
    assessmentType,
    score
  );

  const assessment = await prisma.assessment.create({

    data: {

      assessmentType,

      score,

      severity,

      responses: answers,

      user: {
        connect: {
          id: userId
        }
      }

    }

  });

  return assessment;
};


// GET ALL ASSESSMENTS
const fetchAssessments = async () => {

  return await prisma.assessment.findMany({

    orderBy: {
      createdAt: "desc"
    }

  });

};


// GET ONE ASSESSMENT
const getAssessmentById = async (id) => {

  return await prisma.assessment.findUnique({

    where: {
      id: Number(id)
    }

  });

};


// DELETE ASSESSMENT
const deleteAssessment = async (id) => {

  return await prisma.assessment.delete({

    where: {
      id: Number(id)
    }

  });

};


// UPDATE ASSESSMENT
const updateAssessment = async (
  id,
  answers
) => {

  if (!Array.isArray(answers)) {
    throw new Error("Answers must be an array.");
  }

  const score = answers.reduce(
    (sum, val) => sum + Number(val || 0),
    0
  );

  const severity = calculateSeverity(score);

  return await prisma.assessment.update({

    where: {
      id: Number(id)
    },

    data: {
      score,
      severity,
      responses: answers
    }

  });

};


module.exports = {

  saveAssessment,
  fetchAssessments,
  getAssessmentById,
  deleteAssessment,
  updateAssessment

};