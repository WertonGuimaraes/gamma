from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, DjangoModelPermissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from gmm_game.filters import GameFilter
from gmm_game.models import Game
from gmm_game.serializers import GameSerializer
from gmm_util.util import StandardResultsSetPagination


class GameViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated, DjangoModelPermissions,)
    authentication_classes = (JSONWebTokenAuthentication, )

    queryset = Game.manager.all()
    serializer_class = GameSerializer
    pagination_class = StandardResultsSetPagination
    http_method_names = ['get', 'post', 'put']
    filter_class = GameFilter
    ordering_fields = '__all__'
