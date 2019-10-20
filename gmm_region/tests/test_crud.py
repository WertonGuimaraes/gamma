from django.test import TestCase

from gmm_region.models import Region
from gmm_campaign.exceptions import InvalidCountryDataError
from gmm_util.field import Field
from gmm_util.util_test import JsonObjects


class TestHelper(object):

    @staticmethod
    def get_region_json(name, color):
        return {Field.NAME: name, Field.COLOR: color}

    @staticmethod
    def region2json(region):
        return TestHelper.get_region_json(region.name, region.color)

    @staticmethod
    def get_country_json(code):
        return {Field.COUNTRY_CODE: code}

    @staticmethod
    def get_list_of_countries_json(codes):
        return [TestHelper.get_country_json(code) for code in codes]

    @staticmethod
    def country2json(country):
        return TestHelper.get_country_json(country.country_code)

    @staticmethod
    def countries2json(countries):
        return [TestHelper.country2json(country) for country in countries]


class EditRegionTest(TestCase):
    MIN_COUNTRIES = 2
    ERROR_NUMBER_OF_COUNTRIES = "The region must contain at least " + str(MIN_COUNTRIES) + " countries."

    def setUp(self):
        self.region_data = JsonObjects.region()
        self.region_countries_data = self.region_data.pop(Field.COUNTRIES)
        self.region = Region.manager.create(self.region_data, self.region_countries_data)

    def test__region_edit_success(self):
        # Arrange
        new_name = self.region.name + "_was_modified"
        self.region_data[Field.NAME] = new_name

        # Act
        Region.manager.edit(self.region, self.region_countries_data, self.region_data)

        # Assert
        self.assertEquals(new_name, Region.manager.get(id=self.region.id).name)

    def test__region_edit_error_numberOfCountries(self):
        for i in range(self.MIN_COUNTRIES):
            try:
                # Act
                Region.manager.edit(self.region, self.region_countries_data[:i], self.region_data)

                # Assert
                self.fail("Succeeded edition with " + str(i) + " countries")
            except InvalidCountryDataError, e:
                self.assertEquals(self.ERROR_NUMBER_OF_COUNTRIES, str(e))
