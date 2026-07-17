const {
  fetchInsights
} = require("../../services/analytics/insights.service");

const getInsights = async (req, res) => {

  const report = await fetchInsights(
    req.user.userId
  );

  res.json({
    success: true,
    report
  });
};

module.exports = {
  getInsights
};