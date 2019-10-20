# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push_notification', '0002_auto_20160427_1715'),
    ]

    operations = [
        migrations.CreateModel(
            name='PushesList',
            fields=[
                ('id', models.AutoField(verbose_name='ID', serialize=False, auto_created=True, primary_key=True)),
            ],
        ),
        migrations.AlterField(
            model_name='push',
            name='query',
            field=models.CharField(default=None, max_length=254),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pushauditlogentry',
            name='query',
            field=models.CharField(default=None, max_length=254),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='pusheslist',
            name='pushes',
            field=models.ForeignKey(related_name='pushes', to='gmm_push_notification.Push'),
        ),
    ]
