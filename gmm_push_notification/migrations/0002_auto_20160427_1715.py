# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0003_auto_20160427_1715'),
        ('gmm_push_notification', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='push',
            name='can_send_push',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='push',
            name='form_push_template',
            field=models.TextField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='push',
            name='push_begin_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='push',
            name='push_end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='push',
            name='push_timezone',
            field=models.CharField(max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='push',
            name='rule',
            field=models.ForeignKey(related_name='form_push_values', to='gmm_campaign.Rule', null=True),
        ),
        migrations.AddField(
            model_name='pushauditlogentry',
            name='can_send_push',
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name='pushauditlogentry',
            name='form_push_template',
            field=models.TextField(default=None),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pushauditlogentry',
            name='push_begin_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='pushauditlogentry',
            name='push_end_date',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='pushauditlogentry',
            name='push_timezone',
            field=models.CharField(max_length=254, null=True),
        ),
        migrations.AddField(
            model_name='pushauditlogentry',
            name='rule',
            field=models.ForeignKey(related_name='_auditlog_form_push_values', to='gmm_campaign.Rule', null=True),
        ),
        migrations.AlterField(
            model_name='push',
            name='query',
            field=models.CharField(max_length=254, null=True),
        ),
        migrations.AlterField(
            model_name='pushauditlogentry',
            name='query',
            field=models.CharField(max_length=254, null=True),
        ),
    ]
