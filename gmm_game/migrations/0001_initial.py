# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings
import audit_log.models.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('name', models.CharField(max_length=254)),
                ('package_name', models.CharField(max_length=254)),
                ('game_service_id', models.CharField(max_length=254)),
                ('game_image', models.URLField(max_length=254)),
                ('api_key', models.CharField(max_length=254)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('form_template', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='GameAuditLogEntry',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('name', models.CharField(max_length=254)),
                ('package_name', models.CharField(max_length=254)),
                ('game_service_id', models.CharField(max_length=254)),
                ('game_image', models.URLField(max_length=254)),
                ('api_key', models.CharField(max_length=254)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('form_template', models.TextField()),
                ('action_id', models.AutoField(serialize=False, primary_key=True)),
                ('action_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('action_type', models.CharField(
                    max_length=1, editable=False, choices=[('I', 'Created'), ('U', 'Changed'), ('D', 'Deleted')])),
                ('action_user', audit_log.models.fields.LastUserField(
                    related_name='_game_audit_log_entry', editable=False, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ('-action_date',),
                'default_permissions': (),
            },
        ),
        migrations.CreateModel(
            name='PushTemplate',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('push_template', models.TextField()),
                ('created_date', models.DateTimeField(auto_now_add=True)),
                ('modified_date', models.DateTimeField(auto_now=True)),
                ('game', models.ForeignKey(related_name='push_templates', to='gmm_game.Game')),
            ],
        ),
    ]
