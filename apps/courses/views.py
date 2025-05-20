from rest_framework.generics import ListAPIView
from .models import Course
from .serializer import CourseSerializer
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter


class CourseListView(ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["title"]
    ordering_fields = ["price", "title"]
