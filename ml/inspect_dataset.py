import pandas as pd


DATASET_FILE = "echo_training_dataset.csv"


df = pd.read_csv(DATASET_FILE)


print("\nDATASET OVERVIEW")

print(
    f"Rows: {df.shape[0]}"
)

print(
    f"Columns: {df.shape[1]}"
)


print("\nASSESSMENT TYPES")

print(
    df["assessmentType"].value_counts()
)


print("\nTARGET DISTRIBUTION")

print(
    df["trend"].value_counts()
)


print("\nMISSING VALUES")

print(
    df.isnull().sum()
)


print("\nFEATURES")

print(
    df.columns.tolist()
)


print("\nDATA")

print(
    df.to_string(index=False)
)