# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import gmm_util.PushDetailsUtil
import gmm_util.ApiKeyUtil


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeviceUser',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(max_length=254)),
                ('gpg_id', models.CharField(max_length=254)),
                ('gcm_id', models.CharField(max_length=254)),
                ('date', models.DateTimeField(auto_now_add=True)),
            ],
            bases=(models.Model, gmm_util.ApiKeyUtil.ApiKeyUtil, gmm_util.PushDetailsUtil.PushDetailsUtil),
        ),
        migrations.CreateModel(
            name='EnvironmentInfo',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('location_status', models.CharField(max_length=254)),
                ('location_country', models.CharField(max_length=254)),
                ('location_country_code', models.CharField(max_length=254)),
                ('location_region', models.CharField(max_length=254)),
                ('location_region_name', models.CharField(max_length=254)),
                ('location_city', models.CharField(max_length=254)),
                ('location_zip', models.CharField(max_length=254)),
                ('location_lat', models.CharField(max_length=254)),
                ('location_lon', models.CharField(max_length=254)),
                ('location_timezone', models.CharField(max_length=254)),
                ('location_isp', models.CharField(max_length=254)),
                ('location_org', models.CharField(max_length=254)),
                ('location_as', models.CharField(max_length=254)),
                ('location_query', models.CharField(max_length=254)),
                ('location_source', models.CharField(max_length=254)),
                ('location_date', models.DateTimeField()),
                ('app_version', models.CharField(max_length=254)),
                ('device_language', models.CharField(max_length=254)),
            ],
        ),
        migrations.AddField(
            model_name='deviceuser',
            name='environment_info',
            field=models.OneToOneField(null=True, to='gmm_push.EnvironmentInfo'),
        ),
        migrations.AddField(
            model_name='deviceuser',
            name='game',
            field=models.ForeignKey(related_name='users', to='gmm_game.Game', null=True),
        ),
    ]
