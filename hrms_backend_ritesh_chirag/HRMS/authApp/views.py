# employees/views.py
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, get_user_model
from .models import Employee
from .serializers import EmployeeSerializer, RegisterSerializer, ChangePasswordSerializer
from .permissions import IsAdminOrSelf
from rest_framework.decorators import api_view, permission_classes, APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.pagination import PageNumberPagination
from django.db.models import Q
# create by chirag

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = Employee.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100

class EmployeeListView(generics.ListAPIView):
    authentication_classes = [JWTAuthentication]  
    
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        queryset = Employee.objects.all()
        search_query= self.request.query_params.get('name', None)
        if search_query:
                queryset=queryset.filter(
                Q(first_name__icontains=search_query) | Q(last_name__icontains = search_query)
             )
        return queryset


class EmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer
    permission_classes = [IsAdminOrSelf]
    authentication_classes = [JWTAuthentication]


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
   
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username':username,
            'role':'admin' if user.is_staff else 'user',
            'userId':user.id,
            'firstName':user.first_name,
            'lastName':user.last_name
        })
    else:
        return Response({'error': 'Invalid Credentials'}, status=400)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def forget_password(request):
    username = request.data.get('username')
    new_password = request.data.get('new_password')
    try:
        user = User.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return Response({'message': "Password Reset successfully..."})
    except User.DoesNotExist:
        return Response({'message': "User not found"}, status=400)


class ChangePasswordView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = ChangePasswordSerializer(
            data=request.data, )
        if serializer.is_valid():
            if not user.check_password(serializer.data.get("current_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            user.set_password(serializer.data.get("new_password"))
            user.save()
            return Response({
                'status': status.HTTP_200_OK,
                'message': 'Password updated successfully',
                'data': []
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)