const prisma = require("../../config/prisma");

const fetchOverview = async (userId) => {
  const totalJournals = await prisma.journalEntry.count({
    where: { userId }
  });

  const averageAnxietyScore = await prisma.journalEntry.aggregate({
    where: { userId },
    _avg: {
      anxietyScore: true
    }
  });

  const latestSeverity = await prisma.journalEntry.findFirst({
    where: { userId },
    orderBy: {
      createdAt: "desc"
    }
  });

  
}