from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView,
)
from .views import CustomTokenObtainPairView, CustomTokenRefreshView

urlpatterns = [
    path('user_data/<str:pk>/', views.get_user_profile_data, name='get_user_profile_data'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.register, name='register'),
    path('authenticated/', views.authenticated, name='authenticated'),
    path('toggle_follow/', views.toggleFollow, name='toggleFollow'),
    path('posts/<str:pk>/', views.get_user_posts, name='posts'),
    path('toggleLike/', views.toggleLike, name='toggleLike'),
    path('create_post/', views.create_post, name='create_post'),
    path('get_post/', views.get_post, name='get_post'),
    path('search/', views.search_user, name='search_user'),
    path('update_user/', views.update_user_details, name='update_user'),
    path('logout/', views.logout, name='logout'),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
