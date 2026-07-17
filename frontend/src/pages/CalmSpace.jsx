import React from "react";
import { Link } from "react-router-dom";

export default function CalmSpace() {
  // Mock data representing state links. Replace routes with your actual components.
  const modules = [
    {
      id: "breathing",
      title: "Breathing Exercises",
      icon: "🫁",
      badge: "Box Breathing Active",
      description: "Regulate your nervous system with rhythmic, 4-second paced box breathing intervals.",
      actionLabel: "Enter Breathing Space",
      linkTo: "/breathingspace",
      accentClass: "accent-rose"
    },
    {
      id: "grounding",
      title: "Grounding Exercise",
      icon: "🌱",
      badge: "5-4-3-2-1 Technique",
      description: "Reconnect with the physical world when your mind feels detached or racing.",
      actionLabel: "Start Grounding",
      linkTo: "/grounding",
      accentClass: "accent-sand"
    },
    {
      id: "music",
      title: "Ambient Music",
      icon: "🎵",
      badge: "Lo-Fi & Nature Sounds",
      description: "Curated gentle background soundscapes to block external sensory distractions.",
      actionLabel: "Open Audio Deck",
      linkTo: "/audio-deck",
      accentClass: "accent-moss"
    },
    {
      id: "games",
      title: "Mindful Games",
      icon: "🧩",
      badge: "Low-Stimulus Play",
      description: "Gentle puzzles and interactive stress-relief patterns designed to redirect focus.",
      actionLabel: "Play Calm Games",
      linkTo: "/games",
      accentClass: "accent-mist"
    }
  ];

  return (
    <div className="hub-page-fullscreen">
      
      {/* Decorative Warm Ambient Glow Background Filters */}
      <div className="ambient-glow-orb backdrop-left"></div>
      <div className="ambient-glow-orb backdrop-right"></div>

      {/* Header Deck */}
      <header className="hub-navbar-header">
        <div className="hub-brand-logo">Sanctuary Hub 🌱</div>
        <Link to="/dashboard" className="hub-exit-link">
          Back to Dashboard
        </Link>
      </header>

      {/* Main Narrative Welcome Summary */}
      <section className="hub-welcome-hero text-center">
        <h1>Welcome to Your Calm Space</h1>
        <p>
          Take a deep breath. Choose an anchor below based on what your body and mind need right now. There is no rush.
        </p>
      </section>

      {/* Responsive Cards Grid Layout */}
      <main className="hub-modules-grid">
        {modules.map((item) => (
          <div key={item.id} className={`hub-module-card ${item.accentClass}`}>
            <div className="hub-card-meta-row">
              <span className="hub-card-icon-emblem">{item.icon}</span>
              <span className="hub-card-badge-tag">{item.badge}</span>
            </div>

            <div className="hub-card-body-content">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>

            <Link to={item.linkTo} className="hub-card-action-trigger">
              {item.actionLabel} <span className="action-arrow">→</span>
            </Link>
          </div>
        ))}
      </main>

      {/* Direct Quick-Quote Support Anchor */}
      <footer className="hub-inline-footer-quote">
        <blockquote>
          “You don’t have to control your thoughts. You just have to stop letting them control you.”
        </blockquote>
      </footer>

    </div>
  );
}