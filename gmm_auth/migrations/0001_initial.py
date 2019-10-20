# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from django.db import migrations


def insert_new_permissions(apps, schema_editor):
        content_group = ContentType.objects.create(app_label='auth', model='group')
        content_user = ContentType.objects.create(app_label='auth', model='user')
        Permission.objects.create(codename='view_group', content_type=content_group, name="Can view group")
        Permission.objects.create(codename='view_user', content_type=content_user, name="Can view user")


class Migration(migrations.Migration):
    dependencies = [
        ('auth', '__latest__'),
    ]

    operations = [
        migrations.RunPython(insert_new_permissions)
    ]
