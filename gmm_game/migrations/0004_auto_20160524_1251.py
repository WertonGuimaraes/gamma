# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models
import re
import django.core.validators


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_game', '0003_auto_20160518_1939'),
    ]

    operations = [
        migrations.AlterField(
            model_name='game',
            name='analytics_view_id',
            field=models.CharField(blank=True, max_length=254, null=True,
                                   validators=[django.core.validators.MinLengthValidator(9),
                                               django.core.validators.RegexValidator(re.compile(b'^[0-9]*$'),
                                                                                     b'Only numbers are allowed.')]),
        ),
        migrations.AlterField(
            model_name='gameauditlogentry',
            name='analytics_view_id',
            field=models.CharField(blank=True, max_length=254, null=True,
                                   validators=[django.core.validators.MinLengthValidator(9),
                                               django.core.validators.RegexValidator(re.compile(b'^[0-9]*$'),
                                                                                     b'Only numbers are allowed.')]),
        ),
    ]
