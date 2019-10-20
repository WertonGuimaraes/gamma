from dateutil import parser
import ast
from django.db.models import Q
import django_filters
from tzlocal import get_localzone
from gmm_push.models import DeviceUser
from gmm_util.field import Field


class DeviceUserFilter(django_filters.FilterSet):

    query = django_filters.MethodFilter(action='filter_all')
    location_country_codes = django_filters.MethodFilter()
    games = django_filters.MethodFilter()
    end_date = django_filters.MethodFilter()
    begin_date = django_filters.MethodFilter()

    class Meta:
        model = DeviceUser

        fields = [Field.QUERY, Field.GAMES, Field.LOCATION_COUNTRY_CODES, Field.END, Field.BEGIN]

    def filter_all(self, queryset, values):
        values = str(values).split(" ")
        for value in values:
            queryset = queryset.filter(
                Q(email__icontains=value) |
                Q(gpg_id__icontains=value) |
                Q(gcm_id__icontains=value))
        return queryset.distinct()

    def filter_games(self, queryset, values):
        games_ids = str(values).split(',')
        return queryset.filter(game__id__in=games_ids)

    def filter_location_country_codes(self, queryset, values):
        country_codes = str(values).split(',')
        return queryset.filter(environment_info__location_country_code__in=country_codes)

    def filter_end_date(self, queryset, values):
        local = get_localzone()
        end_date = parser.parse(values).astimezone(tz=local)
        return queryset.filter(last_date_played__lte=end_date)

    def filter_begin_date(self, queryset, values):
        local = get_localzone()
        begin_date = parser.parse(values).astimezone(tz=local)
        return queryset.filter(last_date_played__gte=begin_date)

    @staticmethod
    def create_query_for_all_fields(data):
        data = ast.literal_eval(data) if isinstance(data, (str, unicode)) else data
        query_data = {}

        if Field.QUERY in data:
            query_data[Field.QUERY] = data[Field.QUERY]
        if Field.GAMES in data:
            query_data[Field.GAMES] = data[Field.GAMES]
        if Field.LOCATION_COUNTRY_CODES in data:
            query_data[Field.LOCATION_COUNTRY_CODES] = data[Field.LOCATION_COUNTRY_CODES]

        return query_data
