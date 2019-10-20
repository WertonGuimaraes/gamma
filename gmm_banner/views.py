from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_banner.filters import BannerConfigurationFilter
from gmm_banner.models import BannerConfiguration
from gmm_banner.serializers import BannerConfigurationSerializer
from gmm_util.field import Field
from gmm_util.ordering import OrderingCustom
from gmm_util.util import StandardResultsSetPagination


class BannerViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, DjangoModelPermissions, )
    authentication_classes = (JSONWebTokenAuthentication,)

    queryset = BannerConfiguration.manager.all()
    serializer_class = BannerConfigurationSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put', 'patch']
    filter_class = BannerConfigurationFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingCustom,)
    ordering_fields = (Field.CREATED_DATE, Field.MODIFIED_DATE, Field.BANNER_CONFIGURATION_NAME, Field.STATUS,
                       Field.BEGIN, Field.END, Field.LANGUAGE)
