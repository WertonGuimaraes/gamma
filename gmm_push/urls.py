from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_push.views import PlayerViewSet

PLAYER = 'player'

router = DefaultRouter()
router.register(r'player', PlayerViewSet, base_name=PLAYER)

urlpatterns = [
    url(r'^', include(router.urls)),
]
