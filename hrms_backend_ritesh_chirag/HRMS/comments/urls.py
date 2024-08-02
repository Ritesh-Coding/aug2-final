from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MessageListCreateView
router = DefaultRouter()
router.register(r'messages', MessageListCreateView,basename='message-list-create')
urlpatterns = [
    path('', include(router.urls)),
]