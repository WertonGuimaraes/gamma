# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_campaign', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='pushrules',
            name='form_push_template',
            field=models.TextField(default=None),
            preserve_default=False,
        ),
    ]
