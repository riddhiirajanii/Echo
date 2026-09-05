const prisma = require("../../config/prisma");

const { analyzeText } =
  require("./nlp.service");

const extractUserTexts = (journals, chatMessages) => {

  const journalTexts = journals.map(journal => ({
    source: "journal",
    id: journal.id,
    content: journal.content,
    createdAt: journal.createdAt 
  }));

  const chatTexts = chatMessages
    .filter(message => message.role === "user")
    .map(message => ({
      source: "chat",
      id: message.id,
      text: message.content,
      createdAt: message.createdAt
    }));

     return [
    ...journalTexts,
    ...chatTexts
  ].sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );
};
const calculateTrend = (records) => {

  if (!records || records.length < 2) {

    return {
      direction: "insufficient_data",
      change: 0,
      firstScore: records?.[0]?.score ?? null,
      latestScore: records?.[0]?.score ?? null
    };

  }

  const sorted = [...records].sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );

  const firstScore = sorted[0].score;

  const latestScore =
    sorted[sorted.length - 1].score;

  const change =
    latestScore - firstScore;

  let direction = "stable";

  if (change > 0) {
    direction = "increasing";
  }

  if (change < 0) {
    direction = "decreasing";
  }

  return {

    direction,

    change,

    firstScore,

    latestScore,

    firstDate:
      sorted[0].createdAt,

    latestDate:
      sorted[sorted.length - 1].createdAt

  };

};


const calculateNLPFeatures = (nlpResults) => {

  if (!nlpResults || nlpResults.length === 0) {
    return {
      textCount: 0,
      averageSentiment: 0,
      recentSentiment: 0,
      sentimentChange: 0,
      averageEmotions: {
        anger: 0,
        disgust: 0,
        fear: 0,
        joy: 0,
        neutral: 0,
        sadness: 0,
        surprise: 0
      },
      emotionalVolatility: 0
    };
  }


  // --------------------------------------------------
  // Sort chronologically
  // --------------------------------------------------

  const sorted = [...nlpResults].sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );


  // --------------------------------------------------
  // Convert sentiment into a signed value
  // --------------------------------------------------

  const sentimentValues = sorted.map(item => {

    if (item.sentiment.label === "POSITIVE") {
      return item.sentiment.score;
    }

    return -item.sentiment.score;

  });


  // --------------------------------------------------
  // Average sentiment
  // --------------------------------------------------

  const averageSentiment =
    sentimentValues.reduce(
      (sum, value) => sum + value,
      0
    ) / sentimentValues.length;


  // --------------------------------------------------
  // Recent sentiment
  // --------------------------------------------------

  const recentCount =
    Math.min(5, sentimentValues.length);

  const recentValues =
    sentimentValues.slice(-recentCount);

  const recentSentiment =
    recentValues.reduce(
      (sum, value) => sum + value,
      0
    ) / recentValues.length;


  // --------------------------------------------------
  // Sentiment change
  // --------------------------------------------------

  const sentimentChange =
    recentSentiment - averageSentiment;


  // --------------------------------------------------
  // Average emotion scores
  // --------------------------------------------------

  const emotionNames = [
    "anger",
    "disgust",
    "fear",
    "joy",
    "neutral",
    "sadness",
    "surprise"
  ];


  const averageEmotions = {};


  emotionNames.forEach(
    emotion => {

      const values =
        sorted.map(
          item =>
            item.emotion?.scores?.[emotion] || 0
        );


      averageEmotions[emotion] =
        values.reduce(
          (sum, value) => sum + value,
          0
        ) / values.length;

    }
  );


  // --------------------------------------------------
  // Emotional volatility
  // --------------------------------------------------

  const emotionalValues =
    sorted.map(
      item =>
        item.emotion?.scores || {}
    );


  let volatility = 0;


  if (emotionalValues.length > 1) {

    let differences = 0;
    let comparisons = 0;


    for (
      let i = 1;
      i < emotionalValues.length;
      i++
    ) {

      emotionNames.forEach(
        emotion => {

          const previous =
            emotionalValues[i - 1][emotion] || 0;

          const current =
            emotionalValues[i][emotion] || 0;

          differences +=
            Math.abs(current - previous);

          comparisons++;

        }
      );

    }


    volatility =
      differences / comparisons;

  }


  return {

    textCount:
      sorted.length,

    averageSentiment:
      Number(
        averageSentiment.toFixed(4)
      ),

    recentSentiment:
      Number(
        recentSentiment.toFixed(4)
      ),

    sentimentChange:
      Number(
        sentimentChange.toFixed(4)
      ),

    averageEmotions,

    emotionalVolatility:
      Number(
        volatility.toFixed(4)
      )

  };

};

const buildMLFeatureVector = (
  latestAssessments,
  assessmentTrends,
  nlpFeatures
) => {

  const getScore = (type) => {

    return latestAssessments[type]?.score ?? 0;

  };


  const getTrend = (type) => {

    return assessmentTrends[type]?.change ?? 0;

  };


  return {

    // -------------------------------
    // Assessment features
    // -------------------------------

    anxiety_score:
      getScore("anxiety"),

    depression_score:
      getScore("depression"),

    burnout_score:
      getScore("burnout"),

    relationship_anxiety_score:
      getScore("relationship_anxiety"),

    ocd_score:
      getScore("ocd"),

    childhood_trauma_score:
      getScore("childhood_trauma"),


    // -------------------------------
    // Assessment trends
    // -------------------------------

    anxiety_trend:
      getTrend("anxiety"),

    depression_trend:
      getTrend("depression"),

    burnout_trend:
      getTrend("burnout"),

    relationship_anxiety_trend:
      getTrend("relationship_anxiety"),

    ocd_trend:
      getTrend("ocd"),


    // -------------------------------
    // NLP sentiment
    // -------------------------------

    average_sentiment:
      nlpFeatures.averageSentiment,

    recent_sentiment:
      nlpFeatures.recentSentiment,

    sentiment_change:
      nlpFeatures.sentimentChange,


    // -------------------------------
    // NLP emotions
    // -------------------------------

    anger:
      nlpFeatures.averageEmotions.anger,

    disgust:
      nlpFeatures.averageEmotions.disgust,

    fear:
      nlpFeatures.averageEmotions.fear,

    joy:
      nlpFeatures.averageEmotions.joy,

    neutral:
      nlpFeatures.averageEmotions.neutral,

    sadness:
      nlpFeatures.averageEmotions.sadness,

    surprise:
      nlpFeatures.averageEmotions.surprise,


    // -------------------------------
    // Emotional volatility
    // -------------------------------

    emotional_volatility:
      nlpFeatures.emotionalVolatility,


    // -------------------------------
    // Activity features
    // -------------------------------

    text_count:
      nlpFeatures.textCount

  };

};

// ============================================================
// Get all ML features for a user
// ============================================================

const getUserFeatures = async (userId) => {

  const numericUserId =
    Number(userId);


   
  // ==========================================================
  // 1. GET ASSESSMENT HISTORY
  // ==========================================================

  const assessments =
    await prisma.assessment.findMany({

      where: {
        userId: numericUserId
      },

      orderBy: {
        createdAt: "asc"
      }

    });


  // ==========================================================
  // 2. GET JOURNAL HISTORY
  // ==========================================================

  const journals =
    await prisma.journalEntry.findMany({

      where: {
        userId: numericUserId
      },

      orderBy: {
        createdAt: "asc"
      }

    });


  // ==========================================================
  // 3. GET CONVERSATIONS + MESSAGES
  // ==========================================================

  const conversations =
    await prisma.conversation.findMany({

      where: {
        userId: numericUserId
      },

      include: {

        messages: {

          orderBy: {
            createdAt: "asc"
          }

        }

      },

      orderBy: {
        createdAt: "asc"
      }

    });


  // ==========================================================
  // 4. FLATTEN ALL CHAT MESSAGES
  // ==========================================================

  const chatMessages =
    conversations.flatMap(
      conversation =>
        conversation.messages
    );


  // ==========================================================
  // 5. FORMAT ASSESSMENT HISTORY
  // ==========================================================

  const assessmentHistory =
    assessments.map(
      assessment => ({

        id:
          assessment.id,

        type:
          assessment.assessmentType,

        score:
          assessment.score,

        severity:
          assessment.severity,

        responses:
          assessment.responses,

        createdAt:
          assessment.createdAt

      })
    );


  // ==========================================================
  // 6. GROUP ASSESSMENTS BY TYPE
  // ==========================================================

  const groupedAssessments = {};


  assessments.forEach(
    assessment => {

      const type =
        assessment.assessmentType;


      if (!groupedAssessments[type]) {

        groupedAssessments[type] = [];

      }


      groupedAssessments[type].push(
        assessment
      );

    }
  );


  // ==========================================================
  // 7. CALCULATE TRENDS
  // ==========================================================

  const assessmentTrends = {};


  Object.entries(
    groupedAssessments
  ).forEach(
    ([type, records]) => {

      assessmentTrends[type] =
        calculateTrend(records);

    }
  );


  // ==========================================================
  // 8. GET LATEST ASSESSMENT FOR EACH TYPE
  // ==========================================================

  const latestAssessments = {};


  Object.entries(
    groupedAssessments
  ).forEach(
    ([type, records]) => {

      const sorted =
        [...records].sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );


      const latest =
        sorted[0];


      latestAssessments[type] = {

        score:
          latest.score,

        severity:
          latest.severity,

        createdAt:
          latest.createdAt

      };

    }
  );


  // ==========================================================
  // 9. JOURNAL FEATURES
  // ==========================================================

  const journalEmotions =
    journals
      .map(
        journal =>
          journal.emotion
      )
      .filter(Boolean);


  const journalFeatures = {

    totalEntries:
      journals.length,

    emotions:
      journalEmotions,

    latestEntry:
      journals.length > 0
        ? journals[journals.length - 1].createdAt
        : null

  };


  // ==========================================================
  // 10. CHAT FEATURES
  // ==========================================================

  const userMessages =
    chatMessages.filter(
      message =>
        message.role === "user"
    );


  const assistantMessages =
    chatMessages.filter(
      message =>
        message.role === "assistant"
    );


  const chatFeatures = {

    totalMessages:
      userMessages.length,

    assistantMessages:
      assistantMessages.length,

    totalConversations:
      conversations.length,

    latestMessage:
      userMessages.length > 0
        ? userMessages[userMessages.length - 1].createdAt
        : null

  };

   const userTexts = extractUserTexts(
  journals,
  chatMessages
);
   
  const nlpResults = [];

for (const item of userTexts) {

  if (
    !item.text ||
    typeof item.text !== "string" ||
    !item.text.trim()
  ) {
    continue;
  }

  const analysis =
    await analyzeText(item.text);

  if (!analysis) {
    continue;
  }

  nlpResults.push({

    ...item,

    sentiment:
      analysis.sentiment,

    emotion:
      analysis.emotion

  });

}

const nlpFeatures = calculateNLPFeatures(
  nlpResults
);

const mlFeatures =
  buildMLFeatureVector(
    latestAssessments,
    assessmentTrends,
    nlpFeatures
  );

  // ==========================================================
  // 11. RETURN COMPLETE ML FEATURE OBJECT
  // ==========================================================

  return {

  userId: numericUserId,

  assessments: {

    history: assessmentHistory,

    latest: latestAssessments,

    trends: assessmentTrends

  },

  journals: journalFeatures,

  chats: chatFeatures,

  nlp: {

    texts: nlpResults,

    features: nlpFeatures

  },

  mlFeatures,

  generatedAt: new Date()

};

};

const getTrendLabel = (normalizedChange) => {

  if (normalizedChange <= -0.05) {
    return "improving";
  }

  if (normalizedChange >= 0.05) {
    return "worsening";
  }

  return "stable";
};

const getTrainingData = async (userId) => {

  const numericUserId = Number(userId);

  const MAX_SCORES = {
    anxiety: 21,

  depression: 27,

  burnout: 30,

  relationship_anxiety: 30,

  childhood_trauma: 30,

  ptsd: 24,

  ocd: 30,

  sleep: 24,

  self_esteem: 30,

  emotional_regulation: 24
}

  const assessments =
    await prisma.assessment.findMany({

      where: {
        userId: numericUserId
      },

      orderBy: {
        createdAt: "asc"
      }

    });

  const journals =
    await prisma.journalEntry.findMany({

      where: {
        userId: numericUserId
      },

      orderBy: {
        createdAt: "asc"
      }

    });

  const conversations =
    await prisma.conversation.findMany({

      where: {
        userId: numericUserId
      },

      include: {
        messages: {
          where: {
            role: "user"
          },

          orderBy: {
            createdAt: "asc"
          }
        }
      }

    });

  const chatMessages =
    conversations.flatMap(
      conversation =>
        conversation.messages
    );

  const userTexts = [

    ...journals.map(journal => ({
      text: journal.content,
      createdAt: journal.createdAt,
      source: "journal"
    })),

    ...chatMessages.map(message => ({
      text: message.content,
      createdAt: message.createdAt,
      source: "chat"
    }))

  ].filter(item =>
    item.text &&
    item.text.trim()
  );

  userTexts.sort(
    (a, b) =>
      new Date(a.createdAt) -
      new Date(b.createdAt)
  );



 const assessmentsByType = {};

  for (const assessment of assessments) {

    const type =
      assessment.assessmentType || "legacy";

    if (!assessmentsByType[type]) {

      assessmentsByType[type] = [];

    }

    assessmentsByType[type].push(
      assessment
    );

  }

  const trainingRows = [];


  // Process every assessment type separately
  for (
    const [assessmentType, typeAssessments]
    of Object.entries(assessmentsByType)
  ) {


    // Need at least TWO assessments
    // to calculate a future outcome

    if (typeAssessments.length < 2) {
      continue;
    }


    for (
      let i = 0;
      i < typeAssessments.length - 1;
      i++
    ) {

      const currentAssessment =
        typeAssessments[i];

      const nextAssessment =
        typeAssessments[i + 1];


      const previousTexts =
        userTexts.filter(

          item =>
            new Date(item.createdAt) <=
            new Date(currentAssessment.createdAt)

        );

      const nlpResults = [];


      for (
        const item of previousTexts
      ) {

        const analysis =
          await analyzeText(
            item.text
          );


        if (!analysis) {
          continue;
        }


        nlpResults.push({

          ...item,

          sentiment:
            analysis.sentiment,

          emotion:
            analysis.emotion

        });

      }

      const nlpFeatures =
        calculateNLPFeatures(
          nlpResults
        );
      
      const normalizedScoreChange = (nextAssessment.score - currentAssessment.score) / (MAX_SCORES[nextAssessment.assessmentType] || 1);
      
      const scoreChange =
        nextAssessment.score -
        currentAssessment.score;

      const currentNormalizedScore = currentAssessment.score / (MAX_SCORES[currentAssessment.assessmentType] || 1);

      const nextNormalizedScore = nextAssessment.score / (MAX_SCORES[nextAssessment.assessmentType] || 1);
      
      trainingRows.push({

        assessmentType,

        timestamp:
          currentAssessment.createdAt,

        currentScore:
          currentAssessment.score,


        nextScore:
          nextAssessment.score,
         
         currentNormalizedScore,

        nextNormalizedScore,

        normalizedScoreChange,

        trend:
          getTrendLabel(
            normalizedScoreChange
          ),

        averageSentiment:
          nlpFeatures.averageSentiment,

        recentSentiment:
          nlpFeatures.recentSentiment,

        sentimentChange:
          nlpFeatures.sentimentChange,

        sadness:
          nlpFeatures.averageEmotions.sadness,

        fear:
          nlpFeatures.averageEmotions.fear,

        joy:
          nlpFeatures.averageEmotions.joy,

        anger:
          nlpFeatures.averageEmotions.anger,

        disgust:
          nlpFeatures.averageEmotions.disgust,

        surprise:
          nlpFeatures.averageEmotions.surprise,

        neutral:
          nlpFeatures.averageEmotions.neutral,

        emotionalVolatility:
          nlpFeatures.emotionalVolatility,

        textCount:
          nlpFeatures.textCount

      });

    }

  }


  return trainingRows;

};

// ============================================================
// EXPORT
// ============================================================

module.exports = {

  getUserFeatures,
  getTrainingData

};