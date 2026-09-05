"""
ECHO - User Condition Engine
============================

The two ML models have already been trained separately:

    journal_emotion_multilabel_classifier.joblib
    chat_multilabel_classifier.joblib

This file DOES NOT use the training CSVs.

Instead, it accepts NEW user journal entries and NEW chat
messages, runs the trained models, stores their predictions,
and determines the user's emotional condition over time.

Pipeline:

    NEW JOURNAL TEXT
          ↓
    Journal Model
          ↓
    Emotion probabilities
          │
          │
          ├──────────────┐
          │              │
          ▼              ▼
    Condition Engine  Safety Pathway
          ▲
          │
          │
    Chat Model
          ▲
          │
    NEW CHAT TEXT


Condition levels:

    INSUFFICIENT_DATA
    STABLE
    MILD_CONCERN
    MODERATE_CONCERN
    HIGH_CONCERN

Safety is handled separately:

    SAFETY_REVIEW

IMPORTANT:
This is an emotional-state / wellbeing signal system.
It is NOT a medical diagnosis or clinical risk assessment.
"""


import joblib
import numpy as np

from datetime import datetime


# ============================================================
# MODEL PATHS
# ============================================================

JOURNAL_MODEL_PATH = (
    "journal_emotion_multilabel_classifier.joblib"
)

CHAT_MODEL_PATH = (
    "chat_multilabel_classifier.joblib"
)


# ============================================================
# SETTINGS
# ============================================================

DEFAULT_THRESHOLD = 0.50

# Minimum number of observations before a condition
# can be determined.
MIN_OBSERVATIONS = 5

# Number of most recent observations considered.
#
# Example:
#
# 20 observations available
#       ↓
# only latest 20 are considered
#
# Set to None to use all observations.
ANALYSIS_WINDOW = 20


# ============================================================
# EMOTIONS
# ============================================================

EMOTIONS = [
    "angry",
    "anxious",
    "happy",
    "neutral",
    "sad",
    "suicidal"
]


# These emotions contribute to general distress.
#
# suicidal is intentionally NOT included here.
DISTRESS_EMOTIONS = [
    "angry",
    "anxious",
    "sad"
]


# ============================================================
# MODEL CLASS
# ============================================================

class EmotionModel:

    def __init__(self, model_path):

        self.model_path = model_path

        # Load trained model bundle
        bundle = joblib.load(model_path)

        self.vectorizer = bundle["vectorizer"]
        self.model = bundle["model"]
        self.mlb = bundle["mlb"]

        print(
            f"Loaded model: {model_path}"
        )

        print(
            "Labels:",
            list(self.mlb.classes_)
        )


    def predict(
        self,
        text,
        threshold=DEFAULT_THRESHOLD
    ):
        """
        Predict emotions for one NEW text.

        Returns:

        {
            "emotions": [...],
            "probabilities": {
                "angry": ...,
                "anxious": ...,
                ...
            }
        }
        """

        if not isinstance(text, str):

            text = str(text)


        text = text.strip()


        if not text:

            raise ValueError(
                "Text cannot be empty."
            )


        # ----------------------------------------------------
        # TF-IDF transformation
        # ----------------------------------------------------

        X = self.vectorizer.transform(
            [text]
        )


        # ----------------------------------------------------
        # Model probabilities
        # ----------------------------------------------------

        probabilities = (
            self.model.predict_proba(X)[0]
        )


        emotion_probabilities = {}


        for emotion, probability in zip(
            self.mlb.classes_,
            probabilities
        ):

            emotion_probabilities[
                emotion
            ] = float(probability)


        # ----------------------------------------------------
        # Multi-label prediction
        # ----------------------------------------------------

        predicted_emotions = [

            emotion

            for emotion, probability
            in emotion_probabilities.items()

            if probability >= threshold
        ]


        # If nothing crosses the threshold,
        # return the strongest emotion.
        if not predicted_emotions:

            strongest_emotion = max(
                emotion_probabilities,
                key=emotion_probabilities.get
            )

            predicted_emotions = [
                strongest_emotion
            ]


        return {

            "emotions":
                predicted_emotions,

            "probabilities":
                emotion_probabilities
        }


# ============================================================
# CONDITION ENGINE
# ============================================================

class ConditionEngine:

    def __init__(self):

        print("\n")
        print("=" * 60)
        print("              ECHO CONDITION ENGINE")
        print("=" * 60)
        print()


        # ----------------------------------------------------
        # Load TRAINED models
        # ----------------------------------------------------

        self.journal_model = EmotionModel(
            JOURNAL_MODEL_PATH
        )


        self.chat_model = EmotionModel(
            CHAT_MODEL_PATH
        )


        # ----------------------------------------------------
        # Prediction history
        # ----------------------------------------------------
        #
        # This is NOT training data.
        #
        # It contains predictions generated from NEW
        # user activity.
        #
        # Example:
        #
        # [
        #   {
        #       "source": "journal",
        #       "timestamp": "...",
        #       "probabilities": {...}
        #   },
        #
        #   {
        #       "source": "chat",
        #       "timestamp": "...",
        #       "probabilities": {...}
        #   }
        # ]
        #

        self.history = []


        print(
            "\nECHO Condition Engine ready.\n"
        )


    # ========================================================
    # ANALYZE NEW JOURNAL ENTRY
    # ========================================================

    def analyze_journal(
        self,
        text,
        timestamp=None
    ):

        result = self.journal_model.predict(
            text
        )


        observation = {

            "source":
                "journal",

            "timestamp":
                timestamp
                or datetime.now().isoformat(),

            "text":
                text,

            "probabilities":
                result["probabilities"],

            "emotions":
                result["emotions"]
        }


        # Add to user's history
        self.history.append(
            observation
        )


        return observation


    # ========================================================
    # ANALYZE NEW CHAT MESSAGE
    # ========================================================

    def analyze_chat(
        self,
        text,
        timestamp=None
    ):

        result = self.chat_model.predict(
            text
        )


        observation = {

            "source":
                "chat",

            "timestamp":
                timestamp
                or datetime.now().isoformat(),

            "text":
                text,

            "probabilities":
                result["probabilities"],

            "emotions":
                result["emotions"]
        }


        # Add to user's history
        self.history.append(
            observation
        )


        return observation


    # ========================================================
    # GET PROBABILITY
    # ========================================================

    def _get_probability(
        self,
        observation,
        emotion
    ):

        return observation[
            "probabilities"
        ].get(
            emotion,
            0.0
        )


    # ========================================================
    # AVERAGE EMOTION PROBABILITIES
    # ========================================================

    def _average_probabilities(
        self,
        observations
    ):

        if not observations:

            return {

                emotion:
                    0.0

                for emotion
                in EMOTIONS
            }


        result = {}


        for emotion in EMOTIONS:

            values = [

                self._get_probability(
                    observation,
                    emotion
                )

                for observation
                in observations
            ]


            result[
                emotion
            ] = float(
                np.mean(values)
            )


        return result


    # ========================================================
    # CURRENT EMOTIONAL STATE
    # ========================================================

    def calculate_emotional_state(
        self,
        observations
    ):

        return self._average_probabilities(
            observations
        )


    # ========================================================
    # PERSISTENCE
    # ========================================================

    def calculate_persistence(
        self,
        observations,
        threshold=DEFAULT_THRESHOLD
    ):
        """
        Measures how frequently an emotion is elevated.

        Example:

            anxious:
            0.72
            0.80
            0.35
            0.61
            0.70

            persistence = 4/5 = 0.80
        """

        if not observations:

            return {

                emotion:
                    0.0

                for emotion
                in EMOTIONS
            }


        persistence = {}


        for emotion in EMOTIONS:

            values = [

                self._get_probability(
                    observation,
                    emotion
                )

                for observation
                in observations
            ]


            elevated = sum(

                value >= threshold

                for value in values
            )


            persistence[
                emotion
            ] = round(

                elevated / len(values),

                3
            )


        return persistence


    # ========================================================
    # TREND
    # ========================================================

    def calculate_trends(
        self,
        observations
    ):
        """
        Compares the older half of observations with
        the newer half.

        Positive:
            emotion increasing

        Negative:
            emotion decreasing

        Near zero:
            stable
        """

        if len(observations) < 2:

            return {

                emotion:
                    0.0

                for emotion
                in EMOTIONS
            }


        midpoint = (
            len(observations) // 2
        )


        older = observations[
            :midpoint
        ]


        recent = observations[
            midpoint:
        ]


        older_average = (
            self._average_probabilities(
                older
            )
        )


        recent_average = (
            self._average_probabilities(
                recent
            )
        )


        trends = {}


        for emotion in EMOTIONS:

            trends[
                emotion
            ] = round(

                recent_average[
                    emotion
                ]
                -
                older_average[
                    emotion
                ],

                3
            )


        return trends


    # ========================================================
    # VOLATILITY
    # ========================================================

    def calculate_volatility(
        self,
        observations
    ):
        """
        Measures how much an emotion fluctuates.
        """

        if len(observations) < 2:

            return {

                emotion:
                    0.0

                for emotion
                in EMOTIONS
            }


        volatility = {}


        for emotion in EMOTIONS:

            values = [

                self._get_probability(
                    observation,
                    emotion
                )

                for observation
                in observations
            ]


            volatility[
                emotion
            ] = round(

                float(
                    np.std(values)
                ),

                3
            )


        return volatility


    # ========================================================
    # JOURNAL / CHAT AGREEMENT
    # ========================================================

    def calculate_cross_source_agreement(
        self,
        observations
    ):
        """
        Compares emotional patterns detected in:

            Journal entries

        versus

            Chat messages
        """

        journal = [

            observation

            for observation
            in observations

            if observation[
                "source"
            ] == "journal"
        ]


        chat = [

            observation

            for observation
            in observations

            if observation[
                "source"
            ] == "chat"
        ]


        # Need both sources
        if not journal or not chat:

            return {

                "available":
                    False,

                "score":
                    None
            }


        journal_average = (
            self._average_probabilities(
                journal
            )
        )


        chat_average = (
            self._average_probabilities(
                chat
            )
        )


        differences = []


        for emotion in EMOTIONS:

            difference = abs(

                journal_average[
                    emotion
                ]
                -
                chat_average[
                    emotion
                ]
            )


            differences.append(
                difference
            )


        mean_difference = np.mean(
            differences
        )


        agreement = (
            1.0
            -
            mean_difference
        )


        return {

            "available":
                True,

            "score":
                round(
                    float(
                        agreement
                    ),
                    3
                ),

            "journal":
                journal_average,

            "chat":
                chat_average
        }


    # ========================================================
    # MIXED EMOTION DETECTION
    # ========================================================

    def detect_mixed_emotions(
        self,
        emotional_state,
        threshold=0.40
    ):
        """
        Detects multiple simultaneously elevated emotions.

        Examples:

            sad + anxious
            anxious + angry
            happy + sad
            happy + anxious
        """

        active_emotions = [

            emotion

            for emotion in EMOTIONS

            if emotion != "suicidal"

            and emotional_state.get(
                emotion,
                0.0
            ) >= threshold
        ]


        return {

            "is_mixed":
                len(active_emotions) >= 2,

            "emotions":
                active_emotions
        }


    # ========================================================
    # SAFETY PATHWAY
    # ========================================================

    def calculate_safety(
        self,
        observations
    ):
        """
        Suicidal probability is completely separated from
        the general distress score.

        This is a model-generated signal only.
        """

        if not observations:

            return {

                "signal":
                    False,

                "maximum_probability":
                    0.0,

                "average_probability":
                    0.0,

                "observations_above_threshold":
                    0
            }


        values = [

            self._get_probability(
                observation,
                "suicidal"
            )

            for observation
            in observations
        ]


        maximum_probability = max(
            values
        )


        average_probability = np.mean(
            values
        )


        # Model flag threshold.
        #
        # NOT a clinical threshold.
        SAFETY_THRESHOLD = 0.50


        observations_above_threshold = sum(

            value >= SAFETY_THRESHOLD

            for value in values
        )


        signal = (
            maximum_probability
            >= SAFETY_THRESHOLD
        )


        return {

            "signal":
                bool(signal),

            "maximum_probability":
                round(
                    float(
                        maximum_probability
                    ),
                    3
                ),

            "average_probability":
                round(
                    float(
                        average_probability
                    ),
                    3
                ),

            "observations_above_threshold":
                int(
                    observations_above_threshold
                )
        }


    # ========================================================
    # DISTRESS SCORE
    # ========================================================

    def calculate_distress_score(
        self,
        emotional_state,
        persistence,
        trends,
        agreement
    ):
        """
        General distress score.

        suicidal is NOT included.

        Components:

            Current distress  = 45%
            Persistence       = 25%
            Worsening trend   = 20%
            Source agreement  = 10%
        """

        # ----------------------------------------------------
        # Current distress
        # ----------------------------------------------------

        current_distress = np.mean([

            emotional_state.get(
                emotion,
                0.0
            )

            for emotion
            in DISTRESS_EMOTIONS
        ])


        # ----------------------------------------------------
        # Persistence
        # ----------------------------------------------------

        persistence_score = np.mean([

            persistence.get(
                emotion,
                0.0
            )

            for emotion
            in DISTRESS_EMOTIONS
        ])


        # ----------------------------------------------------
        # Worsening trend
        # ----------------------------------------------------

        worsening_trend = np.mean([

            max(

                trends.get(
                    emotion,
                    0.0
                ),

                0.0
            )

            for emotion
            in DISTRESS_EMOTIONS
        ])


        # ----------------------------------------------------
        # Agreement
        # ----------------------------------------------------

        if agreement["available"]:

            agreement_score = (
                agreement["score"]
            )

        else:

            agreement_score = 0.5


        # ----------------------------------------------------
        # Final score
        # ----------------------------------------------------

        score = (

            0.45
            * current_distress

            +

            0.25
            * persistence_score

            +

            0.20
            * worsening_trend

            +

            0.10
            * agreement_score
        )


        return round(
            float(score),
            3
        )


    # ========================================================
    # CONDITION DETERMINATION
    # ========================================================

    def determine_condition(
    self,
    distress_score,
    trends,
    persistence,
    safety
):

    # --------------------------------------------------------
    # SAFETY
    # --------------------------------------------------------

        if safety["signal"]:
            return "SAFETY_REVIEW"


        # --------------------------------------------------------
        # Distress trends
        # --------------------------------------------------------

        distress_trends = [
            trends.get(
                emotion,
                0.0
            )
            for emotion in DISTRESS_EMOTIONS
        ]

        strongest_trend = max(
            distress_trends
        )


        # --------------------------------------------------------
        # Persistence
        # --------------------------------------------------------

        distress_persistence = [
            persistence.get(
                emotion,
                0.0
            )
            for emotion in DISTRESS_EMOTIONS
        ]

        strongest_persistence = max(
            distress_persistence
        )


        # --------------------------------------------------------
        # HIGH CONCERN
        # --------------------------------------------------------

        if distress_score >= 0.70:
            return "HIGH_CONCERN"


        # --------------------------------------------------------
        # MODERATE CONCERN
        # --------------------------------------------------------

        # Moderate distress that is also worsening
        if (
            distress_score >= 0.40
            and strongest_trend >= 0.15
        ):
            return "MODERATE_CONCERN"


        # Persistent moderate/high distress
        if (
            strongest_persistence >= 0.60
            and distress_score >= 0.40
        ):
            return "MODERATE_CONCERN"


        # --------------------------------------------------------
        # MILD CONCERN
        # --------------------------------------------------------

        # Low current distress but clearly worsening
        if strongest_trend >= 0.10:
            return "MILD_CONCERN"


        # Some persistent distress
        if (
            strongest_persistence >= 0.40
            and distress_score >= 0.25
        ):
            return "MILD_CONCERN"


        # --------------------------------------------------------
        # STABLE
        # --------------------------------------------------------

        return "STABLE"


    # ========================================================
    # COMPLETE USER ANALYSIS
    # ========================================================

    def analyze_user(
        self,
        observations=None,
        window=ANALYSIS_WINDOW
    ):
        """
        Analyze the current user.

        If observations is not supplied,
        self.history is used.

        window:
            Number of most recent observations to analyze.
        """

        # ----------------------------------------------------
        # Get observations
        # ----------------------------------------------------

        if observations is None:

            observations = (
                self.history.copy()
            )


        # ----------------------------------------------------
        # Sort by timestamp
        # ----------------------------------------------------

        observations = sorted(

            observations,

            key=lambda x:
                x.get(
                    "timestamp",
                    ""
                )
        )


        # ----------------------------------------------------
        # Apply analysis window
        # ----------------------------------------------------

        if window is not None:

            observations = observations[
                -window:
            ]


        # ----------------------------------------------------
        # Minimum observations
        # ----------------------------------------------------

        if len(observations) < MIN_OBSERVATIONS:

            return {

                "condition":
                    "INSUFFICIENT_DATA",

                "message":
                    (
                        f"Need at least "
                        f"{MIN_OBSERVATIONS} "
                        f"observations."
                    ),

                "observations_used":
                    len(observations)
            }


        # ----------------------------------------------------
        # Emotional state
        # ----------------------------------------------------

        emotional_state = (
            self.calculate_emotional_state(
                observations
            )
        )


        # ----------------------------------------------------
        # Persistence
        # ----------------------------------------------------

        persistence = (
            self.calculate_persistence(
                observations
            )
        )


        # ----------------------------------------------------
        # Trends
        # ----------------------------------------------------

        trends = (
            self.calculate_trends(
                observations
            )
        )


        # ----------------------------------------------------
        # Volatility
        # ----------------------------------------------------

        volatility = (
            self.calculate_volatility(
                observations
            )
        )


        # ----------------------------------------------------
        # Journal/chat agreement
        # ----------------------------------------------------

        agreement = (
            self.calculate_cross_source_agreement(
                observations
            )
        )


        # ----------------------------------------------------
        # Mixed emotions
        # ----------------------------------------------------

        mixed = (
            self.detect_mixed_emotions(
                emotional_state
            )
        )


        # ----------------------------------------------------
        # Safety
        # ----------------------------------------------------

        safety = (
            self.calculate_safety(
                observations
            )
        )


        # ----------------------------------------------------
        # Distress score
        # ----------------------------------------------------

        distress_score = (
            self.calculate_distress_score(
                emotional_state,
                persistence,
                trends,
                agreement
            )
        )


        # ----------------------------------------------------
        # Condition
        # ----------------------------------------------------

        condition = (
            self.determine_condition(
                distress_score,
                trends,
                persistence,
                safety
            )
        )


        # ----------------------------------------------------
        # Dominant emotion
        # ----------------------------------------------------

        non_suicidal = {

            emotion:
                probability

            for emotion, probability
            in emotional_state.items()

            if emotion != "suicidal"
        }


        dominant_emotion = max(
            non_suicidal,
            key=non_suicidal.get
        )


        # ----------------------------------------------------
        # Dominant trend
        # ----------------------------------------------------

        distress_trends = {

            emotion:
                trends.get(
                    emotion,
                    0.0
                )

            for emotion
            in DISTRESS_EMOTIONS
        }


        dominant_trend_emotion = max(
            distress_trends,
            key=distress_trends.get
        )


        dominant_trend_value = (
            distress_trends[
                dominant_trend_emotion
            ]
        )


        # ----------------------------------------------------
        # Overall trend
        # ----------------------------------------------------

        if dominant_trend_value >= 0.10:

            overall_trend = (
                "WORSENING"
            )

        elif dominant_trend_value <= -0.10:

            overall_trend = (
                "IMPROVING"
            )

        else:

            overall_trend = (
                "STABLE"
            )


        # ----------------------------------------------------
        # Source counts
        # ----------------------------------------------------

        journal_count = sum(

            observation[
                "source"
            ] == "journal"

            for observation
            in observations
        )


        chat_count = sum(

            observation[
                "source"
            ] == "chat"

            for observation
            in observations
        )


        # ----------------------------------------------------
        # Final result
        # ----------------------------------------------------

        return {

            "condition":
                condition,

            "distress_score":
                distress_score,

            "overall_trend":
                overall_trend,

            "dominant_emotion":
                dominant_emotion,

            "dominant_emotion_probability":
                round(
                    emotional_state[
                        dominant_emotion
                    ],
                    3
                ),

            "dominant_trend_emotion":
                dominant_trend_emotion,

            "dominant_trend_value":
                round(
                    float(
                        dominant_trend_value
                    ),
                    3
                ),

            "emotional_state":
                emotional_state,

            "trends":
                trends,

            "persistence":
                persistence,

            "volatility":
                volatility,

            "mixed_emotions":
                mixed,

            "cross_source_agreement":
                agreement,

            "safety":
                safety,

            "journal_observations":
                journal_count,

            "chat_observations":
                chat_count,

            "observations_used":
                len(observations)
        }


# ============================================================
# PRINT ANALYSIS
# ============================================================

def print_analysis(result):

    print("\n")

    print("=" * 60)
    print("                 ECHO USER STATE")
    print("=" * 60)


    # --------------------------------------------------------
    # Condition
    # --------------------------------------------------------

    print(
        f"\nCondition: "
        f"{result['condition']}"
    )


    # --------------------------------------------------------
    # Insufficient data
    # --------------------------------------------------------

    if (
        result["condition"]
        == "INSUFFICIENT_DATA"
    ):

        print(
            f"\n{result['message']}"
        )

        print(
            f"Observations used: "
            f"{result['observations_used']}"
        )

        print("=" * 60)

        return


    # --------------------------------------------------------
    # Distress
    # --------------------------------------------------------

    print(
        f"Distress score: "
        f"{result['distress_score']:.3f}"
    )


    # --------------------------------------------------------
    # Overall trend
    # --------------------------------------------------------

    print(
        f"Overall trend: "
        f"{result['overall_trend']}"
    )


    print(
        f"Dominant trend emotion: "
        f"{result['dominant_trend_emotion']}"
    )


    # --------------------------------------------------------
    # Dominant emotion
    # --------------------------------------------------------

    print(
        f"Dominant emotion: "
        f"{result['dominant_emotion']}"
    )


    # --------------------------------------------------------
    # Emotion probabilities
    # --------------------------------------------------------

    print(
        "\nEmotion probabilities:"
    )


    for emotion, probability in sorted(

        result[
            "emotional_state"
        ].items(),

        key=lambda x:
            x[1],

        reverse=True
    ):

        print(

            f"  {emotion:10s}: "
            f"{probability:.3f}"
        )


    # --------------------------------------------------------
    # Trends
    # --------------------------------------------------------

    print(
        "\nTrends:"
    )


    for emotion in EMOTIONS:

        value = result[
            "trends"
        ][emotion]


        if value >= 0.10:

            label = "increasing"

        elif value <= -0.10:

            label = "decreasing"

        else:

            label = "stable"


        print(

            f"  {emotion:10s}: "
            f"{label:10s} "
            f"({value:+.3f})"
        )


    # --------------------------------------------------------
    # Persistence
    # --------------------------------------------------------

    print(
        "\nPersistence:"
    )


    for emotion in EMOTIONS:

        value = result[
            "persistence"
        ][emotion]


        if value >= 0.70:

            label = "high"

        elif value >= 0.40:

            label = "moderate"

        else:

            label = "low"


        print(

            f"  {emotion:10s}: "
            f"{label:10s} "
            f"({value:.3f})"
        )


    # --------------------------------------------------------
    # Volatility
    # --------------------------------------------------------

    print(
        "\nVolatility:"
    )


    for emotion, value in sorted(

        result[
            "volatility"
        ].items(),

        key=lambda x:
            x[1],

        reverse=True
    ):

        print(

            f"  {emotion:10s}: "
            f"{value:.3f}"
        )


    # --------------------------------------------------------
    # Mixed emotions
    # --------------------------------------------------------

    mixed = result[
        "mixed_emotions"
    ]


    print(
        "\nMixed emotional state:"
    )


    print(
        f"  Detected: "
        f"{mixed['is_mixed']}"
    )


    if mixed["emotions"]:

        print(
            f"  Emotions: "
            f"{', '.join(mixed['emotions'])}"
        )


    # --------------------------------------------------------
    # Journal / Chat agreement
    # --------------------------------------------------------

    agreement = result[
        "cross_source_agreement"
    ]


    print(
        "\nJournal / Chat agreement:"
    )


    if agreement["available"]:

        print(
            f"  Score: "
            f"{agreement['score']:.3f}"
        )

    else:

        print(
            "  Not available "
            "(only one source)"
        )


    # --------------------------------------------------------
    # Safety
    # --------------------------------------------------------

    safety = result[
        "safety"
    ]


    print(
        "\nSafety pathway:"
    )


    print(
        f"  Signal: "
        f"{safety['signal']}"
    )


    print(
        f"  Maximum suicidal probability: "
        f"{safety['maximum_probability']:.3f}"
    )


    print(
        f"  Average suicidal probability: "
        f"{safety['average_probability']:.3f}"
    )


    # --------------------------------------------------------
    # Sources
    # --------------------------------------------------------

    print(
        "\nObservations:"
    )


    print(
        f"  Journal: "
        f"{result['journal_observations']}"
    )


    print(
        f"  Chat: "
        f"{result['chat_observations']}"
    )


    print(
        f"  Total: "
        f"{result['observations_used']}"
    )


    print("=" * 60)
    print()


# ============================================================
# DEMO / TEST
# ============================================================

def main():

    # --------------------------------------------------------
    # Create engine
    # --------------------------------------------------------

    engine = ConditionEngine()


    # --------------------------------------------------------
    # IMPORTANT:
    #
    # These are NEW messages being analyzed.
    #
    # They are NOT training data.
    #
    # Replace these with messages coming from your ECHO
    # application/backend.
    # --------------------------------------------------------

    engine.analyze_journal(
        "I have been feeling stressed about everything lately.",
        "2026-08-28T10:00:00"
    )


    engine.analyze_chat(
        "I keep worrying about what is going to happen.",
        "2026-08-29T14:00:00"
    )


    engine.analyze_journal(
        "Today was exhausting and I felt overwhelmed.",
        "2026-08-30T09:00:00"
    )


    engine.analyze_chat(
        "I cannot stop overthinking everything.",
        "2026-08-31T18:00:00"
    )


    engine.analyze_journal(
        "I feel like things are becoming harder to manage.",
        "2026-09-01T11:00:00"
    )


    engine.analyze_chat(
        "I am really anxious about everything right now.",
        "2026-09-02T15:00:00"
    )


    # --------------------------------------------------------
    # Analyze user
    # --------------------------------------------------------

    result = engine.analyze_user()


    # --------------------------------------------------------
    # Display
    # --------------------------------------------------------

    print_analysis(
        result
    )


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":

    main()