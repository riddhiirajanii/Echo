const prisma = require("../../config/prisma");

const {
  detectEmotion
} = require("../emotion/emotion.service");

const saveJournal = async (content, userId) => {
  const emotion = detectEmotion(content);

  console.log("CONTENT:", content);
  console.log("DETECTED EMOTION:", emotion);

  return await prisma.journalEntry.create({
    data: {
      content,
      emotion,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
};

const getJournals = async (userId) => {
  return await prisma.journalEntry.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

const updateJournal = async (id, content, userId) => {
  const emotion = detectEmotion(content);

  return await prisma.journalEntry.update({
    where: {
      id: Number(id),
      userId
    },
    data: {
      content,
      emotion
    }
  });
};

const deleteJournal = async (id, userId) => {
  return await prisma.journalEntry.delete({
    where: {
      userId,
      id: Number(id)
    }
  });
};

const getJournalById = async (id, userId) => {
  return await prisma.journalEntry.findUnique({
    where: {
      id: Number(id),
      userId
    }
  });
};



module.exports = {
  saveJournal,
  getJournals,
  updateJournal,
  deleteJournal,
  getJournalById
};