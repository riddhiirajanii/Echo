import requests
import pandas as pd


# ============================================================
# Configuration
# ============================================================

TRAINING_DATA_URL = (
    "http://localhost:5000/api/ml/training-data"
)

OUTPUT_FILE = "echo_training_dataset.csv"


# ============================================================
# Fetch training data
# ============================================================

def get_training_data(token):

    headers = {
        "Authorization": f"Bearer {token}"
    }

    response = requests.get(
        TRAINING_DATA_URL,
        headers=headers
    )

    response.raise_for_status()

    data = response.json()

    return data["data"]


# ============================================================
# Main
# ============================================================

def main():

    token = input(
        "Enter your Echo JWT token: "
    ).strip()


    print("\nFetching training data...")


    data = get_training_data(token)


    if not data:

        print(
            "\nNo training samples available."
        )

        return


    # --------------------------------------------------------
    # Convert to DataFrame
    # --------------------------------------------------------

    dataframe = pd.DataFrame(data)


    # --------------------------------------------------------
    # Sort by assessment type and timestamp
    # --------------------------------------------------------

    dataframe = dataframe.sort_values(
        by=[
            "assessmentType",
            "timestamp"
        ]
    )


    # --------------------------------------------------------
    # Save dataset
    # --------------------------------------------------------

    dataframe.to_csv(
        OUTPUT_FILE,
        index=False
    )


    print(
        f"\nDataset saved to: {OUTPUT_FILE}"
    )


    print(
        f"Number of samples: {len(dataframe)}"
    )


    # --------------------------------------------------------
    # Show assessment distribution
    # --------------------------------------------------------

    print(
        "\nSamples by assessment type:"
    )

    print(
        dataframe[
            "assessmentType"
        ].value_counts()
    )


    # --------------------------------------------------------
    # Show target distribution
    # --------------------------------------------------------

    print(
        "\nTrend distribution:"
    )

    print(
        dataframe[
            "trend"
        ].value_counts()
    )


    # --------------------------------------------------------
    # Display dataset
    # --------------------------------------------------------

    print(
        "\nDataset:"
    )

    print(
        dataframe.to_string(
            index=False
        )
    )


if __name__ == "__main__":
    main()