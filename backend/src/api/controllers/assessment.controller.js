const {
  saveAssessment,
  fetchAssessments,
  getAssessmentById,
  deleteAssessment,
  updateAssessment
} = require("../../services/assessment/assessment.service");



const createAssessment = async (req, res) => {

  const { assessmentId, answers } = req.body;

  const assessment = await saveAssessment(assessmentId, answers, req.user.userId);

  res.json({
    success: true,
    assessment
  });
};

const getAssessments = async (req, res) => {

  const assessments = await fetchAssessments();

  res.json({
    success: true,
    assessments
  });
};

const fetchAssessmentById = async (req, res) => {

  const { id } = req.params;

  const assessment =
    await getAssessmentById(id);

  res.json({
    success: true,
    assessment
  });
};

const removeAssessment = async (req, res) => {

  const { id } = req.params;

  const assessment =
    await deleteAssessment(id);

  res.json({
    success: true,
    assessment
  });
};

const editAssessment = async (req, res) => {

  const { id } = req.params;
  const { answers } = req.body;

  const assessment =
    await updateAssessment(id, answers);

  res.json({
    success: true,
    assessment
  });
};

module.exports = {
  createAssessment,
  getAssessments,
  fetchAssessmentById,
  removeAssessment,
  editAssessment
};