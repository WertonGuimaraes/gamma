# -*- coding: utf-8 -*-
from __future__ import unicode_literals

import pycountry
from django.db import migrations
from incf.countryutils import transformations

from gmm_util.constants import Constants


def update_init_data_settings(app, schema_editor):
    Time = app.get_model('gmm_settings', 'Settings')
    time = Time.objects.create(update_time_push=Constants.TIME_TO_VERIFY_PUSH_TO_SEND,
                               update_time_participant_number=Constants.TIME_UPDATE_PARTICIPANT_NUMBER,
                               update_time_refresh_token=Constants.TIME_TO_REFRESH_TOKEN)
    time.save()


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_settings', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(update_init_data_settings)
    ]
