from rest_framework import serializers
from taskManager.models import User, Event, Task

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = users
#         fields = ('id',
#                   'nickname',
#                   'email',
#                   'password',
#                   'email_Verified')


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username',
                  'firstname',
                  'lastname',
                  'email',
                  'phone')


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ( 
                  'eventID',
                  'parentTaskID',
                  'title', 
                  'eventdescription',
                  'end',
                  'start',
                  'allDay',
                  'color',
                  'draggable',
                  'username',
                  'completed',
                  )


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
                'taskID',
                'title',
                'taskdescription',
                'end',
                'start',
                'deadline',
                'repeating',
                'completed',
                'hours',
                'priority',
                'username',
                'allDay',
                'color',
                'scheduled',
                'draggable',
                )