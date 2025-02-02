import pandas as pd
import numpy as np
import joblib
from sklearn.linear_model import LinearRegression

# Load transaction data (Simulating MongoDB fetch)
def load_data():
    # Simulating past 6 months of transaction data
    data = {
        "month": [1, 2, 3, 4, 5, 6],  # Months (Jan to June)
        "expense": [500, 700, 650, 800, 750, 900]  # Expenses per month
    }
    return pd.DataFrame(data)

# Train Model
def train_model():
    df = load_data()
    X = df[["month"]]
    y = df["expense"]

    model = LinearRegression()
    model.fit(X, y)

    # Save Model
    joblib.dump(model, "spending_model.pkl")
    print("✅ AI Model Trained & Saved")

if __name__ == "__main__":
    train_model()