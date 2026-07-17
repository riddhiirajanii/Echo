import React from "react";
import { Link } from "react-router-dom";

export default function GamesSpace() {
  const games = [
    {
      id: "bubble-wrap",
      title: "Infinite Haptic Pop",
      badge: "Tactile Stress Relief",
      intensity: "Zero Pressure",
      description: "A mindless canvas of infinite soft-popping geometric cells to occupy anxious fingers.",
      path: "/games/bubble-pop"
    },
    {
      id: "zen-garden",
      title: "Sand Rake Simulator",
      badge: "Creative Focus",
      intensity: "Low Stimulus",
      description: "Draw endless procedural ripples in white sand. Watch them slowly fade back to undisturbed silence.",
      path: "/games/zen-garden"
    },
    {
      id: "color-match",
      title: "Gradient Flow Puzzle",
      badge: "Harmonization",
      intensity: "Mild Focus",
      description: "Re-order scrambled mosaic rows into flawless color spectrums. Highly visual, low demand.",
      path: "/games/gradient-flow"
    }
  ];

  return (
    <div className="subspace-page-container">
      <Link to="/calm-space" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Return to Calm Hub
      </Link>

      <div className="subspace-hero-header">
        <h1>Mindful Games 🧩</h1>
        <p>Gently redirect your active focus away from looping thoughts with a low-stimulus visual playground.</p>
      </div>

      <div className="subspace-items-list-layout">
        {games.map((item) => (
          <div key={item.id} className="subspace-item-row-card">
            <div className="item-row-main-content">
              <div className="item-title-meta">
                <h3>{item.title}</h3>
                <span className="item-meta-pill-tag tag-mist">{item.badge}</span>
              </div>
              <p>{item.description}</p>
              <div className="item-metrics-footprint">
                <span>⚡ {item.intensity}</span>
              </div>
            </div>
            <Link to={item.path} className="subspace-item-action-btn button-mist">
              Launch Game
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}