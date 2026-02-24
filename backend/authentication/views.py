from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from profiles.models import Profile
import uuid


class SyncUserView(APIView):
    """
    POST /api/auth/sync-user
    Called by frontend after login to ensure local profile exists.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_id = request.user.user_id
        email = request.user.email or ''

        profile, created = Profile.objects.get_or_create(
            user_id=user_id,
            defaults={
                'id': uuid.uuid4(),
                'username': email.split('@')[0] if email else f'user_{str(user_id)[:8]}',
            }
        )

        return Response({
            'user_id': str(user_id),
            'username': profile.username,
            'profile_created': created,
        })
