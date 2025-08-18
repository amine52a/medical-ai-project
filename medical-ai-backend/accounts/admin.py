# accounts/admin.py
from django.contrib import admin
from .models import Account   # ✅ Fix here

admin.site.register(Account)
