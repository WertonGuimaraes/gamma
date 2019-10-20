# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_game', '0002_auto_20160425_1636'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='game',
            name='analytics_link',
        ),
        migrations.RemoveField(
            model_name='gameauditlogentry',
            name='analytics_link',
        ),
        migrations.AddField(
            model_name='game',
            name='analytics_view_id',
            field=models.IntegerField(null=True, blank=True),
        ),
        migrations.AddField(
            model_name='gameauditlogentry',
            name='analytics_view_id',
            field=models.IntegerField(null=True, blank=True),
        ),
    ]
