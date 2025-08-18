from symptom_checker.utils import split_symptoms
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.preprocessing import MultiLabelBinarizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
import joblib
import os

# Load dataset
df = pd.read_csv('data/symptom_disease.csv')

# Prepare features and labels
X = df['symptoms']
y = df['disease']

# Vectorize symptoms text using the imported function tokenizer
vectorizer = CountVectorizer(tokenizer=split_symptoms)
X_vec = vectorizer.fit_transform(X)

# Encode diseases as multi-label binary
mlb = MultiLabelBinarizer()
y_encoded = mlb.fit_transform([[label] for label in y])

# Train classifier (one-vs-rest logistic regression)
clf = OneVsRestClassifier(LogisticRegression(max_iter=1000))
clf.fit(X_vec, y_encoded)

# Create model folder if it doesn't exist
if not os.path.exists('model'):
    os.makedirs('model')

# Save model and preprocessors
joblib.dump(clf, 'model/symptom_classifier.pkl')
joblib.dump(vectorizer, 'model/vectorizer.pkl')
joblib.dump(mlb, 'model/mlb.pkl')

print("Training complete. Model saved in 'model/' folder.")
