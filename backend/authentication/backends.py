import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed


class SupabaseUser:
    """Lightweight user object extracted from Supabase JWT."""

    def __init__(self, user_id, email=None):
        self.id = user_id
        self.pk = user_id          # DRF expects .pk
        self.user_id = user_id
        self.email = email
        self.is_authenticated = True
        self.is_active = True

    def __str__(self):
        return str(self.user_id)


class SupabaseJWTAuthentication(BaseAuthentication):
    """
    Verify Supabase-issued JWTs.

    Frontend must send:
        Authorization: Bearer <supabase_jwt>
    """

    def authenticate(self, request):
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return None

        token = auth_header.split(' ', 1)[1].strip()
        if not token:
            return None

        try:
            # Supabase often provides secrets as Base64 strings
            secret = settings.SUPABASE_JWT_SECRET
            try:
                import base64
                # Check if it looks like base64 and decode if so
                # PyJWT can handle both bytes and strings, but we need the raw bytes if it's base64
                if len(secret) % 4 == 0 and any(c in secret for c in '+/='):
                    secret = base64.b64decode(secret)
            except Exception:
                pass

            payload = jwt.decode(
                token,
                secret,
                algorithms=['HS256'],
                options={"verify_exp": True},
            )
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Your session has expired. Please log in again.')
        except jwt.InvalidTokenError as e:
            raise AuthenticationFailed(f'Invalid authentication token: {e}')
        except Exception as e:
            raise AuthenticationFailed(f'Authentication error: {str(e)}')

        user_id = payload.get('sub')
        if not user_id:
            raise AuthenticationFailed('Token missing subject (sub) claim.')

        email = payload.get('email')
        user = SupabaseUser(user_id=user_id, email=email)
        return (user, token)

    def authenticate_header(self, request):
        return 'Bearer'
