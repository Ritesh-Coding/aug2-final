# employees/urls.py
from django.urls import path
from .views import RegisterView, login_view, EmployeeListView, EmployeeDetailView, forget_password, ChangePasswordView

# create by chirag

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', login_view, name='login'),
    path('employees/', EmployeeListView.as_view(), name='employee-list'),
    path('employees/<int:pk>/', EmployeeDetailView.as_view(), name='employee-detail'),
    path('forgetpassword/',forget_password, name='forget-password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]