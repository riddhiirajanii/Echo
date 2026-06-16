const prisma = require("../../config/prisma");

const fetchInsights = async () => {
  const totalJournals = await prisma.journalEntry.count();

  const totalAssessments = await prisma.assessment.count();

  const averageScore = await prisma.assessment.aggregate({
    _avg: {
      score: true
    }
  });

  const latestAssessment = await prisma.assessment.findFirst({
    orderBy: {
      createdAt: "desc"
    }
  });

  return {
    totalJournals,
    totalAssessments,
    averageAnxietyScore:
    averageScore._avg.score,
    latestSeverity:
    latestAssessment?.severity
  };
};

module.exports = {
  fetchInsights
};