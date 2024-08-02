from .models import Holiday
from authApp.models import Employee
from .serializers import HolidaySerializer, BirthdaySerializer
from rest_framework import permissions,viewsets,status
from rest_framework.pagination import PageNumberPagination
from rest_framework import generics, permissions
from datetime import date, timedelta
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.db.models import Q
import datetime
# create by chirag

class CustomPageNumberPagination(PageNumberPagination):
    page_size = 1
    page_size_query_param = 'page_size'
    max_page_size = 100

class CalenderHoliday(viewsets.ModelViewSet):
    serializer_class = HolidaySerializer
    authentication_classes = [JWTAuthentication]
    filterset_fields = ['date']
    def get_queryset(self):
        search_query= self.request.query_params.get('name', None)
        queryset = Holiday.objects.all()
        if search_query:
            queryset=queryset.filter(
                Q(name__icontains=search_query)
            )
        return queryset
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]    
        return super().get_permissions()  

class HolidayAll(viewsets.ModelViewSet):
   
    pagination_class = CustomPageNumberPagination
    serializer_class = HolidaySerializer
    authentication_classes = [JWTAuthentication]
    filterset_fields = ['date']
     
    
    def get_queryset(self):
        search_query= self.request.query_params.get('name', None)
        queryset = Holiday.objects.all()
        if search_query:
            queryset=queryset.filter(
                Q(name__icontains=search_query)
            )
        return queryset
    
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]    
        return super().get_permissions()   


class BirthdayListView(generics.ListAPIView):
    pagination_class = CustomPageNumberPagination
    serializer_class = BirthdaySerializer
    authentication_classes = [JWTAuthentication]
    def get_queryset(self):
        today = date.today()       
        # one_month_later = today + timedelta(days=30)
        return Employee.objects.filter(dob__day__gte =today.day,dob__month=today.month)
    

class CalenderBirthday(viewsets.ModelViewSet):
    serializer_class = BirthdaySerializer
    authentication_classes = [JWTAuthentication]
    today = date.today() 
    queryset = Employee.objects.filter(dob__day__gte =today.day)

    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]    
        return super().get_permissions()   
