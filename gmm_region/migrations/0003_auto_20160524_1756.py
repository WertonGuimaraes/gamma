# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_region', '0002_create_countries_and_continents'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='region',
            options={'permissions': (('view_region', 'Can view region'),)},
        ),
    ]
