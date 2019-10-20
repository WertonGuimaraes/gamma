# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0004_auto_20160516_1249'),
    ]

    operations = [
        migrations.RenameField(
            model_name='participation',
            old_name='date',
            new_name='registered_at',
        ),
    ]
