from django.shortcuts import render
from .models import Leaves,EmployeeLeaveAssignment
from employee.models import Notification
from rest_framework.pagination import PageNumberPagination
from rest_framework import permissions,viewsets,status
from .serializers import EmployeeLeaveSerializer,AdminLeaveSerializer,AdminLeaveUpdateSerializer,AssignedLeaveSerializer,LeaveDetailsSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from datetime import date,datetime


#created By Ritesh
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100
class LeaveEmployee(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]    
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    pagination_class = CustomPageNumberPagination
    filterset_fields = ['status']
    queryset = Leaves.objects.all()
    serializer_class = EmployeeLeaveSerializer

    def get_queryset(self):
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date and end_date:
            return Leaves.objects.filter(employee_id=self.request.user.id, date__range=[start_date, end_date]).all()
        return Leaves.objects.filter(employee_id=self.request.user.id)
    
class GetLeaveDetails(APIView):
    
    authentication_classes = [JWTAuthentication]
    serializer_class = LeaveDetailsSerializer
    def get(self, request, format=None):
        if request.user.is_superuser:
            queryset = EmployeeLeaveAssignment.objects.select_related("employee_id").all() 
            search_query= self.request.query_params.get('name', None)
            if search_query:
                queryset=queryset.filter(
                Q(employee_id__first_name__icontains=search_query) | Q(employee_id__last_name__icontains = search_query)
             )
            employee_id = request.query_params.get('id', None)
            if employee_id:
                queryset = EmployeeLeaveAssignment.objects.filter(employee_id=employee_id)
           
        else:
            queryset = EmployeeLeaveAssignment.objects.filter(employee_id=request.user.id)
        print('This is my request',request)
        serializer = LeaveDetailsSerializer(queryset, many=True,context={'employeeId': request.query_params.get('id', None) or request.user.id})
        return Response(serializer.data)
    def post(self,request,format=None):
       
        employee_id = request.query_params.get('id', None)
        serializer = LeaveDetailsSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(employee_id_id = employee_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, id, format=None):    
        # print("this is my primary kry in patch",pk)        
        user = EmployeeLeaveAssignment.objects.filter(id=id).first()
        print("user,,,,,,,,,,,,,,,",user)
        serializer = LeaveDetailsSerializer(user,data= request.data,partial=True)
        if serializer.is_valid():
            serializer.save()      
        return Response({"message : Leaves Updated Successfuly"})
    
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions() 

class LeavesCalender(viewsets.ModelViewSet):
    permission_classes = [permissions.AllowAny]
    authentication_classes = [JWTAuthentication]
    filterset_fields = ['status','date']
    serializer_class = AdminLeaveSerializer
    def get_queryset(self):
        search_query= self.request.query_params.get('name', None)
        queryset = Leaves.objects.select_related("employee_id").all() 
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        
        if start_date and end_date:            
            queryset=queryset.filter(date__range=[start_date, end_date])
              
        if search_query:
            queryset=queryset.filter(
                Q(employee_id__first_name__icontains=search_query) | Q(employee_id__last_name__icontains = search_query)
            )
        return queryset


#created By Ritesh
class AdminGetLeaves(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAdminUser]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status','date']
    pagination_class = CustomPageNumberPagination
       
    serializer_class = AdminLeaveSerializer
    def get_queryset(self):
        search_query= self.request.query_params.get('name', None)
        queryset = Leaves.objects.select_related("employee_id").all() 
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        
        
        if start_date and end_date:            
            queryset=queryset.filter(date__range=[start_date, end_date])
              
        if search_query:
            queryset=queryset.filter(
                Q(employee_id__first_name__icontains=search_query) | Q(employee_id__last_name__icontains = search_query)
            )
        return queryset
     

#created By Ritesh 
class AdminLeaveApproval(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAdminUser]
    queryset = Leaves.objects.all()
    serializer_class = AdminLeaveUpdateSerializer



          
 

        
    