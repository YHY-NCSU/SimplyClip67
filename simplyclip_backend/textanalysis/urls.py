from django.urls import path
from . import views

urlpatterns = [
    path('/upload', views.upload, name="upload"),
    path('summarize/<str:summ_input>/', views.summarize, name="summarize"),
]
