from django.db import models


class SimpleModel(models.Model):
    name = models.CharField(max_length=100)  # Одно поле для хранения имени
