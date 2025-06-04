from django.urls import path
from . import views


app_name = "eazyyapp"


urlpatterns = [
    path('', views.home, name='home'),
    path('save_step1/', views.save_step1, name='save_step1'),
    path('save_step2/', views.save_step2, name='save_step2'),
    path('save_step3/', views.save_step3, name='save_step3'),
    path('save_step4/', views.save_step4, name='save_step4'),
    path('save_step5/', views.save_step5, name='save_step5'),  # Signup + OTP
    path('save_step52/', views.save_step52, name='save_step52'),  # Verify OTP
    path('save_step51/', views.save_step51, name='save_step51'),  # Login

path('submit_order/', views.submit_order, name='submit_order'),

]