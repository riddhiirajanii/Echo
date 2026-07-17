import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";



function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

   const user = JSON.parse(localStorage.getItem("user"));
 
     const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    const navigate = useNavigate();
  
  const [report, setReport] = useState({
  summary: {
    totalJournals: 0,
    totalAssessments: 0,
    averageAnxietyScore: 0,
    currentScore: 0,
    latestSeverity: "Unknown",
    trend: "Stable"
  },

  history: [],

  journalStats: {
    totalWords: 0,
    longestEntry: 0
  },

  recommendations: []
});
  
  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await api.get("/insights", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const res = await api.get("/insights", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
     
      setReport(res.data.report);
    } catch (error) {
      console.error("Error fetching insights:", error);
    }

  };

return (
  <div className="dashboard-layout">
    {/* Sidebar Toggle for Mobile */}
    <button className="menu-btn" onClick={() => setSidebarOpen(true)}>
      ☰
    </button>
    
    {/* Navigation Sidebar */}
    <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={() => setSidebarOpen(false)}>
        ✕
      </button>

      <div className="sidebar-logo">Echo</div>

      <nav className="sidebar-nav">
        <button className="nav-item active">
          <span className="nav-icon"></span> Dashboard
        </button>
        <button className="nav-item" onClick={() => navigate("/journal")}>
          <span className="nav-icon"></span> Journal
        </button>
        <button className="nav-item" onClick={() => navigate("/assessment")}>
          <span className="nav-icon"></span> Assessment
        </button>
        <button className="nav-item" onClick={() => navigate("/insights")}>
          <span className="nav-icon"></span> Insights
        </button>
        <button className="nav-item" onClick={() => navigate("/chat")}>
          <span className="nav-icon"></span> Talk to Echo
        </button>
        <button className="nav-item" onClick={() => navigate("/calmspace")}>
          <span className="nav-icon"></span> Calm Space
        </button>
        <button className="nav-item" onClick={() => navigate("/profile")}>
          <span className="nav-icon"></span> Profile
        </button>
      </nav>
    </aside>

    {/* Backdrop overlay for mobile screens */}
    {sidebarOpen && (
      <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
    )} 

    {/* Main Content Workspace */}
    <main className="dashboard-main">
      {/* Warm Welcome Hero banner */}
      <section className="hero-section">
        <h1>{greeting}, {user?.name || "Friend"}</h1>
        <p>
          Take a deep breath. You've gently recorded <strong>{report.summary.totalJournals || 0} journal entries</strong> and completed <strong>{report.summary.totalAssessments || 0} mindset check-ins</strong>.
        </p>
      </section>

      {/* Aesthetic Analytical Cards */}
      <section className="stats-grid">

  <div className="stat-card score-accent">
    <div>
      <h3>Current Score</h3>
      <p className="stat-value">
        {report.summary.currentScore}
      </p>
    </div>
  </div>

  <div className="stat-card trend-accent">
    <div>
      <h3>Trend</h3>
      <p className="stat-value">
        {report.summary.trend === "Improving"
          ? "📉 Improving"
          : report.summary.trend === "Worsening"
          ? "📈 Rising"
          : "➖ Stable"}
      </p>
    </div>
  </div>

  <div className="stat-card mood-accent">
    <div>
      <h3>Anxiety Level</h3>
      <p className="stat-value severity-badge">
        {report.summary.latestSeverity}
      </p>
    </div>
  </div>

  <div className="stat-card journal-accent">
    <div>
      <h3>Words Written</h3>
      <p className="stat-value">
        {report.journalStats.totalWords}
      </p>
    </div>
  </div>

</section>
      {/* Gentle Quick Action Options */}
      <section className="quick-actions">
        <h2>Reflections & Exercises</h2>
        <div className="action-grid">
          <button className="action-btn" onClick={() => navigate("/journal")}>
           
            <div>
              <h4>Expressive Writing</h4>
              <p>Log a new journal entry</p>
            </div>
          </button>

          <button className="action-btn">
            
            <div>
              <h4>Mindset Check-in</h4>
              <p>Take your assessment</p>
            </div>
          </button>

          <button className="action-btn chat-special-btn">
            
            <div>
              <h4>Talk With Echo</h4>
              <p>Find comfort right now</p>
            </div>
          </button>
        </div>
      </section>

      {/* Timeline Dynamic Wrapper Area */}
      <section className="recent-section">
        <h2>Your Recent Reflections</h2>
        <div className="placeholder-card">
          <div className="placeholder-art">🌸</div>
          <p>Your beautiful mindfulness timeline will grow here as you write.</p>
        </div>
      </section>
    </main>
  </div>
);
}

export default Dashboard;