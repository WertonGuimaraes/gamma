# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Settings',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('update_time_push', models.IntegerField()),
                ('update_time_participant_number', models.IntegerField()),
                ('update_time_refresh_token', models.IntegerField()),
                ('update_analytics_client_id', models.CharField(max_length=254, blank=True)),
            ],
        ),
    ]
