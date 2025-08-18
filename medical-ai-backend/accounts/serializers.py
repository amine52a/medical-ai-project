from rest_framework import serializers
from .models import Account
from django.contrib.auth.hashers import make_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = [
            "username", "email", "password", "confirmPassword", "full_name",
            "age", "weight", "height", "gender", "country",
            "mental_goals", "conditions", "contact_method", "accept_privacy"
        ]

    def validate(self, data):
        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data

    def create(self, validated_data):
        validated_data.pop("confirmPassword")
        validated_data["password"] = make_password(validated_data["password"])
        return Account.objects.create(**validated_data)
