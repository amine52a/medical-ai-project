# contact/views.py
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.core.mail import send_mail
import json

@csrf_exempt  # allow requests from Angular without CSRF token
def contact_api(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        subject = data.get('subject')
        message = data.get('message')

        try:
            send_mail(
                subject,
                f"Message from {name} ({email}):\n\n{message}",
                'your_email@gmail.com',   # your Gmail
                ['aminebenmohamedabdellah@gmail.com'],  # recipient
                fail_silently=False,
            )
            return JsonResponse({'success': True, 'message': 'Message sent successfully!'})
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)})
    return JsonResponse({'success': False, 'message': 'Invalid request method.'})
