from audit_log.models.managers import AuditLog
from django.db import models
from django.db import transaction
from gmm_campaign.exceptions import InvalidCountryDataError
from gmm_util.field import Field


class Country(models.Model):
    country_name = models.CharField(max_length=254)
    country_code = models.CharField(max_length=3)

    manager = models.Manager()


class RegionManager(models.Manager):

    MIN_COUNTRIES = 2

    @transaction.atomic
    def create(self, region_data, countries_data):
        self._validate_countries_length(countries_data)

        region = super(RegionManager, self).create(**region_data)
        codes = [country[Field.COUNTRY_CODE] for country in countries_data]
        countries = Country.manager.filter(country_code__in=codes)
        region.countries = countries
        return region

    @transaction.atomic
    def edit(self, region, countries_data, region_data):
        self._validate_countries_length(countries_data)

        region.__dict__.update(**region_data)
        region.save()
        codes = [country[Field.COUNTRY_CODE] for country in countries_data]
        countries_data = Country.manager.filter(country_code__in=codes)
        region.countries = countries_data

        return region

    def _validate_countries_length(self, data):
        if len(data) < self.MIN_COUNTRIES:
            raise InvalidCountryDataError("The region must contain at least " + str(self.MIN_COUNTRIES) + " countries.")


class Region(models.Model):
    name = models.CharField(max_length=254)
    countries = models.ManyToManyField(Country)
    color = models.CharField(max_length=7, blank=True)
    modified_date = models.DateTimeField(auto_now=True, null=True)

    audit_log = AuditLog()
    manager = RegionManager()

    class Meta:
        permissions = (('view_region', 'Can view region'),)
