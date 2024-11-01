from django.urls import path
from django.urls import re_path
import re

from . import views

urlpatterns = [
    path('upload', views.upload, name="upload"),
    path('summarize/<str:summ_input>/', views.summarize, name="summarize"),
    path('getcitation', views.getcitation, name="getcitation"),
    re_path(r'^getcitation/(?P<citation_input>.+)$', views.getcitation, name="getcitation"),
    path('summarize_all', views.summarize_all, name="summarize_all"),
]