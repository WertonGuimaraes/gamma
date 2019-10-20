# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_settings', '0004_auto_20160524_1756'),
    ]

    operations = [
        migrations.AlterField(
            model_name='settings',
            name='update_time_participant_number',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(10), django.core.validators.MaxValueValidator(21600)]),
        ),
        migrations.AlterField(
            model_name='settings',
            name='update_time_push',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(300), django.core.validators.MaxValueValidator(86400)]),
        ),
        migrations.AlterField(
            model_name='settings',
            name='update_time_refresh_token',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(30), django.core.validators.MaxValueValidator(21600)]),
        ),
        migrations.AlterField(
            model_name='settingsauditlogentry',
            name='update_time_participant_number',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(10), django.core.validators.MaxValueValidator(21600)]),
        ),
        migrations.AlterField(
            model_name='settingsauditlogentry',
            name='update_time_push',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(300), django.core.validators.MaxValueValidator(86400)]),
        ),
        migrations.AlterField(
            model_name='settingsauditlogentry',
            name='update_time_refresh_token',
            field=models.IntegerField(validators=[django.core.validators.MinValueValidator(30), django.core.validators.MaxValueValidator(21600)]),
        ),
    ]
