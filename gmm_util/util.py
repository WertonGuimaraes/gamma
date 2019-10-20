from django.contrib.auth.models import Permission
from django.db.models import Q
from django.db.models.fields.related import ManyToManyField
from pycountry import countries
from rest_framework.compat import OrderedDict
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from gmm_campaign.exceptions import EmptyFieldError, RegionsWithTheSameCountryForThisEntityError, \
    CountryNameDoesNotMatchWithCountryCode
from gmm_mobile.v1.exceptions import InvalidCountryCodeError
from gmm_region.models import Country
from gmm_settings.models import Settings
from gmm_util.constants import Constants
from gmm_util.field import Field


class CountryUtil(object):
    @staticmethod
    def valid_country_code(country_code):
        try:
            countries.get(alpha2=country_code)
        except KeyError:
            raise InvalidCountryCodeError()

    @staticmethod
    def validate_country_code_matching_with_name(country_name, country_code):
        try:
            Country.manager.get(country_name=country_name, country_code=country_code)
        except Country.DoesNotExist:
            raise CountryNameDoesNotMatchWithCountryCode(country_name, country_code)


class ValidateRegionsUtil(object):
    @staticmethod
    def validate_regions(initial_data, data):
        country_names = [countries_names[Field.COUNTRY_NAME]
                         for regions in initial_data[Field.REGIONS]
                         for countries_names in regions[Field.COUNTRIES]]

        if len(country_names) != len(set(country_names)):
            raise RegionsWithTheSameCountryForThisEntityError()

        if Field.REGIONS in initial_data:
            if not data:
                raise EmptyFieldError()
            return initial_data[Field.REGIONS]
        else:
            return None


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 50

    def __init__(self):
        self.page = 1

    def paginate_queryset(self, queryset, request, view=None):
        self.page = request.GET.get(Field.PAGE, 1)

        if self.show_all_elements():
            return list(queryset)
        return super(StandardResultsSetPagination, self).paginate_queryset(queryset, request, view)

    def get_paginated_response(self, data):
        response = Response(OrderedDict([
            ('count', len(data)),
            ('time-to-update-participant-number', Settings.manager.first().update_time_participant_number),
            ('next', None), ('previous', None), ('results', data)]))
        if not self.show_all_elements():
            response.data.update(super(StandardResultsSetPagination, self).get_paginated_response(data).data)
        return response

    def show_all_elements(self):
        return self.page == Constants.ALL_ELEMENTS_OF_THE_QUERYSET


def to_dict(instance):
    opts = instance._meta
    data = {}
    for f in opts.concrete_fields + opts.many_to_many:
        if isinstance(f, ManyToManyField):
            if instance.pk is None:
                data[f.name] = []
            else:
                data[f.name] = list(f.value_from_object(instance).values_list(Field.ID, flat=True))
        else:
            data[f.name] = f.value_from_object(instance)
    return data

def get_permissions(filter_permissions):
    query = Q()
    for permission in filter_permissions:
        query = query | Q(codename__icontains=permission)
    return Permission.objects.filter(query)
