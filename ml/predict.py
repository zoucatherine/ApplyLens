model = joblib.load("models/matcher.joblib")

prediction = model.predict([combined_text])
probability = model.predict_proba([combined_text])