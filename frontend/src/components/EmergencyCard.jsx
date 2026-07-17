import "./EmergencyCard.css";

function EmergencyCard({
  response,
  helplines = []
}) {

  return (
    <div className="emergency-card">

      <div className="emergency-header">
        <div className="emergency-icon">
          💙
        </div>

        <div>
          <h2>{response.title}</h2>
          <p>
            {response.message}
          </p>
        </div>
      </div>

      <div className="emergency-actions">

        <button
          className="primary-btn"
          onClick={() => alert("Calling trusted contact...")}
        >
          Call Trusted Contact
        </button>

        {helplines.map((line, index) => (

          <a
            key={index}
            href={`tel:${line.phone}`}
            className="helpline-btn"
          >
            📞 {line.name}

            <span>
              {line.phone}
            </span>

          </a>

        ))}

      </div>

      <div className="emergency-footer">

        <button className="continue-chat-btn">
          Continue Talking With Echo
        </button>

        <p>
          You don't have to go through
          this alone. We'll stay with
          you one step at a time.
        </p>

      </div>

    </div>
  );

}

export default EmergencyCard;