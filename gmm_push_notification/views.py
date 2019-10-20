from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_push_notification.filters import PushFilter
from gmm_push_notification.models import Push, PushDetails, PushesList
from gmm_push_notification.serializers import PushSerializer, PushDetailsSerializer, PushesListSerializer
from gmm_util.util import StandardResultsSetPagination


class PushViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, DjangoModelPermissions,)
    authentication_classes = (JSONWebTokenAuthentication, )

    queryset = Push.manager.all()
    serializer_class = PushSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put']
    filter_class = PushFilter
    ordering_fields = '__all__'


class PushesListViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication, )

    serializer_class = PushesListSerializer
    http_method_names = ['post']


class PushDetailsViewSet(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication, )

    queryset = PushDetails.manager.all()
    serializer_class = PushDetailsSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get']

    def retrieve(self, request, push_id=None):
        queryset = PushDetails.manager.filter(push__id=push_id)
        page = self.paginate_queryset(queryset)

        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
