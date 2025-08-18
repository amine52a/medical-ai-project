# views.py
from rest_framework.decorators import api_view, parser_classes
from rest_framework.response import Response
from rest_framework.parsers import JSONParser, MultiPartParser, FormParser
from django.http import HttpResponse
import json

@api_view(['GET'])
def test_endpoint(request):
    """Simple test endpoint to verify the API is working"""
    return Response({"message": "Voice AI API is working!", "status": "success"})

@api_view(['POST'])
@parser_classes([JSONParser, MultiPartParser, FormParser])
def voice_echo(request):
    # Debug information
    print(f"Request method: {request.method}")
    print(f"Request content type: {request.content_type}")
    print(f"Request body: {request.body}")
    print(f"Request FILES: {request.FILES}")
    print(f"Request headers: {request.headers}")
    
    # Check if it's a text request (JSON) or audio file
    if request.content_type and 'application/json' in request.content_type:
        try:
            # Handle text input
            data = json.loads(request.body)
            question = data.get('question', '')
            
            if not question:
                return Response({"error": "No question provided."}, status=400)
            
            # For now, just echo back the question as a simple response
            # You can extend this to integrate with your AI model later
            response_data = {
                "answer": f"I received your question: {question}. This is a simple echo response.",
                "status": "success"
            }
            return Response(response_data)
            
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON format."}, status=400)
    
    elif request.FILES:
        # Handle audio file input
        audio_file = request.FILES.get('audio')
        if not audio_file:
            return Response({"error": "No audio provided."}, status=400)

        # Return the same audio file as response
        response = HttpResponse(audio_file.read(), content_type=audio_file.content_type)
        response['Content-Disposition'] = f'attachment; filename="{audio_file.name}"'
        return response
    
    else:
        # Try to parse as JSON even if content-type is not set
        try:
            data = json.loads(request.body)
            question = data.get('question', '')
            
            if question:
                response_data = {
                    "answer": f"I received your question: {question}. This is a simple echo response.",
                    "status": "success"
                }
                return Response(response_data)
        except (json.JSONDecodeError, UnicodeDecodeError):
            pass
            
        return Response({"error": "No valid input provided. Send either JSON with 'question' field or audio file."}, status=400)
