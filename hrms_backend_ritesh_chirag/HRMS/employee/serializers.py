
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import CompanyRelations,EmployeeDocuments,DailyAttendanceReport,Breaks,Attendence,TodaysEmployeeActivity,Notification
from authApp.models import Employee
from authApp.serializers import EmployeeSerializer,AttendanceSpecificDataSerializer
from datetime import date 
from django.db.models import Sum,F,ExpressionWrapper,DurationField
from django.db.models import Count
from datetime import datetime, timedelta, date, time
import calendar
#created By Ritesh
class LogsSerializer(serializers.ModelSerializer):
   
    breaks = serializers.SerializerMethodField()
    class Meta:
        model = Attendence
        fields = ['checkIn','checkOut','breaks']
    def get_breaks(self,obj):        
        breaksData = Breaks.objects.filter(employee_id = obj.employee_id_id,date = date.today()).values("breakIn","breakOut")        
        return breaksData

#created By Ritesh     
class AllLogsSerializer(serializers.ModelSerializer):   
    breaks = serializers.SerializerMethodField()
    class Meta:
        model = Attendence
        fields = ['checkIn','checkOut','breaks']
    def get_breaks(self,obj):        
        breaksData = Breaks.objects.filter(date = date.today()).values("breakIn","breakOut")        
        return breaksData
#created By Ritesh
class EmployeeDailyActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = TodaysEmployeeActivity
        fields = ['first_name','last_name','status','status_time']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=Employee
        fields=["first_name","last_name","is_superuser"]




class NotificationSerializer(serializers.ModelSerializer):
    total_notification = serializers.SerializerMethodField()
    employee_id = UserSerializer(read_only=True)

    class Meta:
        model = Notification
        fields = ['id', 'status', 'message', 'is_Read', 'request_admin', 'total_notification', 'employee_id']

    def get_total_notification(self, obj):
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            if request.user.is_superuser:
                print("I am superUser")
                notificationCount = Notification.objects.filter(is_Read=False, request_admin=True).count()
                print("note", notificationCount)
            else:
                print("I am user")
                notificationCount = Notification.objects.filter(is_Read=False, request_admin=False).count()
            return notificationCount
        return 0 

    def get_employee(self, obj):
        employee = Employee.objects.all()
        return employee

    
    

#created By Ritesh
class AttendanceSerializer(serializers.ModelSerializer):
    total_office_hours = serializers.SerializerMethodField()
    total_working_hours = serializers.SerializerMethodField()
    total_present_days = serializers.SerializerMethodField()
    total_late_days = serializers.SerializerMethodField()
    total_half_days = serializers.SerializerMethodField()

    class Meta:
        model = DailyAttendanceReport
        fields = [
            'date', 'entry_time', 'exit_time', 
            'total_working_hours', 'total_break_hours', 'net_working_hours', 
            'total_office_hours', 'total_present_days', 'total_late_days', 'total_half_days'
        ]

    def validate(self, attrs):
        attrs['employee_id'] = self.context['request'].user
        return super().validate(attrs)

    def get_total_office_hours(self, obj):
   
        total_days = DailyAttendanceReport.objects.filter(employee_id=self.context['request'].user).count()
        return total_days * 9

    def get_total_working_hours(self, obj):
        total_working_seconds = DailyAttendanceReport.objects.filter(
            employee_id=self.context['request'].user
        ).aggregate(
            total=Sum(ExpressionWrapper(F('total_working_hours'), output_field=DurationField()))
        )['total']

        if total_working_seconds:
            total_working_hours = total_working_seconds.total_seconds() / 3600
            return total_working_hours
        return 0

    def get_total_present_days(self, obj):
        today = date.today()
        first_day_of_month = today.replace(day=1)
        last_day_of_month = today.replace(day=calendar.monthrange(today.year, today.month)[1])

        total_present_days = DailyAttendanceReport.objects.filter(
            employee_id=self.context['request'].user,
            date__range=[first_day_of_month, last_day_of_month]
        ).aggregate(total_days=Count('id'))['total_days']
        
        return total_present_days or 0  

    def get_total_late_days(self, obj):
        today = date.today()
        first_day_of_month = today.replace(day=1)
        last_day_of_month = today.replace(day=calendar.monthrange(today.year, today.month)[1])

        total_late_days = DailyAttendanceReport.objects.filter(
            employee_id=self.context['request'].user,
            date__range=[first_day_of_month, last_day_of_month],
            entry_time__gt=datetime.combine(today, time(4, 30))
        ).aggregate(total_days=Count('id'))['total_days']

        return total_late_days or 0 
    
    def get_total_half_days(self, obj):
        today = date.today()
        first_day_of_month = today.replace(day=1)
        last_day_of_month = today.replace(day=calendar.monthrange(today.year, today.month)[1])

        half_days_records = DailyAttendanceReport.objects.filter(
            employee_id=self.context['request'].user,
            date__range=[first_day_of_month, last_day_of_month]
        ).annotate(
            working_hours=ExpressionWrapper(
                F('exit_time') - F('entry_time'),
                output_field=DurationField()
            )
        ).filter(
            working_hours__lte=timedelta(hours=5)
        ).count()

        return half_days_records or 0 
    
   

class RelationsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRelations
        fields = ['id', 'designation', 'department', 'batch', 'joining_date', 'probation_end_date', 'work_duration', 'is_deleted'] 
    
#created By Ritesh
class EmployeeRelationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyRelations
        fields = ['id', 'designation', 'department', 'batch', 'joining_date', 'probation_end_date', 'work_duration', 'is_deleted']
    
    def validate(self, attrs):      
        employee_id = self.context.get('employeeId')
        print("Finally, I got the id from the URL as", employee_id)
        if not employee_id:
            raise serializers.ValidationError({"error": "Can't get the employeeId"})        
              
        attrs['employee_id_id'] = employee_id
        return super().validate(attrs)

#created By Ritesh    
class DocumentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocuments
        fields = ['id','pan_card','aadhar_card','pan_image','aadhar_image']       

    def validate(self, attrs):
        employee_id = self.context.get('employeeId')
        print("Finally, I got the id from the URL as", employee_id)
        if not employee_id:
            raise serializers.ValidationError({"error": "Can't get the employeeId"})      
        
        attrs['employee_id_id'] = employee_id
        return super().validate(attrs) 
class DocumentsUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeDocuments
        fields = ['id','pan_card','aadhar_card','pan_image','aadhar_image'] 


class EmployeeProfileSerializer(serializers.ModelSerializer):   
    relations = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()
   
    class Meta:
        model = Employee
        fields = ['first_name','last_name','email','dob','bio','address','phone_number','gender','profile','relations','documents']

    def get_relations(self,obj):
        relations = CompanyRelations.objects.filter(employee_id = obj.id,).values("designation","department","batch","joining_date","probation_end_date","work_duration")        
        return relations
    
    def get_documents(self,obj):
        documents = EmployeeDocuments.objects.filter(employee_id = obj.id).values()
        return documents


    

