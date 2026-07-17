import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function DeepBreathing() {
  const INHALE_DURATION = 4;
  const EXHALE_DURATION = 6;

  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState("Ready");
  const [secondsLeft, setSecondsLeft] = useState(INHALE_DURATION);

  const triggerHapticFeedback = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        if (phase === "Inhale") {
          setPhase("Exhale");
          triggerHapticFeedback(220);
          return EXHALE_DURATION;
        }

        setPhase("Inhale");
        triggerHapticFeedback([80, 40, 80]);
        return INHALE_DURATION;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const toggleSession = () => {
    if (!isActive) {
      triggerHapticFeedback([120, 60, 120]);
      setPhase("Inhale");
      setSecondsLeft(INHALE_DURATION);
    } else {
      triggerHapticFeedback(250);
      setPhase("Ready");
      setSecondsLeft(INHALE_DURATION);
    }

    setIsActive(!isActive);
  };

  // Smooth scaling
  let scale = 0.55;

  if (isActive) {
    if (phase === "Inhale") {
      const progress =
        (INHALE_DURATION - secondsLeft) / INHALE_DURATION;

      scale = 0.55 + progress * 0.45;
    } else {
      const progress =
        (EXHALE_DURATION - secondsLeft) / EXHALE_DURATION;

      scale = 1 - progress * 0.45;
    }
  }

  const instruction = () => {
    if (!isActive)
      return "Place one hand on your belly and the other on your chest.";

    if (phase === "Inhale")
      return "Breathe deeply into your belly. Let it rise naturally.";

    return "Slowly release the breath. Relax your shoulders.";
  };

  return (
    <div className="breath-page-fullscreen">

      <Link
        to="/breathingspace"
        className="back-dashboard-btn"
      >
        ← Breathing Spaces
      </Link>

      <div className="breath-header text-center">
        <h1>Deep Belly Breathing 🪷</h1>

        <p>
          Slow diaphragmatic breathing that helps activate your
          body's relaxation response.
        </p>
      </div>

      <div className="breath-container-card">

        <div className="breathing-circle-wrapper">

          <div className="breathing-outer-ring">

            <div
              className={`breathing-core-orb deep-mode ${
                phase === "Ready"
                  ? ""
                  : `phase-${phase.toLowerCase()}`
              }`}
              style={{
                transform: `scale(${scale})`,
                transition:
                  phase === "Inhale"
                    ? "transform 4s linear"
                    : "transform 6s linear",
              }}
            >
              <div className="countdown-timer-display">
                {isActive ? `${secondsLeft}s` : "🪷"}
              </div>
            </div>

          </div>

        </div>

        <div className="breath-phase-badge-row">
          <span
            className={`breath-phase-badge ${
              phase === "Ready"
                ? ""
                : phase.toLowerCase()
            }`}
          >
            {phase === "Ready"
              ? "Ready"
              : phase === "Inhale"
              ? "Inhale"
              : "Exhale"}
          </span>
        </div>

        <p className="breath-instruction-narrative">
          {instruction()}
        </p>

        <button
          onClick={toggleSession}
          className={`breath-action-trigger ${
            isActive ? "running" : ""
          }`}
        >
          {isActive
            ? "End Practice"
            : "Begin Deep Breathing"}
        </button>

      </div>
    </div>
  );
}