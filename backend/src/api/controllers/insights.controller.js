const {
  fetchInsights
} = require("../../services/analytics/insights.service");

const getInsights = async (req, res) => {

  const insights = await fetchInsights();

  res.json({
    success: true,
    insights
  });
};

module.exports = {
  getInsights
};