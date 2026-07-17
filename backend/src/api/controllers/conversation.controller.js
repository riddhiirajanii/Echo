const {
  createConversation,
  getConversations,
  getConversation,
  renameConversation,
  deleteConversation
} = require("../../services/ai/conversation.service");

const createConversationController = async (req, res) => {

  try {

    const conversation = await createConversation(
      req.user.userId
    );

    res.json({
      success: true,
      conversation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to create conversation."
    });

  }

};

const getConversationsController = async (req, res) => {

  try {

    const conversations = await getConversations(
      req.user.userId
    );

    res.json({
      success: true,
      conversations
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations."
    });

  }

};

const getConversationController = async (req, res) => {

  try {

    const conversation = await getConversation(
      req.params.id,
      req.user.userId
    );

    if (!conversation) {

      return res.status(404).json({
        success: false,
        message: "Conversation not found."
      });

    }

    res.json({
      success: true,
      conversation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch conversation."
    });

  }

};

const renameConversationController = async (req, res) => {

  try {

    const { title } = req.body;

    const conversation = await renameConversation(
      req.params.id,
      title
    );

    res.json({
      success: true,
      conversation
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to rename conversation."
    });

  }

};

const deleteConversationController = async (req, res) => {

  try {

    await deleteConversation(req.params.id);

    res.json({
      success: true,
      message: "Conversation deleted."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to delete conversation."
    });

  }

};

module.exports = {
  createConversationController,
  getConversationsController,
  getConversationController,
  renameConversationController,
  deleteConversationController
};