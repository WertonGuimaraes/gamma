# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push', '0004_auto_20160518_1441'),
    ]

    operations = [
        migrations.AlterField(
            model_name='deviceuser',
            name='last_date_played',
            field=models.DateTimeField(null=True),
        ),
    ]
