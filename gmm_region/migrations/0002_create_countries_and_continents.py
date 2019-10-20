# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import pycountry
from django.db import migrations
from incf.countryutils import transformations


def create_countries(app, schema_editor):
    Country = app.get_model('gmm_region', 'Country')
    Region = app.get_model('gmm_region', 'Region')
    for country in pycountry.countries:
        country_obj = Country.objects.create(
            country_name=country.name,
            country_code=country.alpha2
        )
        country_obj.save()
        region_obj = Region.objects.create(
            name=country.name,
        )
        region_obj.countries.add(country_obj)
        region_obj.save()


def add_country_to_continent(
        country, continent_name, continents, region_model):
    if continent_name not in continents:
        continent_region = region_model.objects.create(
            name=continent_name
        )
        continent_region.save()
        continents[continent_name] = continent_region
    else:
        continent_region = continents[continent_name]

    continent_region.countries.add(country)


def create_continents(app, schema_editor):
    Country = app.get_model('gmm_region', 'Country')
    Region = app.get_model('gmm_region', 'Region')
    continents = {}
    for country in Country.objects.all():
        try:
            continent_name = transformations.cca_to_ctn(country.country_code)
        except KeyError:
            if country.country_code == 'SX':
                continent_name = 'North America'
            elif country.country_code == 'BQ':
                continent_name = 'South America'
            elif country.country_code == 'CW':
                continent_name = 'South America'
            elif country.country_code == 'SS':
                continent_name = 'Africa'
        finally:
            add_country_to_continent(
                country, continent_name, continents, Region)

    for continent_region in continents.values():
        continent_region.save()


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_region', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_countries),
        migrations.RunPython(create_continents)
    ]
