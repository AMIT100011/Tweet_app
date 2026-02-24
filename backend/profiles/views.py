from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import NotFound
from .models import Profile
from .serializers import ProfileSerializer


class MyProfileView(APIView):
    """GET /api/profile/me"""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            profile = Profile.objects.get(user_id=request.user.user_id)
        except Profile.DoesNotExist:
            raise NotFound('Profile not found. Call /api/auth/sync-user first.')
        return Response(ProfileSerializer(profile).data)
