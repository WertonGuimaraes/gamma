# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings
import audit_log.models.fields


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0001_initial'),
        ('gmm_game', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gmm_region', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Banner',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('image_url', models.URLField(max_length=254)),
                ('target_url', models.URLField(max_length=254)),
                ('language', models.CharField(
                    default=b'EN', max_length=254,
                    choices=[(b'PT', b'Portuguese'), (b'ES', b'Spanish'), (b'EN', b'English')])),
            ],
        ),
        migrations.CreateModel(
            name='BannerConfiguration',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=254)),
                ('active', models.BooleanField(default=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('begin_date', models.DateTimeField(null=True)),
                ('end_date', models.DateTimeField(null=True)),
                ('gmt_timezone', models.CharField(max_length=254, null=True, blank=True)),
                ('is_using_campaign_date', models.BooleanField(default=False)),
                ('campaigns', models.ManyToManyField(to='gmm_campaign.Campaign', null=True, blank=True)),
                ('games', models.ManyToManyField(to='gmm_game.Game')),
                ('regions', models.ManyToManyField(to='gmm_region.Region')),
            ],
        ),
        migrations.CreateModel(
            name='BannerConfigurationAuditLogEntry',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('name', models.CharField(max_length=254)),
                ('active', models.BooleanField(default=True)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('begin_date', models.DateTimeField(null=True)),
                ('end_date', models.DateTimeField(null=True)),
                ('gmt_timezone', models.CharField(max_length=254, null=True, blank=True)),
                ('is_using_campaign_date', models.BooleanField(default=False)),
                ('action_id', models.AutoField(serialize=False, primary_key=True)),
                ('action_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('action_type', models.CharField(
                    max_length=1, editable=False, choices=[('I', 'Created'), ('U', 'Changed'), ('D', 'Deleted')])),
                ('action_user', audit_log.models.fields.LastUserField(
                    related_name='_bannerconfiguration_audit_log_entry', editable=False, to=settings.AUTH_USER_MODEL,
                    null=True)),
            ],
            options={
                'ordering': ('-action_date',),
                'default_permissions': (),
            },
        ),
        migrations.AddField(
            model_name='banner',
            name='bannerconfiguration',
            field=models.ForeignKey(related_name='banners', to='gmm_banner.BannerConfiguration'),
        ),
    ]
