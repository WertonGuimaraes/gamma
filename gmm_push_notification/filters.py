from distutils.util import strtobool

import django_filters

from gmm_push_notification.models import Push
from gmm_util.field import Field


class PushFilter(django_filters.FilterSet):
    include_pushes_not_sent = django_filters.MethodFilter()

    class Meta:
        model = Push

        fields = (Field.INCLUDE_PUSHES_NOT_SENT,)

    def filter_include_pushes_not_sent(self, queryset, value):
        value = strtobool(value)

        if not value:
            queryset = queryset.filter(can_send_push=False)
        return queryset
