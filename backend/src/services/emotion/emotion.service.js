const detectEmotion = (text) => {
  const content = text.toLowerCase();

  if(
    content.includes("anxious") ||
    content.includes("worried") ||
    content.includes("nervous") ||
    content.includes("stressed") ||
    content.includes("overwhelmed") ||
    content.includes("panic") ||
    content.includes("fear") ||
    content.includes("uneasy") ||
    content.includes("apprehensive") ||
    content.includes("restless") ||
    content.includes("tense")
  ) {
    return "anxiety";
  }

  if(
    content.includes("sad") ||
    content.includes("down") ||
    content.includes("depressed") ||
     content.includes("cry") ||
    content.includes("lonely") ||
    content.includes("hurt")
  ) {
    return "sadness";
  }

   if (
    content.includes("angry") ||
    content.includes("frustrated") ||
    content.includes("annoyed")
  ) {
    return "Anger";
  }

  if (
    content.includes("happy") ||
    content.includes("excited") ||
    content.includes("great")
  ) {
    return "Joy";
  }


  return "neutral";
};

module.exports = {
  detectEmotion
};