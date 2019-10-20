from django.test import TestCase

from gmm_region.filters import RegionFilter
from gmm_region.models import Region, Country


class FilterRegionTest(TestCase):

    def test__total_include_default_countries(self):
        # Arrange
        region_queryset = Region.manager.all()
        total_regions = Region.manager.count()
        # Act
        response_queryset = RegionFilter().filter_include_countries(region_queryset, "true")
        # Assert
        self.assertEqual(response_queryset.count(), total_regions)

    def test__not_include_default_countries(self):
        # Arrange
        region_queryset = Region.manager.all()
        # Act
        response_queryset = RegionFilter().filter_include_countries(region_queryset, "false")
        # Assert
        self.assertEqual(response_queryset.count(), 7)

    def test__filter_region_by_name(self):
        # Arrange
        region_queryset = Region.manager.all()
        # Act
        response_queryset = RegionFilter().filter_all(region_queryset, "Brazil")
        # Assert
        self.assertEqual(response_queryset.count(), 2)

    def test__filter_region_by_country_name(self):
        # Arrange
        new_region = Region(name="Created Region", color="#000000")
        new_region.save()
        new_region.countries = Country.manager.filter(country_name="Brazil")

        region_queryset = Region.manager.all()
        # Act
        response_queryset = RegionFilter().filter_all(region_queryset, "Brazil")
        # Assert
        self.assertEqual(response_queryset.count(), 3)

    def test__filter_region_by_country_code(self):
        # Arrange
        region_queryset = Region.manager.all()
        # Act
        response_queryset = RegionFilter().filter_all(region_queryset, "YT")
        # Assert
        self.assertEqual(response_queryset.count(), 2)
