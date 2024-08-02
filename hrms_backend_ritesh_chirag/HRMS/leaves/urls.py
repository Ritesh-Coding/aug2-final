from django.urls import path,include
from .views import LeaveEmployee,AdminGetLeaves,AdminLeaveApproval,GetLeaveDetails,LeavesCalender
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register(r'leave', LeaveEmployee, basename='leave')
router.register(r'all-leaves',AdminGetLeaves,basename='get-leaves')
router.register(r'calender-leaves',LeavesCalender,basename='calender-leaves')
router.register(r'update-leave-status',AdminLeaveApproval,basename='update-leaves')

urlpatterns = [
    path('', include(router.urls)),
    path('leave-details/',GetLeaveDetails.as_view(),name='leave-details'),
    path('leave-details/<int:id>/', GetLeaveDetails.as_view(), name='company-details-update'),
]