const prisma = require("../../config/prisma");

const createConversation = async (userId) => {

  return await prisma.conversation.create({
    data: {
      title: "New Chat",
      userId
    }
  });

};

const getConversations = async (userId) => {

  return await prisma.conversation.findMany({

    where: {
      userId
    },

    orderBy: {
      updatedAt: "desc"
    }

  });

};

const getConversation = async (conversationId, userId) => {

  return await prisma.conversation.findFirst({
    where: {
      id: Number(conversationId),
      userId
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc"
        }
      }
    }
  });

};


const saveMessage = async (
  conversationId,
  role,
  content
) => {

  return await prisma.chatMessage.create({

    data: {
      conversationId,
      role,
      content
    }

  });

};

const renameConversation = async (
  conversationId,
  title
) => {

  return await prisma.conversation.update({

    where: {
      id: Number(conversationId)
    },

    data: {
      title
    }

  });

};

const deleteConversation = async (
  conversationId
) => {

  return await prisma.conversation.delete({

    where: {
      id: Number(conversationId)
    }

  });

};

module.exports = {
  createConversation,
  getConversations,
  getConversation,
  saveMessage,
  renameConversation,
  deleteConversation
};