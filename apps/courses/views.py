from rest_framework.generics import ListAPIView
from .models import Course
from .serializer import CourseSerializer
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import CanEditCourseImage
from PIL import Image, ImageDraw, ImageFont
from rest_framework.parsers import MultiPartParser
import xml.etree.ElementTree as ET
from rest_framework import status


class CourseListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["price", "title"]


class CourseImageUpdateView(APIView):
    permission_classes = [IsAuthenticated, CanEditCourseImage]

    def post(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Курс не найден"}, status=404)

        image = request.FILES.get("image")
        if image:
            course.image.save(image.name, image)
            add_watermark(course.image.path)  # watermark
            course.save()
            return Response({"status": "ok"})
        return Response({"error": "No image"}, status=400)

    def delete(self, request, pk):
        try:
            course = Course.objects.get(pk=pk)
        except Course.DoesNotExist:
            return Response({"error": "Курс не найден"}, status=404)

        if course.image:
            course.image.delete(save=True)
            return Response({"status": "Изображение удалено"})
        return Response({"error": "Нет изображения для удаления"}, status=400)


def add_watermark(image_path, watermark_text="А+Б"):
    image = Image.open(image_path).convert("RGBA")
    watermark = Image.new("RGBA", image.size)
    draw = ImageDraw.Draw(watermark)

    # Try to use a font that supports Cyrillic, fallback to default if not found
    try:
        # Path to a common font with Cyrillic support (adjust path as needed)
        font = ImageFont.truetype("arial.ttf", size=48)
    except Exception:
        font = ImageFont.load_default()

    # Draw watermark with larger font
    draw.text((20, 20), watermark_text, (255, 0, 0, 255), font=font)
    watermarked = Image.alpha_composite(image, watermark)
    watermarked = watermarked.convert("RGB")
    watermarked.save(image_path)


class CourseXMLImportView(APIView):
    permission_classes = [IsAuthenticated, CanEditCourseImage]
    parser_classes = [MultiPartParser]

    def post(self, request):
        xml_file = request.FILES.get("file")
        if not xml_file:
            return Response({"error": "Файл не передан"}, status=400)
        try:
            tree = ET.parse(xml_file)
            root = tree.getroot()
            imported = 0
            for course_elem in root.findall("course"):
                title = course_elem.findtext("title")
                description = course_elem.findtext("description")
                price = course_elem.findtext("price")
                duration = course_elem.findtext("duration")
                # Можно добавить обработку image, если нужно
                if title and price and duration:
                    Course.objects.create(
                        title=title,
                        description=description or "",
                        price=price,
                        duration=duration,
                    )
                    imported += 1
            return Response({"imported": imported}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
