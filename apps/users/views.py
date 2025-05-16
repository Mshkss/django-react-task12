from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import SimpleSerializer
from rest_framework.permissions import AllowAny


class SimpleView(APIView):
    permission_classes = [AllowAny]  # Разрешить доступ всем

    def post(self, request):
        serializer = SimpleSerializer(data=request.data)
        if serializer.is_valid():
            # Просто возвращаем данные обратно
            return Response(
                {"message": f"Hello, {serializer.validated_data['name']}!"},
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
