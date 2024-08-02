from django.shortcuts import render
from django.utils import timezone
from datetime import datetime,timedelta
# Create your views here

from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.pagination import PageNumberPagination
from rest_framework import status,viewsets
from .models import CompanyRelations,EmployeeDocuments,Attendence,Breaks,DailyAttendanceReport,TodaysEmployeeActivity,Notification
from django.db.models import Sum,F,ExpressionWrapper,DurationField
from .serializers import EmployeeRelationSerializer,DocumentsSerializer,AttendanceSerializer,LogsSerializer,AllLogsSerializer,EmployeeDailyActivitiesSerializer,EmployeeProfileSerializer,DocumentsUpdateSerializer,RelationsUpdateSerializer,NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from authApp.models import Employee
from django.db.models import Q
from .permissions import IsAdminOrSelf
# class EmployeeProfile(viewsets.ModelViewSet):
#     queryset =EmployeeDocuments.objects.all()
#     serializer_class = EmployeeProfileSerializer
#     def get_queryset(self):                
#           if self.request.user.is_superuser:
#                return EmployeeDocuments.objects.all()
#           return EmployeeDocuments.objects.filter(employee_id = self.request.user.id).all()
    
#     def get_permissions(self):
#         if self.request.method in ["POST","PUT","PATCH","DELETE"]:
#             self.permission_classes = [permissions.IsAdminUser]
#         else:
#             self.permission_classes = [permissions.AllowAny]
#         return super().get_permissions()

class EmployeeProfile(viewsets.ModelViewSet):
    queryset =Employee.objects.all()
    serializer_class = EmployeeProfileSerializer


class NotificationAll(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        if request.user.is_superuser:
            print("inside admin")
            queryset = Notification.objects.filter(is_Read=False, request_admin=True).order_by('-status')
        else:
            print("inside user")
            queryset = Notification.objects.filter(employee_id=request.user.id, is_Read=False, request_admin=False).order_by('-status')

        serializer = NotificationSerializer(queryset, many=True, context={'request': request})
        return Response(serializer.data)

    def patch(self, request, format=None):
        print("i am inside patch")
        if request.user.is_staff:
            Notification.objects.filter(is_Read=False).update(is_Read=True)
        else:
            Notification.objects.filter(employee_id=request.user.id, is_Read=False).update(is_Read=True)

        return Response({"message": "Notifications updated successfully"}, status=status.HTTP_200_OK)

    def post(self, request, format=None):
        print("i am inside post")
        employee_id = request.query_params.get('id', None)
        serializer = NotificationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(employee_id_id=employee_id)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    




#created by Ritesh
class AttendanceLog(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    serializer_class = LogsSerializer   
    def get_queryset(self): 
        today = datetime.today()
        logs = Attendence.objects.filter(employee_id =self.request.user.id,date=today)
        return logs
    
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
#created By Ritesh   
class AllLogs(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    serializer_class = AllLogsSerializer   
    def get_queryset(self): 
        today = datetime.today()
        logs = Attendence.objects.filter(date=today)
        return logs
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
    
class LatestEmployeeActivity(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    serializer_class = EmployeeDailyActivitiesSerializer
    def get_queryset(self):
        today = datetime.today()
        logs = TodaysEmployeeActivity.objects.filter(status_time__year = today.year,status_time__month = today.month,status_time__day = today.day,employee_id = self.request.user.id).values()
        return logs
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()


#created By Ritesh 
class EmployeeActivity(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    serializer_class = EmployeeDailyActivitiesSerializer      
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['employee_id_id']
    def get_queryset(self): 
        today = datetime.today()
        queryset = TodaysEmployeeActivity.objects.filter(
            status_time__year=today.year,
            status_time__month=today.month,
            status_time__day=today.day
        ).order_by("-status_time")    
        search_query = self.request.query_params.get('search', None)        

        if search_query:
            queryset = queryset.filter(
                Q(first_name__icontains=search_query) | Q(last_name__icontains=search_query)
            )       

        return queryset

    def get_permissions(self):
        if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 5
    page_size_query_param = 'page_size'
    max_page_size = 100    


class DashboardAttendance(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class =  AttendanceSerializer
    def get_queryset(self):
        queryset = DailyAttendanceReport.objects.filter(employee_id = self.request.user.id).order_by("-date")[:1]
        return queryset
     
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()




#created By Ritesh
class DailyAttendanceReportEmployee(viewsets.ModelViewSet):
    authentication_classes = [JWTAuthentication]
    permission_classes=[IsAuthenticated]
    serializer_class =  AttendanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['date']
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):  
          start_date = self.request.query_params.get('start_date', None)
          end_date = self.request.query_params.get('end_date', None) 
          id = self.request.query_params.get('id', None)        
          
          if self.request.user.is_superuser:
               if id:
                   return DailyAttendanceReport.objects.filter(id=id).order_by("-date")
               if start_date and end_date:
                return DailyAttendanceReport.objects.filter(date__range=[start_date, end_date])
            #    attendance = DailyAttendanceReport.objects.select_related('employee_id').all()  
               attendance = DailyAttendanceReport.objects.filter(employee_id = self.request.user.id).order_by("-date")           
               return  attendance
          else:
            if start_date and end_date:
                return DailyAttendanceReport.objects.filter(employee_id = self.request.user.id,date__range=[start_date, end_date]).order_by("-date")
            else:
                return DailyAttendanceReport.objects.filter(employee_id = self.request.user.id).order_by("-date")
    def get_permissions(self):
        if self.request.method in ["POST","PUT","PATCH","DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.AllowAny]
        return super().get_permissions()

class CompanyRelationsEmployee(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_permissions(self):
        if self.request.method in ["POST", "PUT", "PATCH", "DELETE"]:
            self.permission_classes = [permissions.IsAdminUser]
        else:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    def get(self, request, format=None):
        if request.user.is_superuser:
            employee_id = request.query_params.get('id', None)
            if employee_id:
                relations = CompanyRelations.objects.filter(employee_id=employee_id)
            else:
                relations = CompanyRelations.objects.all()
        else:
            relations = CompanyRelations.objects.filter(employee_id=request.user.id)

        serializer = EmployeeRelationSerializer(relations, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = EmployeeRelationSerializer(data=request.data, context={'employeeId': request.query_params.get('id', None) or request.user.id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request, pk, format=None):
    #     try:
    #         relation = CompanyRelations.objects.get(pk=pk)
    #         print("hello there i  get the pk as ",pk)
    #     except CompanyRelations.DoesNotExist:
    #         return Response(status=status.HTTP_404_NOT_FOUND)

    #     serializer = EmployeeRelationSerializer(relation, data=request.data, context={'employeeId': request.query_params.get('id', None) or request.user.id})
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    def patch(self, request, pk, format=None):    
        data = request.data    
        user = CompanyRelations.objects.filter(id=pk).first()
        serializer = RelationsUpdateSerializer(user,data= request.data,partial=True)
        if serializer.is_valid():
            serializer.save()        
        
        return Response(data)


    def delete(self, request, pk, format=None):
        try:
            relation = CompanyRelations.objects.get(pk=pk)
        except CompanyRelations.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        relation.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
#created By Ritesh
class EmployeeDocumentsEmployee(APIView):

     authentication_classes = [JWTAuthentication]
     permission_classes=[IsAuthenticated]
     def get(self, request, format=None):
        if request.user.is_superuser:
            employee_id = request.query_params.get('id', None)
            if employee_id:
                relations = EmployeeDocuments.objects.filter(employee_id=employee_id)
            else:
                relations = EmployeeDocuments.objects.all()
        else:
            relations = EmployeeDocuments.objects.filter(employee_id=request.user.id)

        serializer = DocumentsSerializer(relations, many=True)
        return Response(serializer.data)
    
     def post(self, request, format=None):
        
        serializer = DocumentsSerializer(data=request.data, context={'employeeId': request.query_params.get('id', None) or request.user.id})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
    #  def patch(self, request, pk, format=None):  
    #     data= request.data      
    #     user = EmployeeDocuments.objects.filter(id=pk).first()
    #     serializer = DocumentsUpdateSerializer(user,data= request.data,partial=True)
    #     if serializer.is_valid():
    #         serializer.save()      
    #     return Response({"message : Documents Updated Successfuly"}) 
    
     def patch(self, request, pk, format=None):
        user = EmployeeDocuments.objects.filter(id=pk).first()
        if not user:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = DocumentsUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)  # Return updated data
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    

class CheckIn(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    def post(self,request):
        userId = request.user.id
        if not userId:
              return Response({"message : Login Is Required"},status=status.HTTP_403_FORBIDDEN)
        today = timezone.now()             
        employee = Attendence.objects.filter(date = today,employee_id_id = userId)
        if employee:
                return Response({"message : You are already Checked In for Today"},status=status.HTTP_403_FORBIDDEN)                
        else:               
                Attendence.objects.create(checkIn=today,employee_id_id= userId)
                totalWorkingHours="00:00"
                total_break_hours="00:00"
                netWorkingHours = "00:00"
                DailyAttendanceReport.objects.create(date = today,total_working_hours=totalWorkingHours,
                                                     total_break_hours=total_break_hours,
                                                      net_working_hours=netWorkingHours,
                                                      entry_time = today,
                                                      exit_time = None,
                                                      employee_id_id = userId)
                employee = Employee.objects.filter(id=userId).values("first_name","last_name","username").first()
                              
                TodaysEmployeeActivity.objects.create(first_name = employee["first_name"],
                                                      last_name =employee["last_name"], status= "Check In",status_time = timezone.now(),employee_id_id = userId )
                return Response({"message : checked In successfuly"},status=status.HTTP_201_CREATED)                  
        
#created By Ritesh      
class CheckOut(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self,request):
            userId = request.user.id  
            if not userId:
              return Response({"message : Login Is Required"},status=status.HTTP_403_FORBIDDEN)         
            today = timezone.now()                
            employee = Attendence.objects.filter(date = today,employee_id_id= userId).values()   
            checkBreakIn = Breaks.objects.filter(date = today,employee_id_id= userId).last() 
            print(employee,"this is what i get")
            
            lastUpdateId = employee[0]["id"]
            
            if len(employee)==0:
                return Response({"message : CheckIn is Required"},status=status.HTTP_403_FORBIDDEN)
            if checkBreakIn:
                if checkBreakIn.breakOut is None:
                    return Response({"message : BreakOut is Required"},status=status.HTTP_403_FORBIDDEN)
            
            if not employee[0]["checkOut"] is None:
                return Response({"message : You are already check Out for ToDay"},status=status.HTTP_403_FORBIDDEN)                
            else:       
                Attendence.objects.filter(pk=lastUpdateId).update(checkOut=today,employee_id_id= userId)
                employee = Employee.objects.filter(id=userId).values("first_name","last_name","username").first()
                print(employee,"check Out details h bhai")               
                TodaysEmployeeActivity.objects.create(first_name = employee["first_name"],
                                                      last_name =employee["last_name"], status= "Check Out",status_time = timezone.now(),employee_id_id = userId )
                employee = Attendence.objects.filter(date = today,employee_id_id= userId).last()
                checkOutTime = employee.checkOut
                checkInTime = employee.checkIn
                totalWorkingHours = (checkOutTime-checkInTime)              

                total_break_hours = Breaks.objects.filter(date = today,employee_id_id= userId).aggregate(breakOuts = Sum(ExpressionWrapper(F('breakOut')-F('breakIn'),output_field=DurationField())))
                
                if total_break_hours['breakOuts'] != None:                    
                    if total_break_hours['breakOuts'] < timedelta(hours=1) :
                        total_break_hours = timedelta(hours=1)                        
                    else:
                        total_break_hours=total_break_hours['breakOuts']                                   
                else:
                    total_break_hours = timedelta(hours=1)
          
                netWorkingHours=timedelta(hours=0)

                if totalWorkingHours - total_break_hours > timedelta(hours=0):
                    netWorkingHours = totalWorkingHours - total_break_hours
                # DailyAttendanceReport.objects.filter(employee_id_id = userId,date = today).update(
                                                    #  total_break_hours=total_break_hours                                                      
                                                    #   )
                
                DailyAttendanceReport.objects.filter(employee_id_id = userId,date = today).update(date = today,total_working_hours=totalWorkingHours,
                                                     total_break_hours=total_break_hours,
                                                      net_working_hours=netWorkingHours,
                                                      exit_time=today)

                return Response({"message : checked Out successfully"},status=status.HTTP_201_CREATED)                  
        
#created By Ritesh
class BreakIn(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    def post(self,request):
              
            data = request.data         
            user_id = request.user.id
            if not user_id:
              return Response({"message : Login Is Required"},status=status.HTTP_403_FORBIDDEN)  
            
            today = timezone.now()   
            checkLogin = Attendence.objects.filter(date = today,employee_id_id= user_id).last()    
            if checkLogin is None or checkLogin.checkOut:
                return Response({"message":"CheckIn is Required"},status=status.HTTP_403_FORBIDDEN)  
                
            employee = Breaks.objects.filter(date = today,employee_id_id= user_id).last()            
            
            if employee is None:
                Breaks.objects.create(breakIn=today,employee_id_id= user_id)
                employee = Employee.objects.filter(id=user_id).values("first_name","last_name","username").first()
                
                             
                TodaysEmployeeActivity.objects.create(first_name = employee["first_name"],
                                                      last_name =employee["last_name"], status= "Break In",status_time = timezone.now(),employee_id_id = user_id )
                return Response({"message : Break In Successfully"},status=status.HTTP_201_CREATED)                
            else:              
                if employee.breakIn is None:               
                    return Response({"message : Break In successfully"},status=status.HTTP_202_ACCEPTED)  
                else:
                    if employee.breakOut is None:    
                        return Response({"message : You are already BreakedIn"},status=status.HTTP_403_FORBIDDEN)               
                    else:
                       
                       Breaks.objects.create(breakIn=today,employee_id_id= user_id)
                       employee = Employee.objects.filter(id=user_id).values("first_name","last_name","username").first()
                                   
                       TodaysEmployeeActivity.objects.create(first_name = employee["first_name"],
                                                      last_name =employee["last_name"], status= "Break In",status_time = timezone.now(),employee_id_id = user_id )
                       return Response({"message : Break In Successfully"},status=status.HTTP_201_CREATED)     
      
#created By Ritesh
class BreakOut(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.AllowAny]
    def post(self,request):      
            userId = request.user.id
            if not userId:
              return Response({"message : Login Is Required"},status=status.HTTP_403_FORBIDDEN) 
          
            today = timezone.now()   
            checkLogin = Attendence.objects.filter(date = today,employee_id_id= userId).last()  
       
            if checkLogin is None:
                return Response({"message":"CheckIn is Required"},status=status.HTTP_403_FORBIDDEN)   
 
            checkBreakIn = Breaks.objects.filter(date = today,employee_id_id= userId).last() 
            if not checkBreakIn:
                return Response({"message":"BreakIn is Required"},status=status.HTTP_403_FORBIDDEN) 
 
            employee = Breaks.objects.filter(date = today,employee_id_id= userId).last()
            lastUpdateId = employee.id   
        
            Breaks.objects.filter(pk=lastUpdateId).update(breakOut=today)
            employee = Employee.objects.filter(id=userId).values("first_name","last_name","username").first()
                         
            TodaysEmployeeActivity.objects.create(first_name = employee["first_name"],
                                                      last_name =employee["last_name"], status= "Break Out",status_time = timezone.now(),employee_id_id = userId )
            total_break_hours = Breaks.objects.filter(date = today,employee_id_id= userId).aggregate(breakOuts = Sum(ExpressionWrapper(F('breakOut')-F('breakIn'),output_field=DurationField())))
            total_break_hours=total_break_hours['breakOuts']
            
            DailyAttendanceReport.objects.filter(employee_id_id = userId,date = today).update(
                                                     total_break_hours=total_break_hours                                                      
                                                      )
            return Response({"message":"BreakOut Done"},status=status.HTTP_202_ACCEPTED) 



   
        

    