from django.urls import path
from . import views

urlpatterns = [
    path('voice/test/', views.test_endpoint, name='test_endpoint'),
    path('voice/echo/', views.voice_echo, name='voice_echo'),
]
