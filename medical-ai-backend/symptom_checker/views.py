from symptom_checker.utils import split_symptoms
import joblib
import os
from rest_framework.views import APIView
from rest_framework.response import Response

# ... your existing code to load model/vectorizer/mlb ...

# Get base dir of your project
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load saved model and transformers once when the app loads
model_path = os.path.join(BASE_DIR, 'model', 'symptom_classifier.pkl')
vectorizer_path = os.path.join(BASE_DIR, 'model', 'vectorizer.pkl')
mlb_path = os.path.join(BASE_DIR, 'model', 'mlb.pkl')

clf = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)
mlb = joblib.load(mlb_path)

class SymptomCheckAPIView(APIView):
    def post(self, request):
        symptoms = request.data.get('symptoms')
        if not symptoms or not isinstance(symptoms, list):
            return Response({"error": "Please provide a list of symptoms."}, status=400)

        # Join symptoms by semicolon to match training input format
        symptoms_str = ';'.join(symptoms).lower()

        # Vectorize input symptoms
        symptoms_vec = vectorizer.transform([symptoms_str])

        # Predict probabilities
        pred_proba = clf.predict_proba(symptoms_vec)[0]

        # Collect diseases with confidence > threshold (e.g., 0.2)
        results = []
        for idx, prob in enumerate(pred_proba):
            if prob > 0.2:
                disease = mlb.classes_[idx]
                results.append({"disease": disease, "confidence": float(prob)})

        # Sort by confidence descending
        results = sorted(results, key=lambda x: x['confidence'], reverse=True)

        return Response({"predictions": results})
