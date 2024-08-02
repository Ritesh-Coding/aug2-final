# # employees/urls.py
from django.urls import path,include
from .views import EmployeeDocumentsEmployee,CompanyRelationsEmployee,CheckIn,CheckOut,BreakIn,BreakOut,DailyAttendanceReportEmployee,AttendanceLog,AllLogs,EmployeeActivity,EmployeeProfile,LatestEmployeeActivity,NotificationAll,DashboardAttendance
from rest_framework.routers import DefaultRouter
router = DefaultRouter()
# router.register(r'employeeDocuments', EmployeeDocumentsEmployee, basename='employeeDocuments')
# router.register(r'companyRelations', CompanyRelationsEmployee, basename='employeeRelations')
router.register(r'attendanceReport', DailyAttendanceReportEmployee, basename='attendanceReport')
router.register(r'employeeDailyLogs', AttendanceLog, basename='dailyLogSpecificEmployee')
router.register(r'dailyLogs', AllLogs, basename='dailyLogAllEmployee')
router.register(r'todayEmployeeActivity', EmployeeActivity, basename='todayEmployeeActivity')
router.register(r'latestEmployeeActivity', LatestEmployeeActivity, basename='latestEmployeeActivity')
router.register(r'profile', EmployeeProfile, basename='profile')
router.register(r'dashboardAttendance', DashboardAttendance, basename='dashboard-attendanceReport')




urlpatterns = [
     
    path('', include(router.urls)), 
    
    # path('employeeStatus/',)

    path('checkIn/',CheckIn.as_view(),name = 'checkIn'),
    path('checkOut/',CheckOut.as_view(),name ='checkOut'),


    path('breakIn/',BreakIn.as_view(),name='breakIn'),
    path('breakOut/',BreakOut.as_view(),name='breakOut'),  
    
    path('notification/', NotificationAll.as_view(), name='notifications'),
    path('notification/<int:pk>/', NotificationAll.as_view(), name='notifications-update'),

    path('companyRelations/', CompanyRelationsEmployee.as_view(), name='company-relations-list'),
    path('companyRelations/<int:pk>/', CompanyRelationsEmployee.as_view(), name='company-relations-detail'),

     path('employeeDocuments/', EmployeeDocumentsEmployee.as_view(), name='company-relations-list'),
    path('employeeDocuments/<int:pk>/', EmployeeDocumentsEmployee.as_view(), name='company-relations-detail'),




]