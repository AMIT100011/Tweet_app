from django.urls import path, include

urlpatterns = [
    path('api/auth/', include('authentication.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/tweets/', include('tweets.urls')),
]
