from rest_framework.permissions import BasePermission


class CanEditCourseImage(BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.has_perm("courses.can_edit_course_image")
