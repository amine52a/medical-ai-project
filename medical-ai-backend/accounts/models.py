from django.db import models

class Account(models.Model):
    username = models.CharField(max_length=150, unique=True)
    password = models.CharField(max_length=128)  # hashed password
    email = models.EmailField(unique=True)
    full_name = models.CharField(max_length=100)
    age = models.IntegerField(null=True, blank=True)
    weight = models.FloatField(null=True, blank=True)
    height = models.FloatField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[("Male", "Male"), ("Female", "Female"), ("Other", "Other")],
        blank=True,
        null=True
    )
    country = models.CharField(max_length=100, blank=True, null=True)
    mental_goals = models.TextField(blank=True, null=True)
    conditions = models.TextField(blank=True, null=True)
    contact_method = models.CharField(
        max_length=10,
        choices=[("email", "Email"), ("phone", "Phone")],
        default="email"
    )
    accept_privacy = models.BooleanField(default=False)

    def __str__(self):
        return self.username
