from rest_framework import viewsets, permissions
from .models import ChatMessage
from .serializer import ChatMessageSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
class ChatMessageViewSet(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    queryset = ChatMessage.objects.all().order_by('timestamp')
    # def get_queryset(self):
    #     if self.request.user.is_superuser:
    #         queryset = ChatMessage.objects.all().order_by('-timestamp')
    #     else:
    #         print(" i am user",self.request.user.id)
    #         queryset = ChatMessage.objects.filter(employee_id_id = self.request.user.id).order_by('-timestamp')
    #     return queryset
    serializer_class = ChatMessageSerializer
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
