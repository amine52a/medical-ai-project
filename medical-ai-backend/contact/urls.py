from django.urls import path
from .views import contact_api

urlpatterns = [
    path('', contact_api, name='contact_api'),  # <-- empty string
]
