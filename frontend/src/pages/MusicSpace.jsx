import React from "react";
import { Link } from "react-router-dom";

export default function MusicSpace() {
  const streams = [
    {
      id: "lofi-beats",
      title: "Cozy Lo-Fi Study Companion",
      badge: "Focus Ambient",
      duration: "Continuous",
      description: "Subtle, rhythmic vinyl-crackle beats perfect for maintaining passive focus without words.",
      path: "/audio-deck/lofi"
    },
    {
      id: "rain-forest",
      title: "Solitary Forest Rainstorm",
      badge: "Nature Sounds",
      duration: "Continuous",
      description: "Organic field recordings of soft rainfall filtering through canvas canopies and distant wind leaves.",
      path: "/audio-deck/rain"
    },
    {
      id: "binaural-waves",
      title: "Theta Binaural Waves ($6\text{Hz}$)",
      badge: "Brainwave Sync",
      duration: "45 mins",
      description: "Sustained sub-frequencies calibrated to settle hyperactive overthinking patterns.",
      path: "/audio-deck/binaural"
    }
  ];

  return (
    <div className="subspace-page-container">
      <Link to="/calm-space" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Return to Calm Hub
      </Link>

      <div className="subspace-hero-header">
        <h1>Ambient Audio Deck 🎵</h1>
        <p>Block out raw acoustic interference and construct a soft, protective blanket of audio around you.</p>
      </div>

      <div className="subspace-items-list-layout">
        {streams.map((item) => (
          <div key={item.id} className="subspace-item-row-card">
            <div className="item-row-main-content">
              <div className="item-title-meta">
                <h3>{item.title}</h3>
                <span className="item-meta-pill-tag tag-moss">{item.badge}</span>
              </div>
              <p>{item.description}</p>
              <div className="item-metrics-footprint">
                <span>⏱️ {item.duration}</span>
              </div>
            </div>
            <Link to={item.path} className="subspace-item-action-btn button-moss">
              Tune In
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}