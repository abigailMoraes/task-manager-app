from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse

from taskManager.models import User, Task, Event
from taskManager.serializers import UserSerializer, TaskSerializer, EventSerializer

# Create your views here.
@csrf_exempt
def userApi(request,uname=""):
    if request.method=='GET':
        users = User.objects.all()
        user_serializer = UserSerializer(users, many=True)
        return JsonResponse(user_serializer.data, safe=False)

    elif request.method =='POST':
        user_data = JSONParser().parse(request)
        user_serializer = UserSerializer(data=user_data)
        
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Added Successfully!", safe=False)

        print(user_serializer.errors)
        return JsonResponse("Failed to Add.", safe=False)
    
    elif request.method=='PUT':
        user_data = JSONParser().parse(request)
        user = User.objects.get(username = user_data['username_id'])
        user_serializer = UserSerializer(user, data=user_data)
        if user_serializer.is_valid():
            user_serializer.save()
            return JsonResponse("Updated Successfully!", safe=False)
        return JsonResponse("Failed to Update", safe=False)
    
    elif request.method=='DELETE':
        user=User.objects.get(username=uname)
        user.delete()
        return JsonResponse("Deleted Successfully!", safe=False)

@csrf_exempt
def eventApi(request,id=0):
    if request.method == 'GET':
        events = Event.objects.all()
        event_serializer = EventSerializer(events, many=True)
        return JsonResponse(event_serializer.data, safe=False)

    elif request.method == 'POST':
        event_data = JSONParser().parse(request)
        event_serializer = EventSerializer(data=event_data)
        if event_serializer.is_valid():
            event_serializer.save()
            return JsonResponse("Added Successfully!", safe=False)
        print(data)
        print(event_serializer)
        return JsonResponse("Failed to Add.", safe=False)
    
    elif request.method == 'PUT':
        event_data = JSONParser().parse(request)
        event = Event.objects.get(eventID = id)
        event_serializer = EventSerializer(event, data=event_data)
        if event_serializer.is_valid():
            event_serializer.save()
            return JsonResponse("Updated Successfully!", safe=False)
        print(event_serializer.errors)
        return JsonResponse("Failed to Update", safe=False)
    
    elif request.method=='DELETE':
        event=Event.objects.get(eventID=id)
        event.delete()
        return JsonResponse("Deleted Successfully!", safe=False)

@csrf_exempt
def eventsApi(request,uname=""):
    if request.method == 'GET':
        events = Event.objects.filter(username=uname)
        event_serializer = EventSerializer(events, many=True)
        return JsonResponse(event_serializer.data, safe=False)

@csrf_exempt
def taskApi(request,id=0):
    if request.method == 'GET':
        tasks = Task.objects.all()
        task_serializer = TaskSerializer(tasks, many=True)
        return JsonResponse(task_serializer.data, safe=False)

    elif request.method == 'POST':
        task_data = JSONParser().parse(request)
        print(task_data)
        task_serializer = TaskSerializer(data=task_data)
        
        print("Is task serializer valid?")
        
        if task_serializer.is_valid():
            
            task_serializer.save()
            return JsonResponse("Added Successfully!", safe=False)
        print(task_serializer.errors)
        return JsonResponse("Failed to Add.", safe=False)
    
    elif request.method == 'PUT':
        task_data = JSONParser().parse(request)
        task = Task.objects.get(taskID = id)
        task_serializer = TaskSerializer(task, data=task_data)
        if task_serializer.is_valid():
            task_serializer.save()
            return JsonResponse("Updated Successfully!", safe=False)
        print(task_serializer.errors)
        return JsonResponse("Failed to Update", safe=False)
    
    elif request.method=='DELETE':
        task=Task.objects.get(taskID=id)
        task.delete()
        return JsonResponse("Deleted Successfully!", safe=False)

@csrf_exempt
def tasksApi(request,uname=""):
    if request.method == 'GET':
        tasks = Task.objects.filter(username=uname)
        task_serializer = TaskSerializer(tasks, many=True)
        return JsonResponse(task_serializer.data, safe=False)