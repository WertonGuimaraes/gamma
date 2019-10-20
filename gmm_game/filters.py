from django.db.models import Q
import django_filters

from gmm_game.models import Game
from gmm_game.serializers import GameSerializer
from gmm_util.field import Field


class GameFilter(django_filters.FilterSet):

    serializer = GameSerializer

    query = django_filters.MethodFilter(action='filter_all')

    class Meta:
        model = Game
        fields = [Field.QUERY]

    def filter_all(self, queryset, values):
        values = values.split(" ")
        for value in values:
            queryset = queryset.filter(
                Q(name__icontains=value) |
                Q(package_name__icontains=value) |
                Q(game_service_id__icontains=value)
            )
        return queryset.distinct()

    @staticmethod
    def create_query_for_all_fields(data):
        return {Field.QUERY: data[Field.QUERY]}
