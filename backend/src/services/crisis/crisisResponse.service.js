function getCrisisResponse() {
  return {
    title: "I'm really glad you told me.",
    message:
      "You don't have to carry this alone. I'm concerned about your safety right now. If you're in immediate danger, please contact your local emergency services or a trusted person. I'll stay with you while we figure out the next step.",
    emergency: true
  };
}

module.exports = {
  getCrisisResponse
};