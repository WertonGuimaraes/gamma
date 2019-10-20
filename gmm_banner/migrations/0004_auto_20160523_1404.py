# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_banner', '0003_auto_20160504_1829'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bannerconfiguration',
            options={'permissions': (('view_banner', 'Can view banner'),)},
        ),
    ]
