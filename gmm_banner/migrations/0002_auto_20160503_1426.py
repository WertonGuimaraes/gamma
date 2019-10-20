# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_banner', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='bannerconfiguration',
            old_name='name',
            new_name='banner_configuration_name',
        ),
        migrations.RenameField(
            model_name='bannerconfigurationauditlogentry',
            old_name='name',
            new_name='banner_configuration_name',
        ),
        migrations.AddField(
            model_name='banner',
            name='name',
            field=models.CharField(default=None, max_length=254),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='bannerconfiguration',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='bannerconfigurationauditlogentry',
            name='created_date',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
    ]
