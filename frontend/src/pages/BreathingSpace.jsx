import React from "react";
import { Link } from "react-router-dom";

export default function BreathingSpace() {
  const techniques = [
    {
      id: "box-breathing",
      title: "Box Breathing",
      badge: "4s-4s-4s-4s",
      duration: "4 mins",
      difficulty: "Beginner",
      description: "Clear your mind and stabilize intense adrenaline spikes using the symmetrical square method.",
      path: "/breathing/boxbreathing"
    },
    {
      id: "breathing-circle",
      title: "Breathing Circle",
      badge: "Fluid Flow",
      duration: "5 mins",
      difficulty: "Intuitive",
      description: "Follow a seamless, expanding organic ring to cultivate fluid pacing without timed retention pauses.",
      path: "/breathing/breathingcircle"
    },
    {
      id: "deep-breathing",
      title: "Deep Belly Breathing",
      badge: "Diaphragmatic",
      duration: "3 mins",
      difficulty: "Restorative",
      description: "Activate your vagus nerve by anchoring your breath deeply down into your diaphragm.",
      path: "/breathing/deep"
    },
    {
      id: "four-seven-eight",
      title: "4-7-8 Technique",
      badge: "Natural Sedative",
      duration: "5 mins",
      difficulty: "Advanced",
      description: "Drift into deep physical relaxation or prepare for sleep by extending your carbon dioxide exhalation frame.",
      path: "/breathing/478"
    }
  ];

  return (
    <div className="subspace-page-container">
      <Link to="/calmspace" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Return to Calm Space
      </Link>

      <div className="subspace-hero-header">
        <h1>Breathing Spaces 🌱</h1>
        <p>Regulate your physiological response system. Select a pace that feels comfortable right now.</p>
      </div>

      <div className="subspace-items-list-layout">
        {techniques.map((item) => (
          <div key={item.id} className="subspace-item-row-card">
            <div className="item-row-main-content">
              <div className="item-title-meta">
                <h3>{item.title}</h3>
                <span className="item-meta-pill-tag tag-rose">{item.badge}</span>
              </div>
              <p>{item.description}</p>
              <div className="item-metrics-footprint">
                <span>⏱️ {item.duration}</span>
                <span className="divider-dot">•</span>
                <span>📊 {item.difficulty}</span>
              </div>
            </div>
            <Link to={item.path} className="subspace-item-action-btn button-rose">
              Begin Session
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}