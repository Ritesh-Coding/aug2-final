from django.db import models
from authApp.models import Employee

class ChatMessage(models.Model):
    employee_id = models.ForeignKey(Employee, on_delete=models.CASCADE)
    first_name = models.CharField()
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

   
