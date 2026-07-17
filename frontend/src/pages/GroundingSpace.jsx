import React from "react";
import { Link } from "react-router-dom";

export default function GroundingSpace() {
  const techniques = [
    {
      id: "five-four-three-two-one",
      title: "5-4-3-2-1 Sensory Scan",
      badge: "Mindfulness",
      duration: "5 mins",
      description: "Acknowledge surroundings using your 5 physical senses to dissolve acute detachment and dissociation ripples.",
      path: "/grounding/sensory-scan"
    },
    {
      id: "body-scan",
      title: "Progressive Muscle Scan",
      badge: "Somatic Release",
      duration: "7 mins",
      description: "Locate stress points and systematically release stored somatic tension from your muscles.",
      path: "/grounding/muscle-scan"
    },
    {
      id: "object-focus",
      title: "The Textured Object Anchor",
      badge: "Tactile",
      duration: "3 mins",
      description: "Study an ordinary physical artifact with intense macro-focus to pull an anxious spiral back to reality.",
      path: "/grounding/object-focus"
    }
  ];

  return (
    <div className="subspace-page-container">
      <Link to="/calmspace" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Return to Calm Space
      </Link>

      <div className="subspace-hero-header">
        <h1>Grounding Techniques 🌱</h1>
        <p>When thoughts become overwhelming or detached, utilize these anchors to gently find your physical center.</p>
      </div>

      <div className="subspace-items-list-layout">
        {techniques.map((item) => (
          <div key={item.id} className="subspace-item-row-card">
            <div className="item-row-main-content">
              <div className="item-title-meta">
                <h3>{item.title}</h3>
                <span className="item-meta-pill-tag tag-sand">{item.badge}</span>
              </div>
              <p>{item.description}</p>
              <div className="item-metrics-footprint">
                <span>⏱️ {item.duration}</span>
              </div>
            </div>
            <Link to={item.path} className="subspace-item-action-btn button-sand">
              Start Anchor
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}