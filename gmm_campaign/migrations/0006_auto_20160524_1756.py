# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0005_auto_20160518_1451'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='campaign',
            options={'permissions': (('view_campaign', 'Can view campaign'),)},
        ),
        migrations.AlterModelOptions(
            name='participation',
            options={'permissions': (('view_participation', 'Can view participation'),)},
        ),
    ]
