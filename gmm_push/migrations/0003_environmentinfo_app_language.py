# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push', '0002_deviceuser_last_date_played'),
    ]

    operations = [
        migrations.AddField(
            model_name='environmentinfo',
            name='app_language',
            field=models.CharField(default='ALL', max_length=254),
            preserve_default=False,
        ),
    ]
