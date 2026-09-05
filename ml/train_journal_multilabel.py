"""
Train a MULTI-LABEL text classifier: journal entry text -> set of emotions present
(can be one or two: primary emotion, optionally + secondary_emotions).

Data: echo_journals_merged.csv
  columns: id, content, emotion, createdAt, userId, secondary_emotions

Approach: OneVsRestClassifier(LogisticRegression) over TF-IDF features, with a
MultiLabelBinarizer target. Same grouped train/test split by unique text as
before, so no identical sentence leaks between train and test.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import GroupShuffleSplit
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import (classification_report, hamming_loss,
                              accuracy_score, f1_score)
import joblib

DATA_PATH = "datasets/echo_journals_merged.csv"
RANDOM_STATE = 42

def main():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["content", "emotion"]).copy()
    df["content"] = df["content"].str.strip()
    df["emotion"] = df["emotion"].str.lower()
    df["secondary_emotions"] = df["secondary_emotions"].str.lower()

    # Build label sets: {primary} or {primary, secondary}
    def label_set(row):
        labels = {row["emotion"]}
        if pd.notna(row["secondary_emotions"]):
            labels.add(row["secondary_emotions"])
        return sorted(labels)

    df["labels"] = df.apply(label_set, axis=1)

    print(f"Total rows: {len(df)}")
    print(f"Unique texts: {df['content'].nunique()}")
    n_multi = df["labels"].apply(len).gt(1).sum()
    print(f"Rows with 2 labels: {n_multi} ({n_multi/len(df):.1%})")
    print(f"Rows with 1 label:  {len(df) - n_multi} ({(len(df)-n_multi)/len(df):.1%})\n")

    mlb = MultiLabelBinarizer()
    Y = mlb.fit_transform(df["labels"])
    print(f"Label classes: {list(mlb.classes_)}\n")

    # Grouped split by unique text (dedupe first, since group split works on rows
    # but we want every row of the same text in the same split)
    groups = df["content"]
    gss = GroupShuffleSplit(n_splits=1, test_size=0.2, random_state=RANDOM_STATE)
    train_idx, test_idx = next(gss.split(df, groups=groups))

    X_train_text = df["content"].iloc[train_idx]
    X_test_text = df["content"].iloc[test_idx]
    Y_train, Y_test = Y[train_idx], Y[test_idx]

    overlap = set(X_train_text) & set(X_test_text)
    print(f"Train rows: {len(X_train_text)} | Test rows: {len(X_test_text)}")
    print(f"Text overlap train/test: {len(overlap)} (should be 0)\n")

    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1,
                                  sublinear_tf=True, stop_words="english")
    X_train = vectorizer.fit_transform(X_train_text)
    X_test = vectorizer.transform(X_test_text)

    clf = OneVsRestClassifier(
        LogisticRegression(max_iter=2000, class_weight="balanced", C=2.0)
    )
    clf.fit(X_train, Y_train)

    # Predict with per-label probability threshold (default 0.5); also expose
    # probabilities so callers can adjust the threshold if they want higher recall.
    Y_proba = clf.predict_proba(X_test)
    Y_pred = (Y_proba >= 0.5).astype(int)

    print("=== Multi-label classification report (held-out, unseen sentences) ===")
    print(classification_report(Y_test, Y_pred, target_names=mlb.classes_, digits=3, zero_division=0))

    subset_acc = accuracy_score(Y_test, Y_pred)  # exact label-set match
    hloss = hamming_loss(Y_test, Y_pred)
    micro_f1 = f1_score(Y_test, Y_pred, average="micro")
    macro_f1 = f1_score(Y_test, Y_pred, average="macro")
    print(f"Subset accuracy (exact label set match): {subset_acc:.3f}")
    print(f"Hamming loss (fraction of wrong labels):  {hloss:.3f}")
    print(f"Micro F1: {micro_f1:.3f} | Macro F1: {macro_f1:.3f}")

    joblib.dump({"vectorizer": vectorizer, "model": clf, "mlb": mlb},
                "journal_emotion_multilabel_classifier.joblib")
    print("\nSaved model -> journal_emotion_multilabel_classifier.joblib")

    with open("journal_emotion_multilabel_report.txt", "w") as f:
        f.write("Journal Multi-Label Emotion Classifier - Evaluation Report\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Total rows: {len(df)} | Unique texts: {df['content'].nunique()}\n")
        f.write(f"Train rows: {len(X_train_text)} | Test rows: {len(X_test_text)}\n")
        f.write(f"Text overlap train/test: {len(overlap)}\n\n")
        f.write(classification_report(Y_test, Y_pred, target_names=mlb.classes_, digits=3, zero_division=0))
        f.write(f"\nSubset accuracy (exact label set match): {subset_acc:.3f}\n")
        f.write(f"Hamming loss (fraction of wrong labels):  {hloss:.3f}\n")
        f.write(f"Micro F1: {micro_f1:.3f} | Macro F1: {macro_f1:.3f}\n")

    # Show a few example predictions with probabilities, for sanity-checking
    print("\n=== Example predictions (unseen test sentences) ===")
    sample_idx = np.random.RandomState(RANDOM_STATE).choice(len(X_test_text), size=6, replace=False)
    for i in sample_idx:
        text = X_test_text.iloc[i]
        true_labels = [mlb.classes_[j] for j in range(len(mlb.classes_)) if Y_test[i, j] == 1]
        probs = {mlb.classes_[j]: round(Y_proba[i, j], 2) for j in range(len(mlb.classes_))}
        print(f"- \"{text[:80]}...\"" if len(text) > 80 else f"- \"{text}\"")
        print(f"  true: {true_labels} | probs: {probs}")

if __name__ == "__main__":
    main()
