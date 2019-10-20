from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_settings.models import Settings
from gmm_settings.serializers import SettingsSerializer
from gmm_util.util import StandardResultsSetPagination


class SettingsViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, DjangoModelPermissions,)
    authentication_classes = (JSONWebTokenAuthentication,)

    queryset = Settings.manager.filter()
    serializer_class = SettingsSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['put', 'get']

    def list(self, request, *args, **kwargs):
        instance = Settings.manager.first()
        serializer = self.get_serializer(instance)

        return Response(serializer.data)
