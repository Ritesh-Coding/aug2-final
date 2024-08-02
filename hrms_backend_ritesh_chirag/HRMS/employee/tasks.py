from .models import Attendence
import os
import django
from django.utils import timezone

os.environ.setdefault('DJANGO_SETTINGS_MODULE','HRMS.settings')
django.setup()

def auto_checkOut():    
    now = timezone.now()    
    cutoff_time = now.replace(hour=0,minute=0,second=0,microsecond=0)
    attendances = Attendence.objects.filter(checkIn__isnull=False,checkOut__isnull=True,checkIn__lt=cutoff_time)
    for attendance in attendances:
        attendance.checkOut = cutoff_time
        attendance.save()

if __name__=="__main__":
    auto_checkOut()    
    