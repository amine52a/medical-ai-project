from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/symptom/', include('symptom_checker.urls')),
    path('api/voice/', include('voice_ai.urls')),
    path('api/calls/', include('calls.urls')),
    path('api/contact/', include('contact.urls')),
        path('api/accounts/', include('accounts.urls')),  # ✅ your register URL will now exist

]
