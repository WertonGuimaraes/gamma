from rest_framework.permissions import AllowAny
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from gmm_util.header import Header


class MobileTokenPermission(AllowAny):
    def has_permission(self, request, view):
        return Header.valid_token(request)


class MobileTokenAuthentication(JSONWebTokenAuthentication):
    def authenticate(self, request):
        pass

    def authenticate_header(self, request):
        """
        Return a string to be used as the value of the `WWW-Authenticate`
        header in a `401 Unauthenticated` response, or `None` if the
        authentication scheme should return `403 Permission Denied` responses.
        """
        return "AllowAny Authentication"
