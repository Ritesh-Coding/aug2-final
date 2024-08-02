from django.db import models

# create by chirag


class Holiday(models.Model):
    name = models.CharField(max_length=255)
    holiday_image = models.ImageField(upload_to="images/")
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_deleted = models.IntegerField(default=0)

    def __str__(self):
        return self.name