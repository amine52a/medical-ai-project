# serializers.py
from rest_framework import serializers
from .models import Booking
from django.utils import timezone

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'
    
    def validate_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Cannot book appointments in the past")
        return value