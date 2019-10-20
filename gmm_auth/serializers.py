from rest_framework import serializers
from django.contrib.auth.models import User, Permission, Group
from rest_framework.exceptions import ValidationError

from gmm_util.constants import Constants
from models import UserManager, GroupManager

from gmm_util.field import Field


class UserGroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = (Field.NAME, )
        extra_kwargs = {
            "name": {
                "validators": [],
            },
        }


class UserPermissionsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Permission
        fields = (Field.CODENAME, )


class GroupSerializer(serializers.ModelSerializer):
    permissions = UserPermissionsSerializer(many=True)

    class Meta:
        model = Group
        fields = (Field.ID, Field.NAME, Field.PERMISSIONS,)

    def create(self, validated_data):
        return GroupManager().create(validated_data)

    def update(self, instance, validated_data):
        return GroupManager().update(instance, validated_data)


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=254, required=True)
    is_active = serializers.BooleanField(default=True)
    is_superuser = serializers.BooleanField(default=False)
    user_permissions = UserPermissionsSerializer(many=True, required=True)
    groups = UserGroupSerializer(many=True)
    first_name = serializers.CharField(max_length=30, required=True)
    last_name = serializers.CharField(max_length=30, required=True)

    class Meta:
        model = User
        fields = (Field.ID, Field.PASSWORD, Field.USERNAME, Field.EMAIL, Field.IS_ACTIVE, Field.IS_SUPERUSER,
                  Field.USER_PERMISSIONS, Field.GROUPS, Field.FIRST_NAME, Field.LAST_NAME, )

    def create(self, validated_data):
        return UserManager().create(validated_data)

    def update(self, instance, validated):
        return UserManager().update(instance, validated)

    def validate_groups(self, data):
        if not self.instance:
            has_group = Group.objects.filter(name=data[0][Field.NAME])
            if has_group:
                ValidationError(Constants.GROUP_ALREADY_EXISTS_ERROR)
        if data:
            return dict(data[0])
        else:
            raise ValidationError(Constants.GROUP_IS_REQUIRED)

    def validate_user_permissions(self, data):
        if not data:
            raise ValidationError(Constants.PERMISSIONS_ARE_REQUIRED)
        return data
