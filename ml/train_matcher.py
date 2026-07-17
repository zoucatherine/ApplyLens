import pandas as pd
from preprocessing import preprocess_dataframe
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
from sklearn.metrics import classification_report

from pathlib import Path

current_dir = Path(__file__).resolve().parent
data_path = current_dir / "datasets" / "job_applicant_dataset.csv"
df = pd.read_csv(data_path)

X, y = preprocess_dataframe(df)

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        stop_words="english",
        max_features=10000
    )),
    ("model", LogisticRegression(max_iter=1000))
])

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)

pipeline.fit(X_train, y_train)

pred = pipeline.predict(X_test)
print(classification_report(y_test, pred))


current_dir = Path(__file__).resolve().parent
model_path = current_dir / "models" / "matcher.joblib"
model_path.parent.mkdir(parents=True, exist_ok=True)
joblib.dump(pipeline, model_path)