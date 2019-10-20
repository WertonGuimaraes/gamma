from distutils.util import strtobool

from django.db.models import Q
import django_filters

from gmm_banner.models import Region
from gmm_banner.serializers import RegionSerializer
from gmm_region.models import RegionManager
from gmm_util.field import Field


class RegionFilter(django_filters.FilterSet):

    serializer = RegionSerializer

    query = django_filters.MethodFilter(action='filter_all')
    include_countries = django_filters.MethodFilter(action='filter_include_countries')

    class Meta:
        model = Region
        fields = [Field.QUERY, Field.INCLUDE_COUNTRIES]

    def filter_all(self, queryset, value):
        for v in value.split(" "):
            queryset = queryset.filter(
                Q(name__icontains=v) |
                Q(countries__country_name__icontains=v) |
                Q(countries__country_code__iexact=v)
            )
        return queryset.distinct()

    def filter_include_countries(self, queryset, value):
        value = strtobool(value)

        if not value:
            valid_region_ids = [
                region.id
                for region in queryset
                if region.countries.count() >= RegionManager.MIN_COUNTRIES
            ]
            queryset = queryset.filter(id__in=valid_region_ids)
        return queryset

    @staticmethod
    def create_query_for_all_fields(data):
        return {
            Field.QUERY: data[Field.QUERY],
            Field.INCLUDE_COUNTRIES: data.get(Field.INCLUDE_COUNTRIES, True)
        }
