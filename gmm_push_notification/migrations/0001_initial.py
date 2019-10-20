# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone
from django.conf import settings
import audit_log.models.fields


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('gmm_game', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Push',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('data', models.CharField(max_length=254)),
                ('query', models.CharField(max_length=254)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('status_error', models.BooleanField(default=False)),
                ('success_count', models.IntegerField(null=True)),
            ],
        ),
        migrations.CreateModel(
            name='PushAuditLogEntry',
            fields=[
                ('id', models.IntegerField(verbose_name='ID', db_index=True, auto_created=True, blank=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('data', models.CharField(max_length=254)),
                ('query', models.CharField(max_length=254)),
                ('modified_date', models.DateTimeField(auto_now=True, null=True)),
                ('status_error', models.BooleanField(default=False)),
                ('success_count', models.IntegerField(null=True)),
                ('action_id', models.AutoField(serialize=False, primary_key=True)),
                ('action_date', models.DateTimeField(default=django.utils.timezone.now, editable=False)),
                ('action_type', models.CharField(
                    max_length=1, editable=False, choices=[('I', 'Created'), ('U', 'Changed'), ('D', 'Deleted')])),
                ('action_user', audit_log.models.fields.LastUserField(
                    related_name='_push_audit_log_entry', editable=False, to=settings.AUTH_USER_MODEL, null=True)),
            ],
            options={
                'ordering': ('-action_date',),
                'default_permissions': (),
            },
        ),
        migrations.CreateModel(
            name='PushDetails',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
                ('email', models.EmailField(max_length=254)),
                ('gcm_id', models.CharField(max_length=254)),
                ('gpg_id', models.CharField(max_length=254)),
                ('status', models.BooleanField(default=False)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('game', models.ForeignKey(to='gmm_game.Game')),
                ('push', models.ForeignKey(to='gmm_push_notification.Push')),
            ],
        ),
    ]
