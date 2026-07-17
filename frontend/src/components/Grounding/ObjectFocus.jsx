import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ObjectFocus.css";

export default function ObjectFocus() {
  const [step, setStep] = useState(0); // 0 = Picker, 1-4 = Exploration, 5 = Complete
  const [selectedAnchor, setSelectedAnchor] = useState("");

  const commonAnchors = [
    { name: "Coffee Mug / Glass", icon: "☕", type: "Smooth, cold, heavy, glossy" },
    { name: "Clothing Zipper / Button", icon: "🔩", type: "Ridged, metallic, cool, clicking" },
    { name: "Wallet / Phone Case", icon: "📱", type: "Textured, stitched, leathery, matte" },
    { name: "Desk Plant / Leaf", icon: "🌱", type: "Veined, soft, fragile, organic" },
    { name: "House Key Set", icon: "🔑", type: "Sharp, metallic, dynamic, ringing" }
  ];

  const focusPrompts = [
    {
      title: "Assess the Temperature & Mass ⚖️",
      instruction: "Rest the object flat in your palm. Close your eyes for 5 seconds and just notice how heavy it is. Is it pulling down on your hand? Is the surface cool to the touch, or has it warmed up to match your skin?",
    },
    {
      title: "Trace the Macro Contours 🔍",
      instruction: "Slowly glide your index finger along its edges. Find a corner, a ridge, or a seam. Is the transition sharp and abrupt, or seamlessly curved? Focus your entire mind purely on the millimeter where your fingerprint meets the material.",
    },
    {
      title: "Examine the Micro Texture 🪨",
      instruction: "Rub your thumb back and forth across the flat face. Is it completely frictionless and glossy, or is there a grain, friction, or microscopic grit? Notice if your thumb catches or glides smoothly.",
    },
    {
      title: "Identify a Visual Defect 👁️",
      instruction: "Bring the object close to your eyes. Look past its overall shape and search for an imperfection. Find a tiny scratch, a color gradient variation, a spec of lint, or a scuff mark. Look at it as if you are mapping a new planet.",
    }
  ];

  const triggerHaptic = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  const handleSelectAnchor = (anchorName) => {
    triggerHaptic(60);
    setSelectedAnchor(anchorName);
    setStep(1);
  };

  const handleNextPrompt = () => {
    if (step < focusPrompts.length) {
      triggerHaptic(80);
      setStep((prev) => prev + 1);
    } else {
      triggerHaptic([150, 50, 150]);
      setStep(5); // Complete
    }
  };

  return (
    <div className="anchor-page-fullscreen">
      <Link to="/grounding" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Grounding Space
      </Link>

      <div className="anchor-header text-center">
        <h1>Textured Object Anchor 🧊</h1>
        <p>Lock your consciousness onto a single, real-world point of matter until your nervous system safely resets.</p>
      </div>

      <div className="anchor-container-card">
        {step === 0 ? (
          /* --- STEP 0: SELECT AN OBJECT --- */
          <div className="anchor-flow-view">
            <h2>Pick up any object within arm's reach</h2>
            <p className="anchor-sub-narrative">
              It doesn't matter what it is—any physical object with a distinct texture will work. Select a profile below that best matches what you're holding:
            </p>
            
            <div className="anchor-options-grid">
              {commonAnchors.map((item, index) => (
                <button 
                  key={index} 
                  onClick={() => handleSelectAnchor(item.name)}
                  className="anchor-selection-tile"
                >
                  <span className="tile-icon">{item.icon}</span>
                  <div className="tile-info">
                    <h4>{item.name}</h4>
                    <span>{item.type}</span>
                  </div>
                </button>
              ))}
            </div>

            <button 
              onClick={() => handleSelectAnchor("Custom Object")} 
              className="anchor-custom-fallback-btn"
            >
              Holding something else? Start with any item 🛠️
            </button>
          </div>
        ) : step <= focusPrompts.length ? (
          /* --- STEPS 1-4: GUIDED MACRO-EXPLORATION --- */
          <div className="anchor-flow-view active-macro-step">
            <div className="anchor-progress-meta">
              Focus Phase {step} of {focusPrompts.length} • Holding: <strong>{selectedAnchor}</strong>
            </div>

            <div className="macro-prompt-billboard">
              <h3>{focusPrompts[step - 1].title}</h3>
              <p>{focusPrompts[step - 1].instruction}</p>
            </div>

            <div className="macro-tactile-reminder">
              💡 Keep manipulating the object in your fingers right now. Don't look away.
            </div>

            <button onClick={handleNextPrompt} className="anchor-primary-btn">
              {step === focusPrompts.length ? "Complete Anchor ✨" : "I've Observed This →"}
            </button>
          </div>
        ) : (
          /* --- STEP 5: RESYNCED / COMPLETE --- */
          <div className="anchor-flow-view text-center completion-state">
            <div className="anchor-celebration-emblem">⚓</div>
            <h2>Anchored Back in Reality</h2>
            <p className="anchor-sub-narrative">
              You just spent a few minutes observing reality exactly as it is. The spinning loops in your mind are internal thoughts, but this object, your breath, and the chair supporting you are solid facts. You are here.
            </p>
            
            <div className="anchor-completion-actions">
              <button onClick={() => setStep(0)} className="anchor-secondary-btn">
                Pick New Object
              </button>
              <Link to="/calmspace" className="finish-exit-link">
                Return to Calm Space
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}