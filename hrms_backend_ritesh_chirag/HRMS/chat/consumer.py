import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage
from authApp.models import Employee

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # self.employee_id = self.scope["url_route"]["kwargs"]["employee_id"]
        self.employee_id = "employee-room"
        self.room_group_name = "chat_general"

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        employee_id = text_data_json["employee_id"]
        first_name = text_data_json["first_name"]
        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name, {"type": "chat_message", "message": message, "employee_id": employee_id,"first_name":first_name}
        )
        
        # Save message to database`
        await self.save_message(employee_id, first_name,message)

    async def chat_message(self, event):
        message = event["message"]
        employee_id = event["employee_id"]
        first_name = event["first_name"]
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "employee_id": employee_id,"first_name": first_name}))

    @database_sync_to_async
    def save_message(self, employee_id,first_name, message):
        print("THis is the employee id i get",employee_id)
        user = Employee.objects.get(id=employee_id)
        print(user,"finally this is the object")
        ChatMessage.objects.create(employee_id_id=user.id, message=message,first_name = first_name)
