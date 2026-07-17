import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SensoryScan.css";

export default function SensoryScan() {
  const [currentStep, setCurrentStep] = useState(0); // 0 to 5 (0 = Intro, 5 = Complete)
  
  const scanSteps = [
    {
      count: 5,
      sense: "Sight",
      icon: "👁️",
      instruction: "Look around you. Notice and name 5 things you can see.",
      placeholder: "e.g., A shadow on the wall, a blue pen, a plant leaf...",
      colorClass: "sense-see"
    },
    {
      count: 4,
      sense: "Touch",
      icon: "🖐️",
      instruction: "Acknowledge 4 things you can physically feel right now.",
      placeholder: "e.g., The texture of your shirt, the cold desk surface, your feet on the floor...",
      colorClass: "sense-feel"
    },
    {
      count: 3,
      sense: "Hear",
      icon: "👂",
      instruction: "Listen closely. Distinguish 3 distinct sounds from your environment.",
      placeholder: "e.g., A distant car hum, air conditioning breeze, a bird chirping...",
      colorClass: "sense-hear"
    },
    {
      count: 2,
      sense: "Smell",
      icon: "👃",
      instruction: "Inhale deeply. Identify 2 different scents around you.",
      placeholder: "e.g., Fresh coffee, rain outside, wood desk, soap...",
      colorClass: "sense-smell"
    },
    {
      count: 1,
      sense: "Taste",
      icon: "👅",
      instruction: "Focus your mouth awareness. Notice 1 thing you can taste.",
      placeholder: "e.g., The lingering hint of toothpaste, clean water, or simply the neutral state of your tongue...",
      colorClass: "sense-taste"
    }
  ];

  const triggerHaptic = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleNext = () => {
    triggerHaptic(80); // Quick tap acknowledging step completion
    setCurrentStep((prev) => prev + 1);
  };

  const handleReset = () => {
    triggerHaptic([100, 50, 100]); // Soft double pulse to signal restart
    setCurrentStep(0);
  };

  return (
    <div className="grounding-page-fullscreen">
      {/* Return button */}
      <Link to="/grounding" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Grounding Space
      </Link>

      <div className="grounding-header text-center">
        <h1>Sensory Reset Room 🗺️</h1>
        <p>An anxious brain is either trapped in the future or repeating the past. Use your senses to anchor yourself firmly in the present.</p>
      </div>

      <div className="grounding-container-card">
        {currentStep === 0 ? (
          /* --- INTRO STATE --- */
          <div className="grounding-flow-view text-center">
            <div className="grounding-intro-emblem">🌱</div>
            <h2>Ready to come back down?</h2>
            <p className="grounding-narrative-text">
              We are going to slowly step through your five primary senses. Take a deep, gentle breath, scan your immediate space, and begin when you feel ready.
            </p>
            <button onClick={handleNext} className="grounding-action-btn next-step-btn">
              Begin Scan
            </button>
          </div>
        ) : currentStep <= 5 ? (
          /* --- STEP ACTIVE CONTROLS --- */
          <div className={`grounding-flow-view step-active ${scanSteps[currentStep - 1].colorClass}`}>
            
            {/* Progress indicator string bars */}
            <div className="grounding-progress-dots">
              {scanSteps.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`progress-dot ${idx < currentStep ? "filled" : ""}`}
                />
              ))}
            </div>

            <div className="sense-giant-badge">
              <span className="badge-number">{scanSteps[currentStep - 1].count}</span>
              <span className="badge-icon">{scanSteps[currentStep - 1].icon}</span>
            </div>

            <h2 className="sense-title-label">Acknowledge {scanSteps[currentStep - 1].count} Things You Can {scanSteps[currentStep - 1].sense}</h2>
            <p className="grounding-instruction-text">
              {scanSteps[currentStep - 1].instruction}
            </p>

            <div className="sense-examples-box">
              <p>{scanSteps[currentStep - 1].placeholder}</p>
            </div>

            <button onClick={handleNext} className="grounding-action-btn next-step-btn">
              {currentStep === 5 ? "Finish Reset ✨" : "I've Found Them →"}
            </button>
          </div>
        ) : (
          /* --- COMPLETE VIEW CONTEXT --- */
          <div className="grounding-flow-view text-center complete-state">
            <div className="grounding-intro-emblem">🧘‍♀️</div>
            <h2>You Are Right Here</h2>
            <p className="grounding-narrative-text">
              Your feet are on the floor. The air is entering your lungs. You are safe in your physical room, and you successfully rode out that wave.
            </p>
            <div className="completion-utility-row">
              <button onClick={handleReset} className="grounding-action-btn reset-btn">
                Repeat Exercise
              </button>
              <Link to="/grounding" className="finish-exit-link">
                Return to grounding space
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}