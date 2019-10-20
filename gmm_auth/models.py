import copy

from django.contrib.auth.models import User, Permission, Group
from django.db import transaction
from rest_framework.generics import get_object_or_404
from gmm_util.field import Field


def _add_new_permissions_in_group_instance(new_permissions, instance):
    for permissions in new_permissions:
        instance.permissions.add(get_object_or_404(Permission.objects.all(), codename=permissions[Field.CODENAME]))
    instance.save()


def _add_group_permissions_to_user(group_permissions, users):
    if users:
        for user in users:
            for group_permission in group_permissions:
                if group_permission not in user.user_permissions.all():
                    user.user_permissions.add(group_permission)
            user.save()


def _remove_group_permissions_from_user(old_instance_permissions, instance, users):
    if users:
        for old_perm in old_instance_permissions:
            if old_perm not in instance.permissions.all():
                for user in users:
                    user.user_permissions.remove(old_perm)
                    user.save()


def _add_new_permissions_in_user_instance(permissions, instance):
    for new_permissions in permissions:
            instance.user_permissions.add(get_object_or_404(Permission.objects.all(),
                                                            codename=new_permissions[Field.CODENAME]))
    instance.save()


class UserManager(object):
    NUMBER_OF_FIELDS_ALLOWED_IN_PATCH_USER = 1

    @transaction.atomic
    def create(self, data):
        permissions = data.pop(Field.USER_PERMISSIONS)
        user_group = data.pop(Field.GROUPS)

        user = User.objects.create_user(email=data[Field.EMAIL], password=data[Field.PASSWORD],
                                        username=data[Field.USERNAME])
        user.is_active = data[Field.IS_ACTIVE]
        user.is_superuser = data[Field.IS_SUPERUSER]
        user.last_name = data[Field.LAST_NAME]
        user.first_name = data[Field.FIRST_NAME]

        for permission in permissions:
            user.user_permissions.add(get_object_or_404(Permission.objects.all(), codename=permission[Field.CODENAME]))

        group = get_object_or_404(Group.objects.all(), name=user_group[Field.NAME])
        user.groups = [group]

        user.save()
        return user

    @transaction.atomic
    def update(self, instance, validated_data):

        if self._is_active_field_in_patch(validated_data):
            instance.is_active = validated_data[Field.IS_ACTIVE]
            instance.save()
            return instance

        permissions = validated_data.pop(Field.USER_PERMISSIONS)
        user_group = validated_data.pop(Field.GROUPS)
        instance.user_permissions.clear()
        password = validated_data.pop(Field.PASSWORD)
        if password != instance.password:
            instance.set_password(password)
        instance.__dict__.update(**validated_data)

        _add_new_permissions_in_user_instance(permissions, instance)

        group = get_object_or_404(Group.objects.all(), name=user_group[Field.NAME])
        instance.groups.clear()
        instance.groups = [group]
        instance.save()

        return instance

    def _is_active_field_in_patch(self, validated_data):
        return len(validated_data) == self.NUMBER_OF_FIELDS_ALLOWED_IN_PATCH_USER and \
               (validated_data.get(Field.IS_ACTIVE) is not None)


class GroupManager(object):
    @transaction.atomic
    def create(self, data):
        permissions = data.pop(Field.PERMISSIONS)
        group = Group.objects.create(**data)
        for permission in permissions:
            group.permissions.add(get_object_or_404(Permission.objects.all(), codename=permission[Field.CODENAME]))
        group.save()

        return group

    @transaction.atomic
    def update(self, instance, validated_data):
        old_instance_permissions = copy.copy(instance.permissions.all())
        instance.permissions.clear()
        new_permissions = validated_data.pop(Field.PERMISSIONS)
        instance.__dict__.update(**validated_data)

        _add_new_permissions_in_group_instance(new_permissions, instance)
        users = User.objects.filter(groups__name=instance.name)
        _add_group_permissions_to_user(instance.permissions.all(), users)
        _remove_group_permissions_from_user(old_instance_permissions, instance, users)

        return instance
