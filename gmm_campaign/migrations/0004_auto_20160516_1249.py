# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0003_auto_20160427_1715'),
    ]

    operations = [
        migrations.AddField(
            model_name='campaign',
            name='last_enabled_time',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='campaign',
            name='partial_enabled_time',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='campaignauditlogentry',
            name='last_enabled_time',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='campaignauditlogentry',
            name='partial_enabled_time',
            field=models.IntegerField(default=0),
        ),
    ]
