# employees/serializers.py
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from .models import Employee
from django.core.validators import RegexValidator
from datetime import datetime,date
# create by chirag


class EmployeeSerializer(serializers.ModelSerializer):

    def validate(self,data):
        if 'dob' in data:
            birthDate = data['dob']

            if birthDate >= date.today():
                raise serializers.ValidationError("Enter a valid Date")
        return super().validate(data)
    class Meta:
        model = Employee
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 'dob',
            'gender', 'relationship_status', 'bio',
            'phone_number', 'address','profile'
        ]

class AttendanceSpecificDataSerializer(serializers.ModelSerializer):
     class Meta:
        model = Employee
        fields = [
            'first_name', 'last_name',            
            ]

class DateValidator:
    # In-bulit function shorted 
    def __call__(self, value):
        if value > datetime.now().date():
            raise serializers.ValidationError("Date of birth cannot be in the future.")
        return value

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=30, validators=[RegexValidator(regex='^[a-zA-Z]*$', message='First name must contain only letters.')])
    last_name = serializers.CharField(max_length=30, validators=[RegexValidator(regex='^[a-zA-Z]*$', message='Last name must contain only letters.')])
    # dob = serializers.DateField(validators=[DateValidator()])

    class Meta:
        model = Employee
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'date_of_joining', 'phone_number', 'address', 'dob']

    def create(self, validated_data):
        user = Employee.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            
            date_of_joining=validated_data.get('date_of_joining', None),
            phone_number=validated_data.get('phone_number', ''),
            address=validated_data.get('address', ''),
            dob=validated_data.get('dob', None)
        )
        return user

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(
        required=True, validators=[validate_password])
    confirm_password = serializers.CharField(required=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['confirm_password']:
            raise serializers.ValidationError(
                {"new_password": "New password fields didn't match."})
        return attrs



    