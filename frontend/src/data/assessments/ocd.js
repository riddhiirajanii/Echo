const ocd = {
  id: "ocd",

  title: "OCD Screening",

  description:
    "Reflect on intrusive thoughts and repetitive behaviours.",

  time: "5 mins",

  qCount: 10,

  severity: {
    low: [0, 7],
    moderate: [8, 15],
    high: [16, 30]
  },

  questions: [
    "Experiencing unwanted intrusive thoughts?",
    "Feeling compelled to repeat certain actions?",
    "Checking things repeatedly?",
    "Excessive hand washing or cleaning?",
    "Feeling uncomfortable unless things feel 'just right'?",
    "Counting or repeating words silently?",
    "Difficulty controlling repetitive thoughts?",
    "Feeling anxious if rituals are interrupted?",
    "Spending significant time on repetitive behaviours?",
    "Feeling these behaviours interfere with daily life?"
  ]
};

export default ocd;