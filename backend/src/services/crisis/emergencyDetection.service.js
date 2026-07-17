const emergencyKeywords = [
  "i want to die",
  "i want to kill myself",
  "kill myself",
  "suicide",
  "suicidal",
  "end my life",
  "self harm",
  "self-harm",
  "hurt myself",
  "cut myself",
  "overdose",
  "i don't want to live",
  "no reason to live",
  "life isn't worth it",
  "everyone would be better without me",
  "i can't do this anymore",
  "i'm done",
  "goodbye everyone",
  "i want to disappear",
  "i wish i wasn't here"
];

const panicKeywords = [
  "panic attack",
  "can't breathe",
  "cannot breathe",
  "trouble breathing",
  "i'm shaking",
  "my heart is racing",
  "chest pain",
  "hyperventilating",
  "i feel dizzy",
  "i'm scared",
  "i can't calm down",
  "i feel like i'm dying"
];

function detectEmergency(message) {

  const text = message.toLowerCase();

  if (emergencyKeywords.some(keyword => text.includes(keyword))) {
    return {
      level: "RED",
      type: "suicide"
    };
  }

  if (panicKeywords.some(keyword => text.includes(keyword))) {
    return {
      level: "ORANGE",
      type: "panic"
    };
  }

  return {
    level: "GREEN",
    type: "normal"
  };
}

module.exports = {
  detectEmergency
};