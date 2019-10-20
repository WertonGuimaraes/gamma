# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_game', '0004_auto_20160524_1251'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='game',
            options={'permissions': (('view_game', 'Can view game'),)},
        ),
    ]
