from django.conf.urls import url, patterns
from gmm_mobile.v1.views import BannerViewMobile
from gmm_mobile.v1.views import OpenedCampaignsViewMobile, ConsultParticipantMobile, ParticipantViewMobile
from gmm_mobile.v1.views import PlayerViewMobile


BANNER_MOBILE = "banner_mobile.opened"
CONSULT_PARTICIPANT = 'consult_participant_mobile'
OPENED_CAMPAIGNS = 'opened_campaigns_mobile'
PARTICIPANT_MOBILE = "participant_mobile"
PLAYER_MOBILE = 'player_mobile'


urlpatterns = patterns(
    '',
    url(r'^game/(?P<service_id>[0-9a-zA-Z]+)/banner.opened/?$', BannerViewMobile.as_view(), name=BANNER_MOBILE),
    url(r'^game/(?P<service_id>[0-9a-zA-Z]+)/campaign.opened/?$', OpenedCampaignsViewMobile.as_view(),
        name=OPENED_CAMPAIGNS),
    url(r'^game/(?P<service_id>[0-9a-zA-Z]+)/campaign/(?P<campaign_id>[0-9]+)/register/(?P<email>[@a-zA-Z0-9\._-]+)/?$',
        ConsultParticipantMobile.as_view(), name=CONSULT_PARTICIPANT),
    url(r'^game/(?P<service_id>[0-9a-zA-Z]+)/campaign/(?P<campaign_id>[0-9]+)/register/?$',
        ParticipantViewMobile.as_view(), name=PARTICIPANT_MOBILE),
    url(r'^game/(?P<game_service_id>[0-9a-zA-Z]+)/user/?$', PlayerViewMobile.as_view(), name=PLAYER_MOBILE),
    url(r'^game/(?P<game_service_id>[0-9a-zA-Z]+)/user/?$', PlayerViewMobile.as_view(), name=PLAYER_MOBILE),
)
