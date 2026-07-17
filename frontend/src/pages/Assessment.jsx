import { useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import anxiety from "../data/assessments/anxiety";
import burnout from "../data/assessments/burnout";
import depression from "../data/assessments/depression";
import ocd from "../data/assessments/ocd";
import relationships from "../data/assessments/relationship";
import sleep from "../data/assessments/sleep";
import selfesteem from "../data/assessments/selfesteem";
import trauma from "../data/assessments/trauma";

// --- WELLNESS CENTER CONFIGURATION ---
const WELLNESS_CATEGORIES = [
  {
    title: "Stress & Anxiety",
    assessments: [
        anxiety
    ]
  },
  {
    title: "Mood",
    assessments: [
      depression,
      burnout
    ]
  },
  {
    title: "Relationships",
    assessments: [
      relationships
    ]
  },
  {
    title: "Trauma",
    assessments: [
      trauma
    ]
  },
  {
    title: "Compulsions",
    assessments: [
      ocd
    ]
  },
  {
    title: "Sleep",
    assessments: [
      sleep
    ]
  },
  {
    title: "Self Growth",
    assessments: [
      selfesteem
    ]
  }
];

function Assessment() {
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [answers, setAnswers] = useState([]); 
  const [loading, setLoading] = useState(false); 
  const [result, setResult] = useState(null); 
  const [currentStep, setCurrentStep] = useState(0); 

  const navigate = useNavigate(); 

  const handleStartAssessment = (assessment) => {
    console.log("Starting assessment:", assessment);
    setActiveAssessment(assessment);
    setAnswers(Array(assessment.qCount).fill(null)); 
    setCurrentStep(0);
    setResult(null);
  };

  const handleNext = () => { 
    if (activeAssessment && currentStep < activeAssessment.questions.length - 1) { 
      setCurrentStep((prev) => prev + 1); 
    }
  };

  const handleBack = () => { 
    if (currentStep > 0) { 
      setCurrentStep((prev) => prev - 1); 
    } else {
      setActiveAssessment(null);
    }
  };

  const isCurrentQuestionAnswered = answers[currentStep] !== undefined && answers[currentStep] !== null; 

  const updateAnswer = (index, value) => { 
    const updated = [...answers]; 
    updated[index] = value; 
    setAnswers(updated); 
  };

  const handleSubmit = async () => { 
    try {
      setLoading(true); 
      const token = localStorage.getItem("token"); 

      const res = await api.post( 
        "/assessment", 
        { 
            assessmentId: activeAssessment.id,
            answers 
        }, 
        {
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      setResult(res.data.assessment); 
      setAnswers(Array(activeAssessment.qCount).fill(null)); 
    } catch (error) { 
      console.error(error); 
    } finally { 
      setLoading(false); 
    }
  };

  console.log(activeAssessment);

  return (
    <div className="echo-center-layout">
      {/* Dynamic Return Header Row */}
      <header className="echo-center-topbar">
        <Link to="/dashboard" className="echo-center-back-link">
          <span className="echo-back-arrow">←</span> Return to Dashboard
        </Link>
      </header>

      {/* VIEW 1: CENTRAL DASHBOARD GRID */}
      {!activeAssessment ? (
        <div className="echo-center-dashboard animate-fade-in">
          <div className="echo-center-intro">
            <h1>Mental Wellness Center</h1>
            <p>Select a personalized check-in matrix below to calmly evaluate your baseline emotional trends.</p>
          </div>

          <div className="echo-center-categories-list">
            {WELLNESS_CATEGORIES.map((category, catIdx) => (
              <section key={catIdx} className="echo-center-group">
                <div className="echo-center-divider-row">
                  <div className="echo-center-divider-line" />
                  <h2 className="echo-center-group-title">{category.title}</h2>
                  <div className="echo-center-divider-line" />
                </div>
                
                <div className="echo-center-cards-grid">
                  {category.assessments.map((assessment, aIdx) => (
                    <div 
                      key={aIdx} 
                      className="echo-center-clickable-card"
                      onClick={() => handleStartAssessment(assessment)}
                    >
                      <div className="echo-card-front-design">
                        <span className="echo-card-title-txt">{assessment.title}</span>
                      </div>
                      
                      {(assessment.time || assessment.qCount) && (
                        <div className="echo-card-metadata-row">
                          {assessment.time && <span className="echo-card-tag">{assessment.time}</span>}
                          {assessment.time && assessment.qCount && <span className="echo-card-dot-sep">•</span>}
                          {assessment.qCount && <span className="echo-card-tag">{assessment.qCount} Questions</span>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <div className="echo-center-divider-row end-spacing">
              <div className="echo-center-divider-line" />
            </div>
          </div>
        </div>
      ) : 
      
      /* VIEW 2: RESPONSE COLLECTION SLIDER ENGINE */
      !result ? (
        <div className="echo-active-quiz-container animate-fade-in"> 
          <div className="echo-quiz-header"> 
            <h1>{activeAssessment.title} 🌱</h1> 
            <p>Reflect gently on your patterns over the last two weeks. Take all the time you need.</p> 

            {/* Structured Progress Track */}
            <div className="echo-quiz-progress-wrapper"> 
              <div className="echo-quiz-progress-track">
                <div
                  className="echo-quiz-progress-fill" 
                  style={{ width: `${((currentStep + 1) / activeAssessment.questions.length) * 100}%` }} 
                />
              </div> 
              <span className="echo-quiz-progress-counter"> 
                Question {currentStep + 1} of {activeAssessment.questions.length} 
              </span> 
            </div> 
          </div> 

          <div className="echo-quiz-body-window"> 
            <div className="echo-quiz-card-frame"> 
              <span className="echo-quiz-card-badge">Balance & Reflection</span> 
              <h3 className="echo-quiz-question-text">"{activeAssessment.questions[currentStep]}"</h3> 

              <div className="echo-quiz-options-stack"> 
                {[
                  { label: "Not at all", value: 0 }, 
                  { label: "Several days", value: 1 }, 
                  { label: "More than half the days", value: 2 }, 
                  { label: "Nearly every day", value: 3 } 
                ].map((option) => ( 
                  <label
                    key={option.value} 
                    className={`echo-quiz-option-tile ${answers[currentStep] === option.value ? "is-selected" : ""}`} 
                  > 
                    <input
                      type="radio" 
                      name={`q${currentStep}`} 
                      checked={answers[currentStep] === option.value} 
                      onChange={() => updateAnswer(currentStep, option.value)} 
                    /> 
                    <span className="echo-quiz-radio-circle"></span> 
                    <span className="echo-quiz-option-label">{option.label}</span> 
                  </label> 
                ))} 
              </div> 
            </div> 
          </div> 

          <footer className="echo-quiz-footer-actions"> 
            <button
              className="echo-quiz-btn echo-btn-secondary" 
              onClick={handleBack} 
            >
              {currentStep === 0 ? "✕ Cancel" : "← Previous"}
            </button> 

            {currentStep < activeAssessment.questions.length - 1 ? ( 
              <button
                className="echo-quiz-btn echo-btn-primary" 
                onClick={handleNext} 
                disabled={!isCurrentQuestionAnswered} 
              > 
                Next Question → 
              </button> 
            ) : (
              <button
                className="echo-quiz-btn echo-btn-submit" 
                onClick={handleSubmit} 
                disabled={loading || !isCurrentQuestionAnswered} 
              > 
                {loading ? "Analyzing responses..." : "Complete Assessment ✨"} 
              </button> 
            )} 
          </footer> 
        </div>
      ) : (
        /* VIEW 3: DISPATCHED SYSTEM SUMMARY REPORT */
        <div className="echo-report-container animate-fade-in"> 
          <div className="echo-report-art-node">🌸</div> 
          <h2>Your Reflection Report</h2> 
          <p className="echo-report-subtitle"> 
            Thank you for taking a moment to look inward. Here is your situational trend index: 
          </p> 

          <div className="echo-report-card-visual"> 
            <div className="echo-report-radial-panel"> 
              <div className="echo-report-score-num">{result.score}</div> 
              <span className="echo-report-score-label">Total Score</span> 
            </div> 
            <div className="echo-report-severity-panel"> 
              <span className="echo-report-tag-title">Current Severity Status</span> 
              <h3 className={`echo-report-severity-value ${result.severity.toLowerCase().replace(/\s+/g, "-").trim()}-pattern`}> 
                {result.severity} Pattern
              </h3> 
            </div> 
          </div> 

          <blockquote className="echo-report-disclaimer-box"> 
            <strong>A gentle reminder:</strong> This tracker is an auxiliary evaluation to aid self-awareness, not a clinical diagnosis. Keep practicing mindfulness and talk to a professional if things stay heavy. 
          </blockquote> 

          <button 
            onClick={() => setActiveAssessment(null)} 
            className="echo-report-close-action-btn"
          >
            Back to Wellness Center Menu
          </button>
        </div>
      )}
    </div>
  );
}

export default Assessment;