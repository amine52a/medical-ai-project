# calls/urls.py
from django.urls import path
from .views import book_call, get_bookings, available_times

urlpatterns = [
    path('book-call/', book_call, name='book_call'),
    path('bookings/', get_bookings, name='get_bookings'),
    path('available-times/', available_times, name='available_times'),
]