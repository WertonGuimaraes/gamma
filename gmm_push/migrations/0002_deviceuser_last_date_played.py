# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='deviceuser',
            name='last_date_played',
            field=models.DateTimeField(null=True),
        ),
    ]
