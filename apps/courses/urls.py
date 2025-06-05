from django.urls import path
from .views import CourseListView, CourseImageUpdateView

urlpatterns = [
    path("courses/", CourseListView.as_view(), name="courseListView"),
    path(
        "courses/<int:pk>/edit_image/",
        CourseImageUpdateView.as_view(),
        name="courseEditImage",
    ),
]
