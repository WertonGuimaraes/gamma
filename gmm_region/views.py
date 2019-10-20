from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_region.filters import RegionFilter
from gmm_region.models import Region
from gmm_region.serializer import RegionSerializer
from gmm_util.util import StandardResultsSetPagination


class RegionViewSet(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated, DjangoModelPermissions,)
    authentication_classes = (JSONWebTokenAuthentication,)

    queryset = Region.manager.all()
    serializer_class = RegionSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put']
    filter_class = RegionFilter
    ordering_fields = '__all__'
