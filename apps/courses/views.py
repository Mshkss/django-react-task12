from rest_framework.generics import ListAPIView
from .models import Course
from .serializer import CourseSerializer
from rest_framework.permissions import AllowAny


class CourseListView(ListAPIView):
    permission_classes = [AllowAny]  # <-- разрешить всем
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
