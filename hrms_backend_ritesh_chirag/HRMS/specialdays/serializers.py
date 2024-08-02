from rest_framework import serializers
from .models import Holiday
from authApp.models import Employee

# create by chirag


class HolidaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Holiday
        fields = ['id', 'name', 'date','holiday_image']


class BirthdaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'first_name', 'last_name', 'profile', 'dob']