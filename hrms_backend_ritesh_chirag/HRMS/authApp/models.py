# employees/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser

# create by chirag


class Employee(AbstractUser):
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=[(
        'Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], null=True, blank=True)
    relationship_status = models.CharField(
        max_length=20, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)   
    date_of_joining = models.DateField(null=True, blank=True)
    phone_number = models.CharField(max_length=15, null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    profile = models.ImageField(blank=True,null=True,upload_to="images/")

    def __str__(self):
        return f"{self.first_name} {self.last_name} {self.id}"
        
