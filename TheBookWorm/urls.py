from django.contrib import admin
from django.urls import path

from egyptian_constitution_app.views import Question, Login, Logout, Register

urlpatterns = [
    path('', admin.site.urls),
    path('admin/', admin.site.urls),
    path('api/question', Question.as_view()),
    path('api/login/', Login.as_view()),
    path('api/logout/', Logout.as_view()),
    path('api/register/', Register.as_view()),

]
