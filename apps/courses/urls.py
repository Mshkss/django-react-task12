from django.urls import path
from .views import CourseListView, CourseImageUpdateView, CourseXMLImportView

urlpatterns = [
    path("courses/", CourseListView.as_view(), name="courseListView"),
    path(
        "courses/<int:pk>/edit_image/",
        CourseImageUpdateView.as_view(),
        name="courseEditImage",
    ),
    path(
        "courses/import/xml/",
        CourseXMLImportView.as_view(),
        name="courseImportXML",
    ),
]
