const depression = {
  id: "depression",

  title: "Depression",

  description:
    "Reflect on your mood and emotional wellbeing over the past two weeks.",

  time: "3 mins",

  qCount: 9,

  severity: {
    low: [0, 4],
    mild: [5, 9],
    moderate: [10, 14],
    moderatelySevere: [15, 19],
    severe: [20, 27]
  },

  questions: [
    "Little interest or pleasure in doing things?",
    "Feeling down, depressed, or hopeless?",
    "Trouble falling asleep, staying asleep, or sleeping too much?",
    "Feeling tired or having little energy?",
    "Poor appetite or overeating?",
    "Feeling bad about yourself or that you've let yourself or others down?",
    "Trouble concentrating on tasks like reading or watching TV?",
    "Moving or speaking noticeably slower, or feeling unusually restless?",
    "Feeling that life has been especially difficult lately?"
  ]
};

export default depression;