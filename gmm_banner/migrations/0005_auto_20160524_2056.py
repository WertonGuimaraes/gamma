# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_banner', '0004_auto_20160523_1404'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='bannerconfiguration',
            options={'permissions': (('view_bannerconfiguration', 'Can view banner'),)},
        ),
    ]
