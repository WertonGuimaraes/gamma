import operator
from datetime import datetime

from rest_framework import filters


class OrderingCustom(filters.OrderingFilter):
    def filter_queryset(self, request, queryset, view):
        ordering = self.get_ordering(request, queryset, view)

        if ordering:
            ordering.reverse()
            for field in ordering:
                is_reverse = field.startswith("-")
                field = field[1:] if is_reverse else field
                queryset = sorted(queryset,
                                  key=lambda mbr: self.convert_elements_to_lower_case(operator.attrgetter(field)(mbr)),
                                  reverse=is_reverse)
        return queryset

    def convert_elements_to_lower_case(self, params):
        if type(params) == tuple:
            return tuple([self.convert_string_to_lower_case(element) for element in params])
        return self.convert_string_to_lower_case(params)

    @staticmethod
    def convert_string_to_lower_case(element):
        if isinstance(element, datetime):
            element = str(element)

        try:
            element = element.lower()
        except AttributeError:
            pass
        return element
