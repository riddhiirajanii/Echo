from flask import Flask, request, jsonify
from flask_cors import CORS

from transformers import pipeline


app = Flask(__name__)
CORS(app)
# allows service to accept requests from any origin

print("Loading sentiment analysis model...")

sentiment_model = pipeline(
    "sentiment-analysis"
)

print("Loading emotion model...")

emotion_model = pipeline(
    "text-classification",
    model="j-hartmann/emotion-english-distilroberta-base",
    top_k=None
)

print("NLP models loaded successfully.")

def analyze_sentiment(text):

    result = sentiment_model(
        text[:512]
    )[0]

    return {
        "label": result["label"],
        "score": round(result["score"], 4)  
    }

def analyze_emotions(text):

    results = emotion_model(
        text[:512]
    )[0]

    emotions = {}

    for result in results:

        label = result["label"]

        score = result["score"]

        emotions[label] = round(
            score,
            4
        )

    # Find strongest emotion
    dominant_emotion = max(
        emotions,
        key=emotions.get
    )

    return {
        "dominant": dominant_emotion,
        "scores": emotions
    }

def analyze_text(text):

    if not text or not text.strip():

        return {
            "sentiment": {
                "label": "NEUTRAL",
                "score": 0
            },

            "emotion": {
                "dominant": "neutral",
                "scores": {}
            }
        }


    sentiment = analyze_sentiment(
        text
    )

    emotion = analyze_emotions(
        text
    )


    return {

        "sentiment": sentiment,

        "emotion": emotion

    }


# ============================================================
# Analyze API
# ============================================================

@app.route(
    "/analyze",
    methods=["POST"]
)
def analyze():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "success": False,
                "message": "Request body is required."
            }), 400


        text = data.get(
            "text",
            ""
        )


        if not text or not text.strip():

            return jsonify({
                "success": False,
                "message": "Text is required."
            }), 400


        result = analyze_text(
            text
        )


        return jsonify({

            "success": True,

            "result": result

        })


    except Exception as error:

        print(
            "NLP error:",
            error
        )

        return jsonify({

            "success": False,

            "message":
                "NLP analysis failed."

        }), 500


# ============================================================
# Health check
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def health():

    return jsonify({

        "success": True,

        "service":
            "Echo NLP Service",

        "status":
            "running"

    })


# ============================================================
# Start server
# ============================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5001,

        debug=True

    )