const prisma = require("../../config/prisma");

const calculateSeverity = (score) => {
  if(score <= 4) return "Minimal";
  if(score <= 9) return "Mild";
  if(score <= 14) return "Moderate";
  if(score <= 19) return "Moderately Severe";
  return "Severe";
};

const saveAssessment = async (answers, userId) => {
   
  const score = answers.reduce((sum, val) => sum+val, 0);

  const severity = calculateSeverity(score);

  const assessment = await prisma.assessment.create({
    data: {
      score,
      severity,
      user: {
        connect: {
          id: userId
        }
       }
    }
  });   

  return assessment;
}

const fetchAssessments = async () => {
  return await prisma.assessment.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
};

const getAssessmentById = async (id) => {
  return await prisma.assessment.findUnique({
    where: {
      id: Number(id)
    }
  });
};

const deleteAssessment = async (id) => {
  return await prisma.assessment.delete({
    where: {
      id: Number(id)
    }
  });
};

const updateAssessment = async (id, answers) => {

  const score =
    answers.reduce((sum, val) => sum + val, 0);

  const severity =
    calculateSeverity(score);

  return await prisma.assessment.update({
    where: {
      id: Number(id)
    },
    data: {
      score,
      severity
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