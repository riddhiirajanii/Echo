const {
  generateReply
} = require("../../services/ai/chat.service");

const {
  saveMessage
} = require("../../services/ai/conversation.service");

const {
  detectEmergency
} = require("../../services/crisis/emergencyDetection.service");

const {
  getPanicResponse
} = require("../../services/crisis/panicResponse.service");

const {
  getCrisisResponse
} = require("../../services/crisis/crisisResponse.service");

const {
  getHelplines
} = require("../../services/crisis/helpline.service");

const {
  getConversation
} = require("../../services/ai/conversation.service");
const chatController = async (req, res) => {

  try {

    const {
      conversationId,
      message
    } = req.body;

    console.log("conversationId", conversationId);
    // Save user's message
    await saveMessage(
      conversationId,
      "user",
      message
    );

    // Detect emergency
    const assessment =
      detectEmergency(message);

    // 🟢 GREEN
    if (assessment.level === "GREEN") {

      const messages =
await getConversation(
    conversationId,
    req.user.userId
);

const reply =
await generateReply(
    messages.messages,
    message
);

      // Save AI response
      await saveMessage(
        conversationId,
        "assistant",
        reply
      );

      return res.json({
        success: true,
        type: "chat",
        assessment,
        reply
      });

    }

    // 🟠 ORANGE
    if (assessment.level === "ORANGE") {

      const panic =
        getPanicResponse();

      // Save panic response
      await saveMessage(
        conversationId,
        "assistant",
        panic.message
      );

      return res.json({
        success: true,
        type: "panic",
        assessment,
        response: panic
      });

    }

    // 🔴 RED
    const crisis =
      getCrisisResponse();

    await saveMessage(
      conversationId,
      "assistant",
      crisis.message
    );

    return res.json({
      success: true,
      type: "crisis",
      assessment,
      response: crisis,
      helplines: getHelplines()
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong."
    });

  }

};

module.exports = {
  chatController
};