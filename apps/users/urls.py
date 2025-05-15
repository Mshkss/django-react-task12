from django.urls import path
from .api_views import RegisterView, LoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("register/", RegisterView.as_view(), name="api_register"),
    path("login/", LoginView.as_view(), name="api_login"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]
