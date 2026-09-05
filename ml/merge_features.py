import os
import pandas as pd


BASE_PATH = "datasets/studentlife"


SURVEY_FILE = os.path.join(
    BASE_PATH,
    "studentlife_unified_dataset.csv"
)

EMA_FILE = os.path.join(
    BASE_PATH,
    "ema_features.csv"
)

SENSING_FILE = os.path.join(
    BASE_PATH,
    "sensing_features.csv"
)

OUTPUT_FILE = os.path.join(
    BASE_PATH,
    "final_training_dataset.csv"
)


def load_dataset(filepath, name):

    print(
        f"\nLoading {name}..."
    )

    if not os.path.exists(filepath):

        print(
            f"File not found: {filepath}"
        )

        return None

    df = pd.read_csv(
        filepath
    )

    print(
        f"{name} shape: {df.shape}"
    )

    return df


def main():

    # Load datasets

    survey = load_dataset(
        SURVEY_FILE,
        "Survey dataset"
    )

    ema = load_dataset(
        EMA_FILE,
        "EMA dataset"
    )

    sensing = load_dataset(
        SENSING_FILE,
        "Sensing dataset"
    )


    if (
        survey is None
        or ema is None
        or sensing is None
    ):

        print(
            "\nCould not load all datasets."
        )

        return


    # Check UID

    for name, df in [
        ("Survey", survey),
        ("EMA", ema),
        ("Sensing", sensing)
    ]:

        if "uid" not in df.columns:

            print(
                f"\nERROR: "
                f"{name} dataset has no uid column."
            )

            return


    # Remove duplicate columns
    # from EMA and sensing if necessary

    ema_feature_columns = [
        column
        for column in ema.columns
        if column != "uid"
        and column not in survey.columns
    ]

    sensing_feature_columns = [
        column
        for column in sensing.columns
        if column != "uid"
        and column not in survey.columns
        and column not in ema.columns
    ]


    ema = ema[
        ["uid"] + ema_feature_columns
    ]

    sensing = sensing[
        ["uid"] + sensing_feature_columns
    ]


    # Merge survey + EMA

    merged = pd.merge(

        survey,

        ema,

        on="uid",

        how="left"

    )


    print(
        "\nAfter Survey + EMA:"
    )

    print(
        merged.shape
    )


    # Merge sensing

    merged = pd.merge(

        merged,

        sensing,

        on="uid",

        how="left"

    )


    print(
        "\nAfter adding Sensing:"
    )

    print(
        merged.shape
    )


    # Remove duplicate rows

    merged = merged.drop_duplicates(
        subset=["uid"]
    )


    # Replace infinite values

    merged = merged.replace(

        [
            float("inf"),
            float("-inf")
        ],

        pd.NA

    )


    # Print missing values

    print(
        "\nMissing values:"
    )

    print(
        merged.isnull().sum()
    )


    # Save

    merged.to_csv(

        OUTPUT_FILE,

        index=False

    )


    print(
        "\nFinal dataset created."
    )

    print(
        f"Saved to: {OUTPUT_FILE}"
    )


    print(
        f"Final shape: {merged.shape}"
    )


    print(
        "\nFinal columns:"
    )

    for column in merged.columns:

        print(
            column
        )


    print(
        "\nSample:"
    )

    print(
        merged.head()
        .to_string(
            index=False
        )
    )


if __name__ == "__main__":

    main()