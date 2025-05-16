from rest_framework import serializers


class SimpleSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)  # Одно поле для передачи данных
