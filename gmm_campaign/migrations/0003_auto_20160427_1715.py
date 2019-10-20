# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0002_pushrules_form_push_template'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='pushrules',
            name='rule',
        ),
        migrations.RemoveField(
            model_name='campaign',
            name='can_send_push',
        ),
        migrations.RemoveField(
            model_name='campaignauditlogentry',
            name='can_send_push',
        ),
        migrations.DeleteModel(
            name='PushRules',
        ),
    ]
