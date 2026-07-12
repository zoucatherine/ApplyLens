import pandas as pd

df = pd.read_csv("ml\datasets\job_applicant_dataset.csv")

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