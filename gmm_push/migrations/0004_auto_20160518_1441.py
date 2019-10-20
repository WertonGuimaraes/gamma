# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import datetime
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push', '0003_environmentinfo_app_language'),
    ]

    operations = [
        migrations.RenameField(
            model_name='deviceuser',
            old_name='date',
            new_name='registered_at',
        ),
        migrations.AlterField(
            model_name='deviceuser',
            name='last_date_played',
            field=models.DateTimeField(default=datetime.datetime(2016, 5, 18, 14, 41, 7, 330030, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
