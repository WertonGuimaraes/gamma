# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_game', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='analytics_link',
            field=models.URLField(default=None, max_length=254),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='gameauditlogentry',
            name='analytics_link',
            field=models.URLField(default=None, max_length=254),
            preserve_default=False,
        ),
    ]
