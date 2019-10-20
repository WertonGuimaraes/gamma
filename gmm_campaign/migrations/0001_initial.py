# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import gmm_util.PushDetailsUtil
import audit_log.models.fields
import django.utils.timezone
from django.conf import settings
import gmm_util.ApiKeyUtil


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_game', '0001_initial'),
        ('gmm_push', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gmm_region', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Campaign',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=50)),
                ('active', models.BooleanField(default=False)),
                ('begin_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('gmt_timezone', models.CharField(max_length=254)),
                ('participant_limit', models.IntegerField()),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('expiration_date', models.DateTimeField()),
                ('can_send_push', models.BooleanField(default=True)),
                ('regions', models.ManyToManyField(to='gmm_region.Region')),
            ],
        ),
        migrations.CreateModel(
            name='CampaignAuditLogEntry',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('name', models.CharField(max_length=50)),
                ('active', models.BooleanField(default=False)),
                ('begin_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('gmt_timezone', models.CharField(max_length=254)),
                ('participant_limit', models.IntegerField()),
                ('created_date', models.DateTimeField(auto_now_add=True, null=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('expiration_date', models.DateTimeField()),
                ('can_send_push', models.BooleanField(default=True)),
                ('action_id', models.AutoField(serialize=False, primary_key=True)),
                ('action_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('action_type', models.CharField(
                    max_length=1, editable=False, choices=[('I', 'Created'), ('U', 'Changed'), ('D', 'Deleted')])),
                ('action_user', audit_log.models.fields.LastUserField(
                    related_name='_campaign_audit_log_entry', editable=False, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ('-action_date',),
                'default_permissions': (),
            },
        ),
        migrations.CreateModel(
            name='Location',
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
        migrations.CreateModel(
            name='Participation',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('info', models.TextField(null=True, blank=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('campaign', models.ForeignKey(related_name='participations', to='gmm_campaign.Campaign')),
                ('location', models.OneToOneField(to='gmm_campaign.Location')),
                ('player', models.ForeignKey(related_name='player', to='gmm_push.DeviceUser')),
            ],
            bases=(models.Model, gmm_util.ApiKeyUtil.ApiKeyUtil, gmm_util.PushDetailsUtil.PushDetailsUtil),
        ),
        migrations.CreateModel(
            name='PushRules',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('form_push_value', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='Rule',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('form_value', models.TextField()),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('campaign', models.ForeignKey(related_name='forms', to='gmm_campaign.Campaign')),
                ('game', models.ForeignKey(related_name='forms', to='gmm_game.Game')),
            ],
        ),
        migrations.CreateModel(
            name='RuleAuditLogEntry',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('form_value', models.TextField()),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('action_id', models.AutoField(serialize=False, primary_key=True)),
                ('action_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('action_type', models.CharField(
                    max_length=1, editable=False, choices=[('I', 'Created'), ('U', 'Changed'), ('D', 'Deleted')])),
                ('action_user', audit_log.models.fields.LastUserField(
                    related_name='_rule_audit_log_entry', editable=False, to=settings.AUTH_USER_MODEL, null=True)),
                ('campaign', models.ForeignKey(related_name='_auditlog_forms', to='gmm_campaign.Campaign')),
                ('game', models.ForeignKey(related_name='_auditlog_forms', to='gmm_game.Game')),
            ],
            options={
                'ordering': ('-action_date',),
                'default_permissions': (),
            },
        ),
        migrations.AddField(
            model_name='pushrules',
            name='rule',
            field=models.ForeignKey(related_name='form_push_values', to='gmm_campaign.Rule'),
        ),
    ]
