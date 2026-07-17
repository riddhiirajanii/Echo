import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./BreathingCircle.css";

export default function BreathingCircle() {
  const [isActive, setIsActive] = useState(false);
  const [isInhaling, setIsInhaling] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(5); // 5s inhale, 5s exhale fluid rhythm

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
            // Rhythmic shift ahead: Toggle direction
            setIsInhaling((prevDirection) => {
              const nextDirection = !prevDirection;
              
              // Trigger a distinctive double pulse when the breath shifts direction
              if (nextDirection) {
                // Expanding shift: Soft double tap
                triggerHapticFeedback([80, 50, 80]);
              } else {
                // Contracting shift: Single deeper grounding pulse
                triggerHapticFeedback(150);
              }
              return nextDirection;
            });
            return 5; // Reset to 5-second counter for the next breath stroke
          }

          // Subtle guiding tick mid-breath
          triggerHapticFeedback(20);
          return prevSeconds - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
      setIsInhaling(true);
      setSecondsLeft(5);
    }

    return () => clearInterval(interval);
  }, [isActive]);

  const toggleSession = () => {
    const turningOn = !isActive;
    setIsActive(turningOn);
    if (turningOn) {
      triggerHapticFeedback([100, 50, 100]);
    } else {
      triggerHapticFeedback(200);
    }
  };

  return (
    <div className="breath-page-fullscreen">
      {/* Return Button */}
      <Link to="/breathingspace" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Back to Breathing Space
      </Link>

      {/* Header Deck */}
      <div className="breath-header text-center">
        <h1>Breathing Circle 🪐</h1>
        <p>
          A continuous, circular wave without holding thresholds. Follow the expanding ring to soften your breathing rhythm.
        </p>
      </div>

      {/* Main Breathing Canvas */}
      <div className="breath-container-card">
        
        {/* Symmetrical Ripple Wrapper */}
        <div className="breathing-circle-wrapper">
          {/* Pulsing visual halo backing */}
          <div className={`breathing-fluid-halo ${isActive ? (isInhaling ? "expanding" : "shrinking") : "idle"}`} />
          
          <div className={`breathing-outer-ring ${isActive ? "active" : ""}`}>
            <div 
              className={`breathing-core-orb fluid-mode`}
              style={{
                transform: !isActive 
                  ? "scale(0.6)" 
                  : isInhaling 
                    ? `scale(${1 - (secondsLeft * 0.08)})` // Grows larger over time
                    : `scale(${0.6 + (secondsLeft * 0.08)})` // Shrinks smaller over time
              }}
            >
              <div className="countdown-timer-display">
                {isActive ? `${secondsLeft}s` : "✨"}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Badge Row */}
        <div className="breath-phase-badge-row">
          <span className={`breath-phase-badge ${isActive ? (isInhaling ? "inhale" : "exhale") : "centering"}`}>
            {!isActive ? "Ready" : isInhaling ? "Breathe In" : "Breathe Out"}
          </span>
        </div>

        {/* Instructive Directional Context */}
        <p className="breath-instruction-narrative">
          {!isActive 
            ? "Allow your breath to flow naturally like ocean waves." 
            : isInhaling 
              ? "Fill your chest and belly cleanly... matching the expansion." 
              : "Let it all dissolve. Softly release the air."}
        </p>

        {/* Action Button Controls */}
        <button 
          onClick={toggleSession} 
          className={`breath-action-trigger ${isActive ? "running" : ""}`}
        >
          {isActive ? "End Practice" : "Begin Fluid Flow"}
        </button>

      </div>
    </div>
  );
}