# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push_notification', '0003_auto_20160428_1334'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='pushdetails',
            options={'permissions': (('view_push', 'Can view push'),)},
        ),
    ]
