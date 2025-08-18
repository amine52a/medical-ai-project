from django.urls import path
from .views import register  # function-based view
from .views import register, login

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login, name="login"),
]
