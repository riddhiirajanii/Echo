import { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

function Journal() {

  const [content, setContent] = useState("");
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  const [selectedMood, setSelectedMood] =
    useState("Calm");

  const [intentions, setIntentions] =
    useState([
      {
        text: "Take three deep breaths",
        completed: true
      },
      {
        text: "Drink a glass of warm water",
        completed: false
      },
      {
        text: "Write down one thing I love",
        completed: false
      }
    ]);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {

      const token =
        localStorage.getItem("token");

      const res =
        await api.get(
          "/journal",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setJournals(
        res.data.journals
      );

    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async () => {

    if (!content.trim()) return;

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      await api.post(
        "/journal",
        {
          content,
          mood: selectedMood
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setContent("");

      fetchJournals();

    } catch (error) {

      console.error(error);

    } finally {

      setLoading(false);

    }

  };

  const deleteJournal = async (id) => {
    try {

      const token =
        localStorage.getItem("token");

      await api.delete(
        `/journal/${id}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      fetchJournals();

    } catch (error) {
      console.error(error);
    }
  };

  const updateJournal = async (
    id,
    newContent
  ) => {

    try {

      const token =
        localStorage.getItem("token");

      await api.put(
        `/journal/${id}`,
        {
          content: newContent
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setEditingId(null);
      setEditedContent("");

      fetchJournals();

    } catch (error) {

      console.error(error);

    }

  };

  const toggleIntention = (index) => {

    const updated =
      [...intentions];

    updated[index].completed =
      !updated[index].completed;

    setIntentions(updated);

  };

 return (
  <div className="journal-page-fullscreen">
    
    {/* --- LEFT SIDE PANEL: Grounding Center --- */}
    <aside className="grounding-sidebar">
      <div className="sidebar-sticky-content">
        
        {/* 1. Calendar Widget */}
        <div className="mindful-widget calendar-box">
          <div className="widget-title">
            <span>📅</span>
            <h3>Today</h3>
          </div>
          <div className="calendar-display">
            <span className="cal-m">{new Date().toLocaleDateString(undefined, { month: 'long' })}</span>
            <span className="cal-d">{new Date().toLocaleDateString(undefined, { day: 'numeric' })}</span>
            <span className="cal-y">{new Date().getFullYear()}</span>
          </div>
        </div>

        {/* 2. Mood Sticker Section */}
        <div className="mindful-widget mood-box">
          <div className="widget-title">
            <span>🌸</span>
            <h3>My Mood Sticker</h3>
          </div>
          <p className="widget-subtitle">Tap to stamp your feeling today:</p>
          <div className="sticker-grid">
            <button className="sticker-item active">☀️ Calm</button>
            <button className="sticker-item">🌱 Growing</button>
            <button className="sticker-item">🌊 Heavy</button>
            <button className="sticker-item">☁️ Tired</button>
          </div>
        </div>

        {/* 3. Intention Checklist */}
        <div className="mindful-widget intentions-box">
          <div className="widget-title">
            <span>✨</span>
            <h3>Gentle Focus</h3>
          </div>
          <ul className="intentions-list">
            <li className="intention-row done">
              <span className="bullet-check">✓</span> Take three deep breaths
            </li>
            <li className="intention-row">
              <span className="bullet-check"></span> Drink a warm glass of water
            </li>
            <li className="intention-row">
              <span className="bullet-check"></span> Notice one good small thing
            </li>
          </ul>
        </div>

      </div>
    </aside>

    {/* --- RIGHT SIDE PANEL: Writing Workspace --- */}
    <main className="writing-workspace">
      
      {/* 🌸 Added: Back to Dashboard Link */}
      <Link to="/dashboard" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Return to Dashboard
      </Link>

      <div className="workspace-header">
        <h1>My Sacred Space 🌱</h1>
        <p>Let your thoughts flow freely. There is no right or wrong way to write.</p>
      </div>

      {/* Minimal & Clean Text Box */}
      <div className="canvas-container">
        <textarea
          className="mindful-textarea"
          placeholder="How is your heart feeling right now? Begin typing whenever you are ready..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="canvas-footer">
          <span className="safety-badge">🔒 Your words are private and safely encrypted.</span>
          <button
            onClick={handleSubmit}
            disabled={loading || !content.trim()}
            className="canvas-submit-btn"
          >
            {loading ? "Gently saving..." : "Release to Journal"}
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      {/* --- Timeline Section --- */}
<div className="timeline-section">
  <h2>Past Reflections</h2>
  {journals.length === 0 ? (
    <div className="empty-state-card">
      <div className="empty-icon">🌸</div>
      <p>Your history is clean and quiet. Your thoughts will stack gracefully here.</p>
    </div>
  ) : (
    <div className="timeline-grid">
      {journals.map((journal) => (
        <div key={journal.id} className="timeline-entry">
          <div className="entry-header">
            <span className="mood-tag">✨ {journal.emotion || "Mindful"}</span>
            <span className="entry-timestamp">
              📅 {new Date(journal.createdAt).toLocaleDateString()}
            </span>
          </div>

          {editingId === journal.id ? (
            <div className="edit-zone">
              <textarea
                className="edit-textarea"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="journal-actions">
                <button
                  className="save-btn text-action"
                  onClick={() => updateJournal(journal.id, editedContent)}
                >
                  Save changes
                </button>
                <button
                  className="cancel-btn text-action"
                  onClick={() => {
                    setEditingId(null);
                    setEditedContent("");
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="entry-body">{journal.content}</p>
              
              {/* 🌸 Brought Back: Edit & Delete Buttons panel */}
              <div className="journal-actions">
                <button
                  className="icon-action-btn edit"
                  title="Edit Entry"
                  onClick={() => {
                    setEditingId(journal.id);
                    setEditedContent(journal.content);
                  }}
                >
                  ✏️
                </button>
                <button
                  className="icon-action-btn delete"
                  title="Delete Entry"
                  onClick={() => deleteJournal(journal.id)}
                >
                  🗑️
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  )}
</div>
    </main>

  </div>
);
}

export default Journal;