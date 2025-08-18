from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('name', 'date', 'time', 'gender', 'age', 'created_at')
    search_fields = ('name', 'reason')
    list_filter = ('date', 'time', 'gender')
