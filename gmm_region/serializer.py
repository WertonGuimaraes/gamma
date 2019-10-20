from rest_framework import serializers
from gmm_region.models import Region, Country
from gmm_util.field import Field
from gmm_campaign.exceptions import RegionAlreadyExistsError, CountryDoesNotExistError


class CountrySerializer(serializers.ModelSerializer):

    class Meta:
        model = Country
        fields = (Field.COUNTRY_NAME, Field.COUNTRY_CODE, Field.ID)

    def validate(self, data):
        country = Country.manager.filter(**data)
        if not country.exists():
            raise CountryDoesNotExistError(
                data[Field.COUNTRY_NAME], data[Field.COUNTRY_CODE])

        return data


class RegionSerializer(serializers.ModelSerializer):
    countries = CountrySerializer(many=True)

    class Meta:
        model = Region
        fields = (Field.ID, Field.NAME, Field.COLOR, Field.COUNTRIES, Field.MODIFIED_DATE)

    def create(self, data):
        if Region.manager.filter(name=data[Field.NAME]).exists():
            raise RegionAlreadyExistsError(data[Field.NAME])

        countries_data = data.pop(Field.COUNTRIES)
        return Region.manager.create(data, countries_data)

    def update(self, region, region_data):
        countries = region_data.pop(Field.COUNTRIES)
        return Region.manager.edit(region, countries, region_data)
