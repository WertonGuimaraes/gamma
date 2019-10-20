from rest_framework import filters
from rest_framework import mixins
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework.views import APIView
from rest_framework.viewsets import GenericViewSet
from rest_framework_jwt.authentication import JSONWebTokenAuthentication

from gmm_campaign.filters import ParticipationFilter, CampaignFilter
from gmm_campaign.models import Campaign, Participation
from gmm_campaign.serializers import CampaignSerializer, ParticipationSerializer
from gmm_util.field import Field
from gmm_util.ordering import OrderingCustom
from gmm_util.response import ResponseUtils
from gmm_util.util import StandardResultsSetPagination


class CampaignViewSet(viewsets.ModelViewSet):

    permission_classes = (IsAuthenticated, DjangoModelPermissions,)
    authentication_classes = (JSONWebTokenAuthentication, )

    queryset = Campaign.manager.all()
    serializer_class = CampaignSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put', 'patch']
    filter_backends = (filters.DjangoFilterBackend, OrderingCustom,)
    filter_class = CampaignFilter
    ordering_fields = (Field.CREATED_DATE, Field.MODIFIED_DATE, Field.NAME, Field.BEGIN, Field.END, Field.STATUS,
                       Field.TOTAL_REGISTERED_PARTICIPANTS, Field.TOTAL_REGISTERED_PERCENTAGE)


class ParticipantByCampaignView(mixins.ListModelMixin, GenericViewSet):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication, )
    queryset = Participation.manager.all()
    serializer_class = ParticipationSerializer
    pagination_class = StandardResultsSetPagination
    filter_class = ParticipationFilter
    ordering_fields = (Field.PLAYER__GAME__NAME, Field.PLAYER__EMAIL, Field.PLAYER__GPG_ID, Field.CAMPAIGN__NAME,
                       Field.DATE, Field.LOCATION__LOCATION_COUNTRY, Field.PLAYER__LAST_DATE_PLAYED)


class ParticipantView(APIView):
    permission_classes = (IsAuthenticated, )
    authentication_classes = (JSONWebTokenAuthentication, )

    def get(self, request, campaign_id):
        participation_result = Participation.manager.filter(campaign__id=campaign_id)
        participation_result_serializer = ParticipationSerializer(participation_result, many=True)

        return ResponseUtils.ok(participation_result_serializer.data)
