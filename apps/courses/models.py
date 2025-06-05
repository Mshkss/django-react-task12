from django.db import models
from PIL import Image
import os


class Course(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField()  # Duration in hours
    image = models.ImageField(upload_to="course_images/", null=True, blank=True)
    image_preview = models.ImageField(
        upload_to="course_images/previews/", null=True, blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        permissions = [
            ("can_edit_course_image", "Может редактировать изображение курса"),
        ]

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if self.image:
            self.make_preview()

    def make_preview(self):
        if not self.image:
            return
        img_path = self.image.path
        preview_path = os.path.join(
            os.path.dirname(img_path), "previews", os.path.basename(img_path)
        )
        os.makedirs(os.path.dirname(preview_path), exist_ok=True)
        img = Image.open(img_path)
        img.thumbnail((200, 200))
        img.save(preview_path)
        self.image_preview.name = f"course_images/previews/{os.path.basename(img_path)}"
        super().save(update_fields=["image_preview"])

    def __str__(self):
        return self.title
