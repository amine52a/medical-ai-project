from django.urls import path
from .views import SymptomCheckAPIView

urlpatterns = [
    path('check/', SymptomCheckAPIView.as_view(), name='symptom-check'),
]
