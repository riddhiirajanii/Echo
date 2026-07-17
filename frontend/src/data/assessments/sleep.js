const sleep = {
  id: "sleep",

  title: "Sleep Quality",

  description:
    "Understand how sleep may be affecting your wellbeing.",

  time: "2 mins",

  qCount: 8,

  severity: {
    good: [0, 4],
    fair: [5, 9],
    poor: [10, 24]
  },

  questions: [
    "Difficulty falling asleep?",
    "Waking up during the night?",
    "Feeling tired after waking up?",
    "Sleeping fewer hours than intended?",
    "Having restless sleep?",
    "Difficulty staying asleep?",
    "Feeling sleepy during the day?",
    "Feeling your sleep affects your daily functioning?"
  ]
};

export default sleep;