import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { Link } from "react-router-dom";

import api from "../services/api";

function Insights() {

  const [insights, setInsights] =
    useState(null);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          "/insights",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setInsights(
        res.data.report
      );

    } catch (error) {

      console.error(error);

    }

  };

  if (!insights)
  return <h2>Loading...</h2>;

  const chartData =
  insights.history.map(
    (item) => ({
      date: new Date(
        item.date
      ).toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric"
        }
      ),
      score: item.score
    })
  );

  if (!insights)
    return <h2>Loading...</h2>;


return (
  <div className="insights-page-fullscreen">
    
    {/* Return Button */}
    <Link to="/dashboard" className="back-dashboard-btn">
      <span className="back-arrow">←</span> Return to Dashboard
    </Link>

    {/* Section Header */}
    <div className="insights-header">
      <h1>Your Wellness Journey </h1>
      <p>A beautifully quiet snapshot of your emotional timeline, trends, and growth.</p>
    </div>

    <div className="trend-banner">

  {insights.summary.trend === "Improving" &&
    "🌱 Your recent assessments suggest positive progress."}

  {insights.summary.trend === "Worsening" &&
    "⚠️ Your anxiety appears to be increasing compared to previous assessments."}

  {insights.summary.trend === "Stable" &&
    "✨ Your emotional patterns have remained relatively stable."}

</div>

    {/* Metrics Display Panel */}
    <div className="insights-grid">
      <div className="insight-card text-center">
        <div className="insight-icon">🎯</div>
        <h3>Current Score</h3>
        <p className="insight-value">{insights?.summary?.currentScore ?? 0}</p>
        <span className="insight-subtext">latest assessment</span>
      </div>

      <div className="insight-card text-center">
        <div className="insight-icon">📈</div>
        <h3>Trend</h3>
        <p className={`insight-value trend-${(insights?.summary?.trend || "stable").toLowerCase()}`}>
          {insights?.summary?.trend || "Stable"}
        </p>
        <span className="insight-subtext">overall direction</span>
      </div>

      <div className="insight-card text-center">
        <div className="insight-icon">✨</div>
        <h3>Anxiety Level</h3>
        <p className={`insight-value severity-${(insights?.summary?.latestSeverity || "mindful").toLowerCase().replace(/\s+/g, '-')}`}>
          {insights?.summary?.latestSeverity || "Mild"}
        </p>
        <span className="insight-subtext">current state</span>
      </div>

      <div className="insight-card text-center">
        <div className="insight-icon">📝</div>
        <h3>Words Written</h3>
        <p className="insight-value">{insights?.journalStats?.totalWords ?? 0}</p>
        <span className="insight-subtext">self reflection</span>
      </div>
    </div>

    {/* Chart Section Container */}
    <div className="chart-card">
      <div className="chart-header">
        <h2>Anxiety Trend Over Time</h2>
        <p>Watching your highs and lows evening out into steady waves.</p>
      </div>
      
      {/* Chart Wrapper (Kept strictly pristine for Recharts calculation) */}
      <div className="recharts-wrapper-custom">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
            
            <CartesianGrid stroke="#fff1f2" vertical={false} />
            <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{
              fill: "#bfaeae",
              fontSize: 12,
              fontWeight: 500
            }}
            dy={10}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#bfaeae', fontSize: 12 }}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #fecdd3',
                borderRadius: '14px',
                boxShadow: '0 8px 24px rgba(251, 113, 133, 0.06)',
                color: '#4a3e3d'
              }}
              labelStyle={{ fontWeight: '700', color: '#9f1239', marginBottom: '4px' }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#fb7185"
              strokeWidth={3.5}
              dot={{ r: 5, fill: '#fb7185', strokeWidth: 0 }}
              activeDot={{ r: 7, fill: '#e11d48', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    {/* Narrative Information Section (Moved outside the chart layout wrapper) */}
    <div className="insights-narrative-container">
      
      {/* 1. Dynamic Wellness Insight Summary Card */}
      <div className="wellness-summary-card">
        <h2>Wellness Summary</h2>
        <p className="summary-text">
          {insights?.summary?.trend === "Improving"
            ? "Your recent assessments suggest that your anxiety levels are gradually improving. Keep building on the micro-habits that are holding you safe."
            : insights?.summary?.trend === "Worsening"
            ? "Your recent assessments indicate rising anxiety levels. This may be an active sign to gently reprioritize your daily self-care and grounding practices."
            : "Your anxiety levels have remained relatively stable over recent tracking periods. Consistency is a form of balance."}
        </p>
      </div>

      {/* 2. Personalized Smart Recommendations Card */}
      <div className="recommendations-card">
        <h2>Personalized Guidance</h2>
        <div className="recommendations-list">
          {insights?.recommendations && insights.recommendations.length > 0 ? (
            insights.recommendations.map((recommendation, index) => (
              <div key={index} className="recommendation-item">
                <span className="recommendation-bullet">✦</span>
                <p>{recommendation}</p>
              </div>
            ))
          ) : (
            <div className="recommendation-item empty-recommendations">
              <p>Keep writing and tracking your metrics to generate personalized wellness patterns.</p>
            </div>
          )}
        </div>
      </div>

    </div>

  </div>
);
}

export default Insights;