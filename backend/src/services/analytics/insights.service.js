const prisma = require("../../config/prisma");

const fetchInsights = async (userId) => {

  // Basic Stats

  const totalJournals =
    await prisma.journalEntry.count({
      where: { userId }
    });

  const totalAssessments =
    await prisma.assessment.count({
      where: { userId }
    });

  const averageScore =
    await prisma.assessment.aggregate({
      where: { userId },
      _avg: {
        score: true
      }
    });

  // Assessment History

  const assessments =
    await prisma.assessment.findMany({
      where: { userId },
      orderBy: {
        createdAt: "asc"
      }
    });

  const latestAssessment =
    assessments[
      assessments.length - 1
    ];

  // Trend Detection

  let trend = "Stable";

  if (assessments.length >= 2) {

    const firstScore =
      assessments[0].score;

    const latestScore =
      latestAssessment.score;

    if (latestScore < firstScore)
      trend = "Improving";

    else if (latestScore > firstScore)
      trend = "Worsening";
  }

  // Journal Analytics

  const journals =
    await prisma.journalEntry.findMany({
      where: { userId }
    });

  const totalWords =
    journals.reduce(
      (sum, journal) =>
        sum +
        journal.content
          .trim()
          .split(/\s+/)
          .length,
      0
    );

  const longestEntry =
    journals.reduce(
      (max, journal) =>
        Math.max(
          max,
          journal.content
            .trim()
            .split(/\s+/)
            .length
        ),
      0
    );

  // Recommendations

  let recommendations = [];

  switch (
    latestAssessment?.severity
  ) {

    case "Severe":

      recommendations = [
        "Practice grounding exercises daily",
        "Reach out to a trusted friend or family member",
        "Prioritize sleep and hydration",
        "Consider speaking with a mental health professional"
      ];

      break;

    case "Moderate":

      recommendations = [
        "Try a creative hobby like crochet, dance, sketching, or music",
        "Reduce doomscrolling and excessive social media use",
        "Schedule dedicated relaxation time",
        "Continue journaling regularly"
      ];

      break;

    case "Mild":

      recommendations = [
        "Maintain your current healthy routines",
        "Spend more time outdoors",
        "Practice breathing exercises",
        "Keep tracking your emotions"
      ];

      break;

    default:

      recommendations = [
        "Keep up your positive habits",
        "Stay socially connected",
        "Continue journaling when needed",
        "Celebrate your progress"
      ];
  }

  return {

    summary: {
  totalJournals,

  totalAssessments,

  averageAnxietyScore:
    averageScore._avg.score || 0,

  currentScore:
    latestAssessment?.score || 0,

  latestSeverity:
    latestAssessment?.severity ||
    "No assessments yet",

  trend
},

    history:
      assessments.map(
        (assessment) => ({
          date:
            assessment.createdAt,
          score:
            assessment.score,
          severity:
            assessment.severity
        })
      ),

    journalStats: {

      totalWords,

      longestEntry

    },

    recommendations

  };

};

module.exports = {
  fetchInsights
};