# calls/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Booking
from .serializers import BookingSerializer

@api_view(['POST'])
def book_call(request):
    serializer = BookingSerializer(data=request.data)
    if serializer.is_valid():
        # Fix the typo: validAted -> validated
        date = serializer.validated_data['date']
        time = serializer.validated_data['time']
        if Booking.objects.filter(date=date, time=time).exists():
            return Response(
                {'detail': 'This time slot is already booked.'}, 
                status=status.HTTP_409_CONFLICT
            )
        serializer.save()
        return Response(
            {'message': 'Booking created successfully'}, 
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_bookings(request):
    bookings = Booking.objects.all().order_by('-created_at')
    return Response(BookingSerializer(bookings, many=True).data)

@api_view(['GET'])
def available_times(request):
    date = request.GET.get('date')  # Expecting YYYY-MM-DD format
    default_slots = [
        '09:00 AM', '10:00 AM', '11:00 AM',
        '02:00 PM', '03:00 PM', '04:00 PM'
    ]
    
    if not date:
        return Response(default_slots)
        
    booked_times = Booking.objects.filter(date=date)\
        .values_list('time', flat=True)
    available = [t for t in default_slots if t not in booked_times]
    return Response(available)