# models.py
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class Booking(models.Model):
    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
        ('Prefer not to say', 'Prefer not to say'),
    ]
    
    date = models.DateField()
    time = models.CharField(max_length=20)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    age = models.PositiveIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(120)]
    )
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    reason = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['date', 'time']
        unique_together = ['date', 'time']  # Prevent double bookings
    
    def __str__(self):
        return f"{self.name} - {self.date} {self.time}"