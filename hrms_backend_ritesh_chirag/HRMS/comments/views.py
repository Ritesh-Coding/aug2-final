from django.shortcuts import render
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework import generics, permissions
from .models import Message
from rest_framework import viewsets, permissions
from .serializer import MessageSerializer
from authApp.models import Employee
class MessageListCreateView(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Message.objects.filter(recipient=user)
        return Message.objects.filter(sender=user)

    def perform_create(self, serializer):
        recipient_id = self.request.data.get('recipient_id')
        recipient = Employee.objects.get(id=recipient_id)
        serializer.save(sender=self.request.user, recipient=recipient)
