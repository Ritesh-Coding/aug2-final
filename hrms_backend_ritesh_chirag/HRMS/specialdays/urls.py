# employees/urls.py
from django.urls import path
from django.urls import path,include
from .views import BirthdayListView
from rest_framework.routers import DefaultRouter
from .views import HolidayAll,CalenderHoliday,CalenderBirthday
router = DefaultRouter()
# create by chirag
router.register(r'calender-holidays',CalenderHoliday,basename='calender-holiday')
router.register(r'holidays', HolidayAll, basename='holiday')
router.register(r'calender-birthdays',CalenderBirthday,basename='calender-birthday')
urlpatterns = [
     path('', include(router.urls)),
     path('birthdays/', BirthdayListView.as_view(), name="birthday-list")
]