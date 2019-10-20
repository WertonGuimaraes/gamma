import django_filters
from django.contrib.auth.models import User, Group
from django.db.models import Q

from gmm_auth.serializers import UserSerializer, UserGroupSerializer
from gmm_util.field import Field


class UserFilter(django_filters.FilterSet):
    serializer = UserSerializer

    query = django_filters.MethodFilter(action='filter_all')
    is_active = django_filters.BooleanFilter()
    username = django_filters.MethodFilter()
    email = django_filters.MethodFilter()
    groups = django_filters.MethodFilter()
    name = django_filters.MethodFilter()

    class Meta:
        model = User
        fields = (Field.NAME, Field.QUERY, Field.USERNAME, Field.EMAIL, Field.IS_ACTIVE, Field.GROUPS, )

    def filter_all(self, queryset, values):
        values = values.split(" ")
        for value in values:
            queryset = queryset.filter(
                Q(username__icontains=value) |
                Q(email__icontains=value) |
                Q(is_active=value) |
                Q(groups__name__icontains=value) |
                Q(first_name__icontains=value) |
                Q(last_name__icontains=value)
            )
        return queryset.distinct()

    def filter_username(self, queryset, value):
        return queryset.filter(username__icontains=value)

    def filter_email(self, queryset, value):
        return queryset.filter(email__icontains=value)

    def filter_groups(self, queryset, value):
        return queryset.filter(groups__name=value)

    def filter_name(self, queryset, value):
        return queryset.filter(
                Q(last_name__icontains=value) |
                Q(first_name__icontains=value))


class GroupFilter(django_filters.FilterSet):

    serializer = UserGroupSerializer

    name = django_filters.MethodFilter()

    class Meta:
        model = Group

    def filter_name(self,  queryset, value):
        return queryset.filter(name__icontains=value)
