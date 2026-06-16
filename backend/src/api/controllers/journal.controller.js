const {
  saveJournal,
  getJournals,
  updateJournal,
  deleteJournal,
  getJournalById
} = require("../../services/wellness/journal.service");


const createJournal = async (req, res) => {
  const { content } = req.body;

  const journal = await saveJournal(content, req.user.userId);

  res.json({
    success: true,
    journal
  });
};

const fetchJournals = async (req, res) => {
  const journals = await getJournals();

  res.json({
    success: true,
    journals
  });
};

const editJournal = async (req, res) => {

  const { id } = req.params;
  const { content } = req.body;

  const journal =
    await updateJournal(id, content);

  res.json({
    success: true,
    journal
  });
};

const removeJournal = async (req, res) => {

  const { id } = req.params;

  const journal = await deleteJournal(id);

  res.json({
    success: true,
    journal
  });
};

const fetchJournalById = async (req, res) => {

  const { id } = req.params;

  const journal =
    await getJournalById(id);

  res.json({
    success: true,
    journal
  });
};

module.exports = {
  createJournal,
  fetchJournals,
  editJournal,
  removeJournal,
  fetchJournalById
};