from django.db import models
from django.utils.timezone import now
import uuid
from django.contrib.auth.models import AbstractUser

class AuthUser(AbstractUser):
    pass


# # Create your models here.
class User(models.Model):

    username = models.CharField(max_length=90, primary_key=True)

    firstname = models.CharField(max_length=90)

    lastname = models.CharField(max_length=90)

    email = models.CharField(max_length=90)

    phone = models.CharField(max_length=90)

    @classmethod
    def get_default_pk(cls):
        User, created = cls.objects.get_or_create(
            username='admin', defaults=dict(firstname='admin', lastname='admin', email='admin@gmail.com',phone='not available'))
        return User.pk

# class users(models.Model):
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4(), blank=True, editable=False)

#     nickname = models.CharField(max_length=255)

#     email = models.CharField(max_length=255, unique=True)

#     password = models.CharField(max_length=255)

#     email_Verified = models.BooleanField(default=False)

#     def get_default_pk(cls):
#         users, created = cls.objects.get_or_create(
#             id='admin', defaults=dict(nickname='admin', email='admin@gmail.com',password='not available'))
#         return users.pk
REPEATCHOICE = (
    (0, 'None'),
    (1, 'Daily'),
    (2, 'Weekly'),
    (3, 'Monthly'),
)

PRIORITY = (
    (0, 'Low'),
    (1, 'Medium'),
    (2, 'High'),
)

class Task(models.Model):
    
    taskID = models.AutoField(primary_key = True)

    title = models.CharField(max_length=90)

    taskdescription = models.TextField()

    end = models.DateTimeField(default=now)

    start = models.DateTimeField(default=now)

    deadline = models.DateTimeField(default=now)

    repeating = models.CharField(max_length=90, choices=REPEATCHOICE)

    completed = models.BooleanField(default=False)

    priority = models.CharField(max_length=90, choices=PRIORITY)

    hours = models.FloatField(default=False)

    username = models.ForeignKey(User, on_delete=models.CASCADE, default=User.get_default_pk)

    allDay = models.BooleanField(default=False)

    color = models.CharField(default='colors.red',max_length=90)

    draggable = models.BooleanField(default=True)

    scheduled = models.BooleanField(default=True)

    @classmethod
    def get_default_pk(cls):
        Task, created = cls.objects.get_or_create(
            taskID=0, defaults=dict(title='Not Available', taskdescription='Not Available'))
        return Task.pk

class Event(models.Model):
    
    eventID = models.AutoField(primary_key = True)

    parentTaskID = models.ForeignKey(Task, on_delete=models.CASCADE, default = Task.get_default_pk)

    title = models.CharField(max_length=90)

    eventdescription = models.TextField()

    end = models.DateTimeField(default=now)

    start = models.DateTimeField(default=now)

    username = models.ForeignKey(User, on_delete=models.CASCADE, default=User.get_default_pk)

    allDay = models.BooleanField(default=False)

    color = models.CharField(default='colors.red',max_length=90)

    draggable = models.BooleanField(default=True)

    completed = models.BooleanField(default=False)


