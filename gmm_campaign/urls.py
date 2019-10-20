from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_campaign.views import ParticipantByCampaignView
from gmm_campaign.views import ParticipantView
from gmm_campaign.views import CampaignViewSet

CAMPAIGN = "campaign"
PARTICIPANT = 'participant'
SEARCH_CAMPAIGN = 'search_campaign'
SEARCH_PARTICIPANT = 'search_participant'

router = DefaultRouter()
router.register(r'campaign', CampaignViewSet, base_name=CAMPAIGN)
router.register(r'participant', ParticipantByCampaignView, base_name=PARTICIPANT)

urlpatterns = [
    url(r'^', include(router.urls)),
    url(r'^campaign/(?P<campaign_id>[0-9]+)/participant/?$', ParticipantView.as_view(), name=PARTICIPANT),
]
