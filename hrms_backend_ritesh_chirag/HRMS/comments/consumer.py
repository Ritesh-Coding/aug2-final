import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Message
from authApp.models import Employee

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.adminId = self.scope['url_route']['kwargs']['admin_id']
        self.userId = self.scope['url_route']['kwargs']['employee_id']        
        self.room_group_name = f"chat_{self.userId}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)
        message = data['message']
        recipient_id = data['recipient_id']
        sender_id = self.userId
        print(recipient_id,"/*/*/*/*/*/*/*/*",sender_id)

  
      
        recipient = await database_sync_to_async(Employee.objects.get)(id=recipient_id)
        sender = await database_sync_to_async(Employee.objects.get)(id=sender_id)

        
        new_message =await database_sync_to_async(Message.objects.create)(
            sender=sender,
            recipient=recipient,
            content=message
        )

        await self.channel_layer.group_send(
            f"chat_{self.userId}",
            {
                'type': 'chat_message',
                'message': message,
                'sender': self.userId
            }
        )

        await self.send(text_data=json.dumps({
            'message': message,
            'recipient': recipient_id,
            'sender': self.userId
        }))     

    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))

