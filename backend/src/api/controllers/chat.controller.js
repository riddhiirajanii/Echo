const { getReply } = require("../../services/ai/chatbot.service");

const sendMessage = async (req, res) => {
  const { message } = req.body;

  const reply = await getReply(message);

  res.json({
    success: true,
    reply
  });
};

module.exports = {
  sendMessage
};