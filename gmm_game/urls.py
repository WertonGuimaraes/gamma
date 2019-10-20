from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_game.views import GameViewSet

GAME = "game"
SEARCH = "game_search"

router = DefaultRouter()
router.register(r'game', GameViewSet, base_name=GAME)

urlpatterns = [
    url(r'^', include(router.urls)),
]
