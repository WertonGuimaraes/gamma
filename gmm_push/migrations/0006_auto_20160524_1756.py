# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('gmm_push', '0005_auto_20160519_1323'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='deviceuser',
            options={'permissions': (('view_device_user', 'Can view device user'),)},
        ),
    ]
