import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./MuscleScan.css";

export default function BodyScan() {
  const [currentStep, setCurrentStep] = useState(0); // 0 = Intro, 1-6 = Steps, 7 = Complete
  const [timer, setTimer] = useState(0);
  const [isTensePhase, setIsTensePhase] = useState(true);

  const scanSteps = [
    {
      group: "Feet & Calves",
      tenseInstruction: "Curl your toes tightly downward and squeeze your calf muscles into a hard ball.",
      releaseInstruction: "Release entirely. Let your feet drop outwards. Feel the warm blood rushing back."
    },
    {
      group: "Thighs & Glutes",
      tenseInstruction: "Press your knees tightly together and squeeze your glute muscles hard into your seat.",
      releaseInstruction: "Let go completely. Feel your thighs become completely heavy and loose."
    },
    {
      group: "Stomach & Core",
      tenseInstruction: "Suck in your belly tightly, bracing your core as if preparing to take an impact.",
      releaseInstruction: "Relax your stomach. Let your belly soften completely. Breathe deep into your lower abdomen."
    },
    {
      group: "Hands & Arms",
      tenseInstruction: "Clench your hands into hard fists and flex your biceps, pulling your wrists up toward your chest.",
      releaseInstruction: "Unclench your fingers. Rest your palms flat on your thighs. Feel the tingling looseness."
    },
    {
      group: "Shoulders & Neck",
      tenseInstruction: "Shrug your shoulders all the way up to your ears, tensing your neck strings firmly.",
      releaseInstruction: "Drop your shoulders completely. Feel your neck lengthen as all the heavy weight dissolves away."
    },
    {
      group: "Face & Jaw",
      tenseInstruction: "Squeeze your eyes shut tightly, clench your teeth together, and scrunch your whole nose up.",
      releaseInstruction: "Relax your forehead. Unclench your jaw. Let your lips part slightly. Your face is soft."
    }
  ];

  const triggerHaptic = (pattern) => {
    if ("vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  };

  useEffect(() => {
    let interval = null;
    
    // Auto-pacing loop when inside active stages
    if (currentStep > 0 && currentStep <= scanSteps.length) {
      setTimer(5); // 5 seconds for tension phase
      setIsTensePhase(true);
      triggerHaptic([150, 80, 150]); // Warning tap sequence: Squeeze now!

      let phaseCountdown = 5;
      let stateIsTense = true;

      interval = setInterval(() => {
        phaseCountdown -= 1;
        setTimer(phaseCountdown);

        if (phaseCountdown <= 0) {
          if (stateIsTense) {
            // Shift to Release Phase (lasts 7 seconds)
            stateIsTense = false;
            setIsTensePhase(false);
            phaseCountdown = 7;
            setTimer(7);
            triggerHaptic(300); // Continuous deep long grounding rumble to drop strain
          } else {
            // Completed whole muscle unit. Clear interval, let user manually step up
            clearInterval(interval);
          }
        } else if (stateIsTense) {
          // Sharp persistent ticks during the squeezing phase to keep muscle engaged
          triggerHaptic(40); 
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [currentStep]);

  const handleNextStep = () => {
    triggerHaptic(60);
    setCurrentStep((prev) => prev + 1);
  };

  const handleReset = () => {
    triggerHaptic([100, 50, 100]);
    setCurrentStep(0);
  };

  return (
    <div className="somatic-page-fullscreen">
      <Link to="/grounding" className="back-dashboard-btn">
        <span className="back-arrow">←</span> Grounding Space
      </Link>

      <div className="somatic-header text-center">
        <h1>Progressive Body Release 🧬</h1>
        <p>Somatic muscle scanning systematically drains physical tension points to convince your brain it is safe to relax.</p>
      </div>

      <div className="somatic-container-card">
        {currentStep === 0 ? (
          /* --- INTRO VIEWS --- */
          <div className="somatic-flow-view text-center">
            <div className="somatic-emblem animate-float">🧘‍♀️</div>
            <h2>Release Stored Muscle Strain</h2>
            <p className="somatic-narrative-text">
              We will systematically move up your body. You will squeeze a specific group hard for 5 seconds, then completely dump the stress away on a 7 seconds warm release cycle.
            </p>
            <button onClick={handleNextStep} className="somatic-action-btn primary-trigger">
              Start Body Scan
            </button>
          </div>
        ) : currentStep <= scanSteps.length ? (
          /* --- ACTIVE STEP INTERACTION --- */
          <div className="somatic-flow-view">
            <div className="somatic-step-counter">
              Muscle Group {currentStep} of {scanSteps.length}
            </div>

            <h2 className="somatic-group-title">
              {scanSteps[currentStep - 1].group}
            </h2>

            {/* Dynamic Squeeze vs Release Interactive Screen */}
            <div className={`somatic-state-billboard ${isTensePhase ? "mode-squeeze" : "mode-release"}`}>
              <div className="billboard-status-tag">
                {isTensePhase ? "💥 SQUEEZE TIGHTLY" : "🍃 RELEASE COMPLETELY"}
              </div>
              <p className="billboard-instruction-details">
                {isTensePhase 
                  ? scanSteps[currentStep - 1].tenseInstruction 
                  : scanSteps[currentStep - 1].releaseInstruction}
              </p>
              {timer > 0 && (
                <div className="billboard-countdown-clock">
                  {timer}s remaining
                </div>
              )}
            </div>

            {/* Navigation Button Block */}
            <button 
              onClick={handleNextStep} 
              className="somatic-action-btn primary-trigger margin-top-large"
              disabled={timer > 0 && isTensePhase} // Don't let them bypass the squeeze cycle prematurely
            >
              {timer > 0 ? "Absorbing Wave..." : currentStep === scanSteps.length ? "Finish Scan 🎉" : "Next Muscle Group →"}
            </button>
          </div>
        ) : (
          /* --- COMPLETE CONTEXT --- */
          <div className="somatic-flow-view text-center">
            <div className="somatic-emblem">✨</div>
            <h2>Your Body is Limp & Grounded</h2>
            <p className="somatic-narrative-text">
              Notice the heavy, melting sensation in your limbs. The artificial physical stress has been evacuated. Stay here as long as you need.
            </p>
            <div className="completion-utility-row">
              <button onClick={handleReset} className="somatic-action-btn reset-btn">
                Scan Again
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