from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_push.filters import DeviceUserFilter
from gmm_push.models import DeviceUser
from gmm_push.serializers import PlayerSerializer
from gmm_util.field import Field
from gmm_util.util import StandardResultsSetPagination


class PlayerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, DjangoModelPermissions,)
    authentication_classes = (JSONWebTokenAuthentication, )

    queryset = DeviceUser.manager.all()
    serializer_class = PlayerSerializer
    pagination_class = StandardResultsSetPagination
    filter_class = DeviceUserFilter
    ordering_fields = (Field.GAME__NAME, Field.EMAIL, Field.GPG_ID, Field.GCM_ID, Field.DATE,
                       Field.ENVIRONMENT_INFO__COUNTRY)
