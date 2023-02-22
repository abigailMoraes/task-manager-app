from django.urls import re_path
from taskManager import views
from django.contrib import admin
from django.urls import include, path
urlpatterns=[
    re_path(r'^user/$',views.userApi),
    re_path(r'^user/([a-zA-Z0-9_.]*)$',views.userApi),
    re_path(r'^event/$',views.eventApi),
    re_path(r'^event/([a-zA-Z0-9_.]*)$',views.eventApi),
    re_path(r'^events/([a-zA-Z0-9_.]*)$',views.eventsApi),
    re_path(r'^task/$',views.taskApi),
    re_path(r'^task/([a-zA-Z0-9_.]*)$',views.taskApi),
    re_path(r'^tasks/([a-zA-Z0-9_.]*)$',views.tasksApi),
]