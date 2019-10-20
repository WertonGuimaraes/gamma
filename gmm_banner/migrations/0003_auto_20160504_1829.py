# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_banner', '0002_auto_20160503_1426'),
    ]

    operations = [
        migrations.AlterField(
            model_name='banner',
            name='language',
            field=models.CharField(default=b'ALL', max_length=254, choices=[(b'PT', b'Portuguese'),
                                                                            (b'ES', b'Spanish'),
                                                                            (b'EN', b'English'),
                                                                            (b'ALL', b'All languages')]),
        ),
    ]
