import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BoxBreathing.css";

export default function BoxBreathing() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Ready"); // Ready, Inhale, Hold In, Exhale, Hold Out
  const [secondsLeft, setSecondsLeft] = useState(4);

  // Helper utility to safely trigger mobile haptics
  const triggerHapticFeedback = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsLeft((prevSeconds) => {
          if (prevSeconds <= 1) {
            // A phase transition is happening right now! 
            // We fire a single clean, grounding 180ms pulse.
            triggerHapticFeedback(180);

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
            return 4; // Reset to 4-second counter
          }

          // [OPTIONAL SUB-TICK]: A tiny 30ms heartbeat tap on every remaining second countdown tick
          triggerHapticFeedback(30);
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
    const turningOn = !isActive;
    setIsActive(turningOn);
    
    if (turningOn) {
      // Double tap vibration to signal the start of the meditation journey
      triggerHapticFeedback([100, 80, 100]);
      setPhase("Inhale");
    } else {
      // Long fading vibration to signal a peaceful exit
      triggerHapticFeedback(300);
    }
  };

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
      <Link to="/breathingspace" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Back to breathing space
      </Link>

      <div className="breath-header text-center">
        <h1>Box Breathing Space 🌱</h1>
        <p>A simple, structured cycle with subtle tactile haptic vibrations to guide you even with your eyes closed.</p>
      </div>

      <div className="breath-container-card">
        <div className="breathing-circle-wrapper">
          <div className={`breathing-outer-ring ${isActive ? "active" : ""}`}>
            <div className={`breathing-core-orb phase-${phase.toLowerCase().replace(/\s+/g, '-')}`}>
              <div className="countdown-timer-display">
                {isActive ? `${secondsLeft}s` : "🫁"}
              </div>
            </div>
          </div>
        </div>

        <div className="breath-phase-badge-row">
          <span className={`breath-phase-badge ${phase.toLowerCase().replace(/\s+/g, '-')}`}>
            {phase === "Ready" ? "Centering" : phase}
          </span>
        </div>

        <p className="breath-instruction-narrative">
          {getInstructionText()}
        </p>

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