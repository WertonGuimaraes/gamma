import ast
import django_filters
from dateutil import parser
from django.db.models import Q
from tzlocal import get_localzone
from gmm_campaign.models import Campaign, Participation
from gmm_util.constants import Constants
from gmm_util.field import Field


class CampaignFilter(django_filters.FilterSet):
    query = django_filters.MethodFilter(action='filter_all')
    opened = django_filters.MethodFilter()
    country_code = django_filters.MethodFilter()
    status = django_filters.MethodFilter()
    games = django_filters.MethodFilter()
    regions = django_filters.MethodFilter()
    campaigns = django_filters.MethodFilter()

    class Meta:
        model = Campaign
        fields = [Field.QUERY, Field.OPENED, Field.COUNTRY_CODE, Field.STATUS, Field.GAMES, Field.REGIONS, Field.NAME,
                  Field.CAMPAIGNS]

    def filter_country_code(self, queryset, value):
        return queryset.filter(regions__countries__country_code__iexact=value)

    def filter_opened(self, queryset, value):
        opened_campaigns = [campaign.id for campaign in queryset if campaign.opened]
        if value:
            return queryset.filter(id__in=opened_campaigns)
        else:
            return queryset.exclude(id__in=opened_campaigns)

    def filter_status(self, queryset, value):
        if value == Constants.PAUSED:
            queryset = queryset.filter(id__in=[campaign.id for campaign in queryset
                                               if campaign.status == Constants.STATUS_PAUSED])
        elif value == Constants.FINISHED:
            queryset = queryset.filter(id__in=[campaign.id for campaign in queryset
                                               if campaign.status == Constants.STATUS_FINISHED])
        elif value == Constants.STARTED:
            queryset = queryset.filter(id__in=[campaign.id for campaign in queryset
                                               if campaign.status == Constants.STATUS_STARTED])
        elif value == Constants.ABOUT_TO_START:
            queryset = queryset.filter(id__in=[campaign.id for campaign in queryset
                                               if campaign.status == Constants.STATUS_ABOUT_TO_START])
        return queryset

    def filter_all(self, queryset, values):
        values = values.split(" ")
        for value in values:
            queryset = queryset.filter(
                Q(name__icontains=value) |
                Q(forms__game__name__icontains=value) |
                Q(regions__name__icontains=value) |
                Q(regions__countries__country_name__contains=value) |
                Q(regions__countries__country_code__iexact=value)
            )
        return queryset.distinct()

    def filter_games(self, queryset, values):
        games_ids = str(values).split(',')
        return queryset.filter(forms__game__id__in=games_ids)

    def filter_regions(self, queryset, values):
        country_codes = str(values).split(',')
        return queryset.filter(regions__countries__country_code__in=country_codes)

    def filter_campaigns(self, queryset, values):
        campaigns_id = str(values).split(',')
        return queryset.filter(id__in=campaigns_id)

    @staticmethod
    def create_query_for_all_fields(data):
        return {Field.QUERY: data[Field.QUERY]}


class ParticipationFilter(django_filters.FilterSet):
    query = django_filters.MethodFilter(action='filter_all')
    location_country_codes = django_filters.MethodFilter()
    player = django_filters.MethodFilter()
    campaigns = django_filters.MethodFilter()
    games = django_filters.MethodFilter()
    end_date = django_filters.MethodFilter()
    begin_date = django_filters.MethodFilter()

    class Meta:
        model = Participation
        fields = [Field.QUERY, Field.PLAYER, Field.GAMES, Field.LOCATION_COUNTRY_CODES, Field.CAMPAIGNS, Field.END,
                  Field.BEGIN]

    def filter_campaigns(self, queryset, values):
        campaigns_ids = values.split(',')
        return queryset.filter(campaign__id__in=campaigns_ids)

    def filter_location_country_codes(self, queryset, values):
        country_codes = values.split(',')
        return queryset.filter(location__location_country_code__in=country_codes)

    def filter_end_date(self, queryset, values):
        local = get_localzone()
        end_date = parser.parse(values).astimezone(tz=local)
        return queryset.filter(player__last_date_played__lte=end_date)

    def filter_begin_date(self, queryset, values):
        local = get_localzone()
        begin_date = parser.parse(values).astimezone(tz=local)
        return queryset.filter(player__last_date_played__gte=begin_date)

    def filter_all(self, queryset, values):

        values = values.split(" ")
        for value in values:
            queryset = queryset.filter(
                Q(player__email__icontains=value) |
                Q(player__gpg_id__icontains=value) |
                Q(player__gcm_id__icontains=value))

        return queryset.distinct()

    def filter_games(self, queryset, values):
        games_ids = values.split(',')
        return queryset.filter(player__game__id__in=games_ids)

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
        if Field.CAMPAIGNS in data:
            query_data[Field.CAMPAIGNS] = data[Field.CAMPAIGNS]
        return query_data
