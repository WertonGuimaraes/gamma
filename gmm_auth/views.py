from django.contrib.auth.models import User, Group
from rest_framework import filters
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_auth.filters import UserFilter, GroupFilter
from gmm_auth.serializers import UserSerializer, GroupSerializer
from gmm_util.field import Field
from gmm_util.ordering import OrderingCustom
from gmm_util.util import StandardResultsSetPagination


class UserViewSet(viewsets.ModelViewSet):
    permission_classes = (DjangoModelPermissions, IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication,)

    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put', 'patch']
    filter_class = UserFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingCustom,)
    ordering_fields = (Field.USERNAME, Field.EMAIL, Field.IS_ACTIVE, Field.GROUPS, Field.FIRST_NAME,
                       Field.LAST_NAME, )


class GroupUserViewSet(viewsets.ModelViewSet):
    permission_classes = (DjangoModelPermissions, IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication,)

    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put', 'patch']
    filter_class = GroupFilter
    filter_backends = (filters.DjangoFilterBackend, OrderingCustom,)
    ordering_fields = (Field.NAME, )
