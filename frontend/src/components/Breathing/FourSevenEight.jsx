import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./FourSevenEight.css";

export default function FourSevenEight() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Ready"); // Ready, Inhale, Hold, Exhale
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
            let nextPhase = "Inhale";
            let nextDuration = 4;

            setPhase((currentPhase) => {
              switch (currentPhase) {
                case "Ready":
                case "Exhale":
                  nextPhase = "Inhale";
                  nextDuration = 4;
                  triggerHapticFeedback([100, 50, 100]); // Awakening double-tap to breathe in
                  return "Inhale";
                case "Inhale":
                  nextPhase = "Hold";
                  nextDuration = 7;
                  triggerHapticFeedback(200); // Single deep solid bump to mark retention
                  return "Hold";
                case "Hold":
                  nextPhase = "Exhale";
                  nextDuration = 8;
                  triggerHapticFeedback([150, 100, 150]); // Swooshing dual vibration wave
                  return "Exhale";
                default:
                  return "Inhale";
              }
            });

            return nextDuration;
          }

          // In-phase tactical clock feedback ticks
          if (phase === "Inhale") {
            triggerHapticFeedback(30); // Gentle structural expansion steps
          } else if (phase === "Exhale") {
            triggerHapticFeedback([15, 40]); // Fluttering haptic release stream
          }
          // The 'Hold' phase stays entirely quiet to encourage mental stillness.

          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setPhase("Ready");
      setSecondsLeft(4);
    }

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleSession = () => {
    const turningOn = !isActive;
    setIsActive(turningOn);
    if (turningOn) {
      triggerHapticFeedback([120, 60, 120]);
      setPhase("Inhale");
      setSecondsLeft(4);
    } else {
      triggerHapticFeedback(250);
    }
  };

  const getInstructionText = () => {
    switch (phase) {
      case "Inhale": return "Breathe in quietly through your nose...";
      case "Hold": return "Suspend the breath. Keep your mind completely still.";
      case "Exhale": return "Exhale completely through your mouth making a 'whoosh' sound.";
      default: return "Exhale completely, ready your posture, and prepare to cycle.";
    }
  };

  return (
    <div className="breath-page-fullscreen">
      {/* Return Button */}
      <Link to="/breathingspace" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Breathing Spaces
      </Link>

      {/* Header Deck */}
      <div className="breath-header text-center">
        <h1>4-7-8 Breathing Room 🌌</h1>
        <p>
          A powerful physical sedative. By significantly lengthening your exhalations, you quickly clear carbon dioxide and trigger deep calm.
        </p>
      </div>

      {/* Main Breathing Canvas */}
      <div className="breath-container-card">
        
        {/* Breathing Visualizer */}
        <div className="breathing-circle-wrapper">
          <div className={`breathing-outer-ring ${isActive ? "active" : ""}`}>
            <div 
              className={`breathing-core-orb advanced-mode phase-${phase.toLowerCase()}`}
              style={{
                transform: !isActive 
                  ? "scale(0.5)" 
                  : phase === "Inhale"
                    ? `scale(${1 - (secondsLeft * 0.125)})` // Smoothly ramps up from 0.5 to 1.0 over 4 seconds
                    : phase === "Hold"
                      ? "scale(1.0)" // Maintains full chest expansion lock over 7 seconds
                      : `scale(${0.5 + (secondsLeft * 0.0625)})` // Sinks slowly backwards to 0.5 over 8 seconds
              }}
            >
              <div className="countdown-timer-display">
                {isActive ? `${secondsLeft}s` : "🌌"}
              </div>
            </div>
          </div>
        </div>

        {/* Phase State Identifier Tag */}
        <div className="breath-phase-badge-row">
          <span className={`breath-phase-badge advanced-${phase.toLowerCase()}`}>
            {phase === "Ready" ? "Prepare" : `${phase}`}
          </span>
        </div>

        {/* Instructive Context Narrative */}
        <p className="breath-instruction-narrative">
          {getInstructionText()}
        </p>

        {/* Action Button Controls */}
        <button 
          onClick={toggleSession} 
          className={`breath-action-trigger ${isActive ? "running" : ""}`}
        >
          {isActive ? "End Practice" : "Begin 4-7-8 Exercise"}
        </button>

      </div>
    </div>
  );
}