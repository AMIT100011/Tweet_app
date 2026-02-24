from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        "message": "Welcome to the SkyBird API!",
        "status": "Running",
        "docs": "/api/tweets/"
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('api/auth/', include('authentication.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/tweets/', include('tweets.urls')),
]
