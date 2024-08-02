from django.db import models
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from authApp.models import Employee
from datetime import datetime


class CompanyRelations(models.Model):
    employee_id  = models.OneToOneField(Employee,on_delete = models.CASCADE)
    designation = models.CharField(max_length=25,null=False,blank=False,
                                    validators=[
                                      RegexValidator(
                 regex=r'^[a-zA-Z\s-]+$',
                 message="Enter a valid Designaiton.",
                 code="invalid_relations",
                     ),
                 ])    
    department = models.CharField(max_length=25,null=False,blank=False,
                                    validators=[
                                      RegexValidator(
                 regex=r'^[a-zA-Z\s-]+$',
                 message="Enter a valid Department.",
                 code="invalid_relations",
                     ),
                 ])
    batch = models.CharField(blank=False,null=False, max_length=50)
    
    joining_date = models.DateField(null=False,blank=False)
    probation_end_date = models.DateField(null=True,blank=True)
    work_duration = models.CharField(null=False,blank=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)
    def __str__(self):
        return self.designation
    
def validate_pan(value):
    an_integer = value
    a_string = str(an_integer)
    length = len(a_string)

    if length > 10 or length!=10:
        raise ValidationError(
            ('PAN No is not valid.Please Provide 10 digit Pan Card No')
        )
    
def validate_aadhar(value):
    an_integer = value
    a_string = str(an_integer)
    length = len(a_string)
    if length > 12 or length!=12:
        raise ValidationError(
            ('Aadhar No is not valid.Plese provide 12 digit aadhar card No')
        )
class EmployeeDocuments(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)
    pan_card =  models.CharField(blank=True,null=True,validators=[validate_pan])
    aadhar_card = models.CharField(blank=False,null=False,validators=[validate_aadhar])

    pan_image = models.ImageField(blank=True,null=True,upload_to="images/")
    aadhar_image = models.ImageField(upload_to="images/")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)


class Attendence(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)
    date = models.DateField(default=datetime.now,blank=False,null=False)
    checkIn = models.DateTimeField(blank=True,null=True)
    checkOut = models.DateTimeField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)

    def __str__(self):
        return self.date
    
class Breaks(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)
    date = models.DateField(default=datetime.now,blank=False,null=False)
    breakIn = models.DateTimeField(blank=True,null=True)
    breakOut = models.DateTimeField(blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)
    
class DailyAttendanceReport(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)


    date = models.DateField(default=datetime.now,blank=False,null=False)
    
    entry_time = models.DateTimeField(blank=True,null=True)
    exit_time = models.DateTimeField(blank=True,null=True)

    total_working_hours = models.DurationField(blank=True,null=True)
    total_break_hours = models.DurationField(blank=True,null=True)
    net_working_hours = models.DurationField(blank=True,null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)


class TodaysEmployeeActivity(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)

    first_name = models.CharField(blank=True,null=True)
    last_name = models.CharField(blank=True,null=True)

    status = models.CharField(blank=True,null=True)
    status_time = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)

class Notification(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)
    status=models.DateTimeField(auto_now_add=True)
    message=models.CharField()
    is_Read = models.BooleanField(default=False)
    request_admin = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)
    





    












    
   
