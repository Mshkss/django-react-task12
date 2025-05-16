from django.db import models


class SimpleModel(models.Model):
    name = models.CharField(max_length=100)  # Одно поле для хранения имени


class goods(models.Model):
    name = models.CharField(max_length=100)  # Одно поле для хранения имени
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Поле для хранения цены товара
    description = models.TextField()  # Поле для хранения описания товара
    quantity = models.IntegerField()  # Поле для хранения количества товара