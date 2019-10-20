import django_filters
from django.db.models import Q
from gmm_banner.models import Banner
from gmm_banner.serializers import BannerSerializer
from gmm_banner.models import BannerConfiguration
from gmm_banner.serializers import BannerConfigurationSerializer
from gmm_util.constants import Constants
from gmm_util.field import Field


class BannerConfigurationFilter(django_filters.FilterSet):

    serializer = BannerConfigurationSerializer

    query = django_filters.MethodFilter(action='filter_all')
    country_code = django_filters.MethodFilter()
    active = django_filters.BooleanFilter()
    is_banner_exists = django_filters.MethodFilter()
    status = django_filters.MethodFilter()
    games = django_filters.MethodFilter()
    regions = django_filters.MethodFilter()
    banners = django_filters.MethodFilter()
    campaigns = django_filters.MethodFilter()

    class Meta:
        model = BannerConfiguration
        fields = [Field.QUERY, Field.COUNTRY_CODE, Field.ACTIVE, Field.GAMES, Field.REGIONS, Field.CAMPAIGNS,
                  Field.STATUS, Field.GAMES__GAME_SERVICE_ID]

    def filter_country_code(self, queryset, value):
        return queryset.filter(regions__countries__country_code__iexact=value)

    def filter_is_banner_exists(self, queryset, value):
        return queryset.filter(id__in=[banner.id for banner in queryset if banner.status == Constants.STATUS_STARTED])

    def filter_all(self, queryset, values):
        values = values.split(" ")
        for value in values:
            queryset = queryset.filter(
                Q(banner_configuration_name__icontains=value) |
                Q(games__name__icontains=value) |
                Q(regions__name__icontains=value) |
                Q(regions__countries__country_name__icontains=value) |
                Q(regions__countries__country_code__iexact=value)
            )
        return queryset.distinct()

    def filter_status(self, queryset, value):
        if value == Constants.PAUSED:
            queryset = queryset.filter(id__in=[banner.id for banner in queryset
                                               if banner.status == Constants.STATUS_PAUSED])
        elif value == Constants.FINISHED:
            queryset = queryset.filter(id__in=[banner.id for banner in queryset
                                               if banner.status == Constants.STATUS_FINISHED])
        elif value == Constants.STARTED:
            queryset = queryset.filter(id__in=[banner.id for banner in queryset
                                               if banner.status == Constants.STATUS_STARTED])
        elif value == Constants.ABOUT_TO_START:
            queryset = queryset.filter(id__in=[banner.id for banner in queryset
                                               if banner.status == Constants.STATUS_ABOUT_TO_START])
        return queryset

    def filter_banners(self, queryset, values):
        banner_ids = str(values).split(',')
        return queryset.filter(id__in=banner_ids)

    def filter_games(self, queryset, values):
        games_ids = str(values).split(',')
        return queryset.filter(games__id__in=games_ids)

    def filter_regions(self, queryset, values):
        country_codes = str(values).split(',')
        return queryset.filter(regions__countries__country_code__in=country_codes)

    def filter_campaigns(self, queryset, values):
        campaigns_id = str(values).split(',')
        return queryset.filter(campaigns__id__in=campaigns_id)

    @staticmethod
    def create_query_for_all_fields(data):
        return {Field.QUERY: data[Field.QUERY]}


class BannerFilter(django_filters.FilterSet):

    serializer = BannerSerializer

    country_code = django_filters.MethodFilter()
    bannerconfiguration__active = django_filters.BooleanFilter()
    is_banner_expired = django_filters.MethodFilter()
    language = django_filters.MethodFilter()

    class Meta:
        model = Banner
        fields = [Field.COUNTRY_CODE, Field.BANNER_CONFIGURATION_ACTIVE,
                  Field.BANNER_CONFIGURATION_GAMES_GAME_SERVICE_ID, Field.LANGUAGE]

    def filter_language(self, queryset, value):
        values = str(value).split(",") + [Constants.ALL_LANGUAGES]
        return queryset.filter(language__in=values).distinct()

    def filter_country_code(self, queryset, value):
        return queryset.filter(bannerconfiguration__regions__countries__country_code__iexact=value)

    def filter_is_banner_expired(self, queryset, value):
        return queryset.filter(Q(bannerconfiguration__end_date__gt=value) | Q(bannerconfiguration__end_date=None))
