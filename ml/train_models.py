import os
import joblib
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import StratifiedGroupKFold
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import (
    accuracy_score,
    balanced_accuracy_score,
    f1_score
)


# ============================================================
# PATHS
# ============================================================

DATASET_FILE = "datasets/ssaq/behavioral_unified.csv"

MODEL_DIR = "models/ssaq"

os.makedirs(
    MODEL_DIR,
    exist_ok=True
)


# ============================================================
# FEATURE GROUPS
# ============================================================

BASELINE_FEATURES = [

    "previous_stress",
    "previous_anxiety"

]


BEHAVIORAL_FEATURES = [

    # Activity

    "activity_observations",
    "sedentary_ratio",
    "lightly_active_ratio",
    "active_ratio",

    # Steps

    "total_steps",
    "mean_steps",
    "max_steps",
    "step_observations",

    # Sleep

    "sleep_quality_score",
    "deep_sleep_minutes",

    # HRV

    "hrv_rmssd_mean",
    "hrv_rmssd_std",
    "hrv_coverage_mean",
    "hrv_low_frequency_mean",
    "hrv_high_frequency_mean",

    # Oxygen

    "oxygen_mean",
    "oxygen_std",
    "oxygen_min",
    "oxygen_max",

    # Wearable stress

    "wearable_stress_mean"

]


FULL_FEATURES = (
    BASELINE_FEATURES
    + BEHAVIORAL_FEATURES
)


FEATURE_SETS = {

    "baseline": BASELINE_FEATURES,

    "behavioral": BEHAVIORAL_FEATURES,

    "full": FULL_FEATURES

}


TARGETS = [

    "stress_trend",
    "anxiety_trend"

]


# ============================================================
# LOAD DATASET
# ============================================================

def load_dataset():

    print()
    print("Loading behavioral dataset...")

    df = pd.read_csv(
        DATASET_FILE
    )

    print(
        f"Samples before cleaning: {len(df)}"
    )

    print(
        f"Participants: "
        f"{df['participant_id'].nunique()}"
    )

    print(
        "Participants found:"
    )

    participants = sorted(
        df["participant_id"]
        .astype(str)
        .unique(),
        key=lambda x: int(x)
        if x.isdigit()
        else x
    )

    print(
        participants
    )

    return df


# ============================================================
# PREPARE DATA
# ============================================================

def prepare_data(
    df,
    target,
    features
):

    required_columns = (
        features
        + [
            target,
            "participant_id"
        ]
    )

    missing_columns = [
        column
        for column in required_columns
        if column not in df.columns
    ]

    if missing_columns:

        print()
        print(
            "ERROR: Missing columns:"
        )

        for column in missing_columns:

            print(
                f"  {column}"
            )

        return None


    data = df[
        required_columns
    ].copy()


    # Remove rows without target

    data = data.dropna(
        subset=[
            target
        ]
    )


    # Keep only valid classes

    data = data[
        data[target].isin(
            [
                "improving",
                "stable",
                "worsening"
            ]
        )
    ]


    # Convert all features to numeric

    for feature in features:

        data[feature] = pd.to_numeric(
            data[feature],
            errors="coerce"
        )


    print(
        f"Samples after cleaning: "
        f"{len(data)}"
    )

    print()
    print(
        "Target distribution:"
    )

    print(
        data[target].value_counts()
    )


    return data


# ============================================================
# TRAIN ONE MODEL
# ============================================================

def train_model(
    data,
    target,
    model_name,
    features
):

    print()
    print(
        "#" * 70
    )

    print(
        f"TARGET: {target}"
    )

    print(
        f"MODEL: {model_name}"
    )

    print(
        "#" * 70
    )


    X = data[
        features
    ].copy()

    y = data[
        target
    ].copy()

    groups = data[
        "participant_id"
    ]


    # --------------------------------------------------------
    # Median imputation
    # --------------------------------------------------------

    X = X.fillna(
        X.median()
    )


    # --------------------------------------------------------
    # Encode target
    # --------------------------------------------------------

    encoder = LabelEncoder()

    y_encoded = encoder.fit_transform(
        y
    )


    print()
    print(
        "Classes:"
    )

    for index, label in enumerate(
        encoder.classes_
    ):

        print(
            f"{index}: {label}"
        )


    print()
    print(
        "Number of features:",
        len(features)
    )


    # --------------------------------------------------------
    # Cross validation
    # --------------------------------------------------------

    cv = StratifiedGroupKFold(
        n_splits=5,
        shuffle=True,
        random_state=42
    )


    fold_accuracies = []

    fold_balanced_accuracy = []

    fold_macro_f1 = []


    print()
    print(
        "Running participant-level "
        "5-fold cross-validation..."
    )


    for fold, (
        train_index,
        test_index
    ) in enumerate(
        cv.split(
            X,
            y_encoded,
            groups
        ),
        start=1
    ):


        X_train = X.iloc[
            train_index
        ]

        X_test = X.iloc[
            test_index
        ]

        y_train = y_encoded[
            train_index
        ]

        y_test = y_encoded[
            test_index
        ]


        # ----------------------------------------------------
        # Random Forest
        # ----------------------------------------------------

        model = RandomForestClassifier(

            n_estimators=300,

            max_depth=8,

            min_samples_leaf=3,

            class_weight="balanced",

            random_state=42,

            n_jobs=-1

        )


        model.fit(
            X_train,
            y_train
        )


        predictions = model.predict(
            X_test
        )


        # ----------------------------------------------------
        # Metrics
        # ----------------------------------------------------

        accuracy = accuracy_score(
            y_test,
            predictions
        )


        balanced_accuracy = (
            balanced_accuracy_score(
                y_test,
                predictions
            )
        )


        macro_f1 = f1_score(
            y_test,
            predictions,
            average="macro",
            zero_division=0
        )


        fold_accuracies.append(
            accuracy
        )

        fold_balanced_accuracy.append(
            balanced_accuracy
        )

        fold_macro_f1.append(
            macro_f1
        )


        print(
            f"Fold {fold}: "
            f"{accuracy:.4f}"
        )


    # ========================================================
    # CV RESULTS
    # ========================================================

    mean_accuracy = np.mean(
        fold_accuracies
    )

    std_accuracy = np.std(
        fold_accuracies
    )

    mean_balanced_accuracy = np.mean(
        fold_balanced_accuracy
    )

    mean_macro_f1 = np.mean(
        fold_macro_f1
    )


    print()
    print(
        "Mean accuracy:"
    )

    print(
        f"{mean_accuracy:.4f}"
    )


    print()
    print(
        "Accuracy standard deviation:"
    )

    print(
        f"{std_accuracy:.4f}"
    )


    print()
    print(
        "Mean balanced accuracy:"
    )

    print(
        f"{mean_balanced_accuracy:.4f}"
    )


    print()
    print(
        "Mean macro F1:"
    )

    print(
        f"{mean_macro_f1:.4f}"
    )


    # ========================================================
    # TRAIN FINAL MODEL
    # ========================================================

    print()
    print(
        "Training final model on all participants..."
    )


    final_model = RandomForestClassifier(

        n_estimators=300,

        max_depth=8,

        min_samples_leaf=3,

        class_weight="balanced",

        random_state=42,

        n_jobs=-1

    )


    final_model.fit(
        X,
        y_encoded
    )


    # ========================================================
    # SAVE MODEL
    # ========================================================

    model_filename = (
        f"ssaq_"
        f"{target}_"
        f"{model_name}_model.pkl"
    )


    model_path = os.path.join(
        MODEL_DIR,
        model_filename
    )


    joblib.dump(
        {
            "model": final_model,

            "features": features,

            "label_encoder": encoder,

            "model_name": model_name,

            "target": target

        },
        model_path
    )


    print()
    print(
        "Model saved to:"
    )

    print(
        model_path
    )


    # ========================================================
    # FEATURE IMPORTANCE
    # ========================================================

    importance = pd.DataFrame({

        "feature": features,

        "importance":
        final_model.feature_importances_

    })


    importance = importance.sort_values(
        "importance",
        ascending=False
    )


    print()
    print(
        "Feature importance:"
    )

    print(
        importance.to_string(
            index=False
        )
    )


    # Return metrics for final comparison

    return {

        "model": model_name,

        "target": target,

        "accuracy": mean_accuracy,

        "std": std_accuracy,

        "balanced_accuracy":
            mean_balanced_accuracy,

        "macro_f1":
            mean_macro_f1,

        "features":
            len(features)

    }


# ============================================================
# MAIN
# ============================================================

def main():

    df = load_dataset()


    all_results = []


    # ========================================================
    # RUN ALL MODEL TYPES
    # ========================================================

    for target in TARGETS:

        for model_name, features in FEATURE_SETS.items():

            data = prepare_data(
                df,
                target,
                features
            )


            if data is None:

                continue


            result = train_model(
                data,
                target,
                model_name,
                features
            )


            if result is not None:

                all_results.append(
                    result
                )


    # ========================================================
    # FINAL COMPARISON
    # ========================================================

    results_df = pd.DataFrame(
        all_results
    )


    print()
    print()
    print(
        "=" * 80
    )

    print(
        "FINAL MODEL COMPARISON"
    )

    print(
        "=" * 80
    )


    if len(results_df) > 0:

        print()

        print(
            results_df[
                [
                    "target",
                    "model",
                    "features",
                    "accuracy",
                    "std",
                    "balanced_accuracy",
                    "macro_f1"
                ]
            ].to_string(
                index=False
            )
        )


        # ----------------------------------------------------
        # Save comparison
        # ----------------------------------------------------

        comparison_file = os.path.join(
            MODEL_DIR,
            "model_comparison.csv"
        )


        results_df.to_csv(
            comparison_file,
            index=False
        )


        print()
        print(
            "Comparison saved to:"
        )

        print(
            comparison_file
        )


if __name__ == "__main__":

    main()