const burnout = {
  id: "burnout",

  title: "Burnout",

  description:
    "Measure emotional exhaustion and mental fatigue.",

  time: "3 mins",

  qCount: 10,

  severity: {
    low: [0, 9],
    moderate: [10, 19],
    high: [20, 30]
  },

  questions: [
    "Feeling emotionally drained by your responsibilities?",
    "Feeling exhausted before the day even begins?",
    "Finding it difficult to stay motivated?",
    "Feeling detached from work or studies?",
    "Feeling overwhelmed by everyday demands?",
    "Having difficulty relaxing after work or classes?",
    "Feeling less productive than usual?",
    "Feeling mentally exhausted at the end of the day?",
    "Feeling that you're constantly under pressure?",
    "Struggling to recover even after resting?"
  ]
};

export default burnout;