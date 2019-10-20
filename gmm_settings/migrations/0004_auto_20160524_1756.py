# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_settings', '0003_settingsauditlogentry'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='settings',
            options={'permissions': (('view_settings', 'Can view settings'),)},
        ),
    ]
