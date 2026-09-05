"""
Train a MULTI-LABEL text classifier: user chat message -> set of moods present.

Data: echo_chat_conversation_multilabel.csv
  columns: id, content, chat_type, secondary_emotions, is_multilabel, label_set, conversation_id

secondary_emotions can hold MORE THAN ONE extra label, comma-separated
(e.g. "anxious,angry"), so this handles that (unlike the journal file, which only
ever had a single secondary label).

Approach: OneVsRestClassifier(LogisticRegression) over TF-IDF features, with a
MultiLabelBinarizer target. Grouped train/test split by unique text.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import GroupShuffleSplit
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.multiclass import OneVsRestClassifier
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.metrics import (classification_report, hamming_loss,
                              accuracy_score, f1_score, recall_score)
import joblib

DATA_PATH = "echo_data3/echo_chat_conversation_multilabel.csv"
RANDOM_STATE = 42

def main():
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["content", "chat_type"]).copy()
    df["content"] = df["content"].str.strip()
    df["chat_type"] = df["chat_type"].str.lower()

    def label_set(row):
        labels = {row["chat_type"]}
        if pd.notna(row["secondary_emotions"]):
            for lab in str(row["secondary_emotions"]).split(","):
                labels.add(lab.strip().lower())
        return sorted(labels)

    df["labels"] = df.apply(label_set, axis=1)

    print(f"Total rows: {len(df)}")
    print(f"Unique texts: {df['content'].nunique()}")
    n_multi = df["labels"].apply(len).gt(1).sum()
    print(f"Rows with 2+ labels: {n_multi} ({n_multi/len(df):.1%})")
    print(f"Rows with 1 label:   {len(df) - n_multi} ({(len(df)-n_multi)/len(df):.1%})\n")

    mlb = MultiLabelBinarizer()
    Y = mlb.fit_transform(df["labels"])
    print(f"Label classes: {list(mlb.classes_)}\n")

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

    Y_proba = clf.predict_proba(X_test)
    Y_pred = (Y_proba >= 0.5).astype(int)

    report = classification_report(Y_test, Y_pred, target_names=mlb.classes_, digits=3, zero_division=0)
    print("=== Multi-label classification report (held-out, unseen sentences) ===")
    print(report)

    subset_acc = accuracy_score(Y_test, Y_pred)
    hloss = hamming_loss(Y_test, Y_pred)
    micro_f1 = f1_score(Y_test, Y_pred, average="micro")
    macro_f1 = f1_score(Y_test, Y_pred, average="macro")
    print(f"Subset accuracy (exact label set match): {subset_acc:.3f}")
    print(f"Hamming loss: {hloss:.3f}")
    print(f"Micro F1: {micro_f1:.3f} | Macro F1: {macro_f1:.3f}")

    # High-stakes check: suicidal recall specifically
    if "suicidal" in mlb.classes_:
        idx = list(mlb.classes_).index("suicidal")
        rec = recall_score(Y_test[:, idx], Y_pred[:, idx])
        print(f"\n[High-stakes check] 'suicidal' recall on held-out set: {rec:.3f}")
        # Also check at a lower threshold, since false negatives matter more here
        for thresh in [0.5, 0.35, 0.25]:
            pred_at_t = (Y_proba[:, idx] >= thresh).astype(int)
            r = recall_score(Y_test[:, idx], pred_at_t)
            p = (pred_at_t.sum() and (pred_at_t & Y_test[:, idx]).sum() / pred_at_t.sum()) or 0.0
            print(f"  threshold={thresh}: recall={r:.3f}, precision={p:.3f}")

    joblib.dump({"vectorizer": vectorizer, "model": clf, "mlb": mlb},
                "chat_multilabel_classifier.joblib")
    print("\nSaved model -> chat_multilabel_classifier.joblib")

    with open("chat_multilabel_report.txt", "w") as f:
        f.write("Chat Message Multi-Label Mood Classifier - Evaluation Report\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Total rows: {len(df)} | Unique texts: {df['content'].nunique()}\n")
        f.write(f"Train rows: {len(X_train_text)} | Test rows: {len(X_test_text)}\n")
        f.write(f"Text overlap train/test: {len(overlap)}\n\n")
        f.write(report)
        f.write(f"\nSubset accuracy (exact label set match): {subset_acc:.3f}\n")
        f.write(f"Hamming loss: {hloss:.3f}\n")
        f.write(f"Micro F1: {micro_f1:.3f} | Macro F1: {macro_f1:.3f}\n")

if __name__ == "__main__":
    main()
