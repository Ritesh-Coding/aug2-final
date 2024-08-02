from django.db import models
from authApp.models import Employee
# Create your models here.
LEAVE_CHOICES = (
    ('PL','PL'),
    ('SL','SL'),
    ('CL','CL'),
    ('UL','UL'),
)
STATUS_CHOICES = (
    ('Pending','Pending'),
    ('Approved','Approved'),
    ('Rejected','Rejected'),   
)
LEAVE_TYPE = (
    ('Full_Day','Full_Day'),
    ('First_Half','First_Half'),
    ('Last_Half','Last_Half')
)
class Leaves(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)
    date = models.DateField()
    type = models.CharField(max_length=5,choices=LEAVE_CHOICES)
    status = models.CharField(max_length=15,choices=STATUS_CHOICES,default='Pending')
    reason = models.TextField(null=True,blank=True)
    leave_day_type = models.CharField(max_length=15,choices=LEAVE_TYPE)
    
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)

class EmployeeLeaveAssignment(models.Model):
    employee_id  = models.ForeignKey(Employee,on_delete = models.CASCADE)
    remaining_paid_leave = models.IntegerField(default=0)
    remaining_unpaid_leave = models.IntegerField(default=0)
    remaining_sick_leave = models.IntegerField(default=0)
    remaining_casual_leave = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)

    