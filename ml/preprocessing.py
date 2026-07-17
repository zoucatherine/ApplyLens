import pandas as pd



def preprocess_dataframe(df: pd.DataFrame):
    df = df.copy()
    
    #drop name, age, gender, race, ethnicity
    df.drop(columns=["Job Applicant Name", "Age", "Gender", "Race", "Ethnicity"])

    #combine the text fields
    df["text"] = (
        df["Resume"] + " " +
        df["Job Roles"] + " " +
        df["Job Description"]
    )

    X = df["text"]
    y = df["Best Match"]
    return X, y
