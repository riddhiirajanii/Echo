import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Ready"); // Ready, Inhale, Hold In, Exhale, Hold Out
  const [secondsLeft, setSecondsLeft] = useState(4);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            // Cycle through the 4 boxes of box breathing
            setPhase((currentPhase) => {
              switch (currentPhase) {
                case "Ready":
                case "Hold Out":
                  return "Inhale";
                case "Inhale":
                  return "Hold In";
                case "Hold In":
                  return "Exhale";
                case "Exhale":
                  return "Hold Out";
                default:
                  return "Inhale";
              }
            });
            return 4; // Reset the 4-second counter per phase
          }
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setPhase("Ready");
      setSecondsLeft(4);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleSession = () => {
    setIsActive(!isActive);
    if (!isActive) setPhase("Inhale");
  };

  // Helper properties to control visual instructions dynamically
  const getInstructionText = () => {
    switch (phase) {
      case "Inhale": return "Expand your lungs... breathe in softly";
      case "Hold In": return "Pause. Hold the stillness inside";
      case "Exhale": return "Relax your shoulders... empty completely";
      case "Hold Out": return "Pause. Rest in the quiet space";
      default: return "Find a comfortable seat and clear your mind";
    }
  };

  return (
    <div className="breath-page-fullscreen">
      
      {/* Return Button */}
      <Link to="/dashboard" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Return to Dashboard
      </Link>

      {/* Header */}
      <div className="breath-header text-center">
        <h1>Box Breathing Space 🌱</h1>
        <p>A simple, structured $4\text{s}$ cycle to down-regulate your nervous system and anchoring anxiety.</p>
      </div>

      {/* Main Breathing Canvas */}
      <div className="breath-container-card">
        
        {/* Dynamic Circle Visualizer */}
        <div className="breathing-circle-wrapper">
          <div className={`breathing-outer-ring ${isActive ? "active" : ""}`}>
            <div className={`breathing-core-orb phase-${phase.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="countdown-timer-display">
                {isActive ? `${secondsLeft}s` : "🫁"}
              </div>
            </div>
          </div>
        </div>

        {/* Phase State Identifier Tag */}
        <div className="breath-phase-badge-row">
          <span className={`breath-phase-badge ${phase.toLowerCase().replace(/\s+/g, '-')}`}>
            {phase === "Ready" ? "Centering" : phase}
          </span>
        </div>

        {/* Instructive Text Content */}
        <p className="breath-instruction-narrative">
          {getInstructionText()}
        </p>

        {/* Action Button Controls */}
        <button 
          onClick={toggleSession} 
          className={`breath-action-trigger ${isActive ? "running" : ""}`}
        >
          {isActive ? "End Practice" : "Begin Breathing"}
        </button>

      </div>

    </div>
  );
}