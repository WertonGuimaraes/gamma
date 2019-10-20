from django.contrib.auth.models import Group, User

from gmm_auth.models import GroupManager, UserManager
from gmm_auth.serializers import UserPermissionsSerializer, GroupSerializer
from gmm_util.field import Field
from gmm_util.util import to_dict, get_permissions

USER_PERMISSIONS = ['view']
ADMIN_PERMISSIONS = ["view", "add"]
SUPER_PERMISSIONS = ["view", "add", "change"]
MARKETING_PERMISSIONS = ["banner", "campaign", "push", "view_participation", "view_device_user"]

USERS = [{Field.USERNAME: "super",
          Field.PASSWORD: "abc123",
          Field.EMAIL: "super_asus@gmail.com",
          Field.IS_ACTIVE: True,
          Field.IS_SUPERUSER: True,
          Field.USER_PERMISSIONS: [to_dict(i) for i in get_permissions(SUPER_PERMISSIONS)],
          Field.GROUPS: SUPER_PERMISSIONS,
          Field.FIRST_NAME: "super",
          Field.LAST_NAME: "asus"},

         {Field.USERNAME: "admin",
          Field.PASSWORD: "abc123",
          Field.EMAIL: "admin_asus@gmail.com",
          Field.IS_ACTIVE: True,
          Field.IS_SUPERUSER: False,
          Field.USER_PERMISSIONS: [to_dict(i) for i in get_permissions(ADMIN_PERMISSIONS)],
          Field.GROUPS: ADMIN_PERMISSIONS,
          Field.FIRST_NAME: "admin",
          Field.LAST_NAME: "asus"},

         {Field.USERNAME: "user",
          Field.PASSWORD: "abc123",
          Field.EMAIL: "admin_asus@gmail.com",
          Field.IS_ACTIVE: True,
          Field.IS_SUPERUSER: False,
          Field.USER_PERMISSIONS: [to_dict(i) for i in get_permissions(USER_PERMISSIONS)],
          Field.GROUPS: USER_PERMISSIONS,
          Field.FIRST_NAME: "user",
          Field.LAST_NAME: "asus"},

         {Field.USERNAME: "marketing",
          Field.PASSWORD: "abc123",
          Field.EMAIL: "marketing_asus@gmail.com",
          Field.IS_ACTIVE: True,
          Field.IS_SUPERUSER: False,
          Field.USER_PERMISSIONS: [to_dict(i) for i in get_permissions(MARKETING_PERMISSIONS)],
          Field.GROUPS: MARKETING_PERMISSIONS,
          Field.FIRST_NAME: "user",
          Field.LAST_NAME: "asus"},
         ]


def get_or_create_group(name, filter_permissions):
    group = {
        Field.NAME: name,
        Field.PERMISSIONS:
            UserPermissionsSerializer(get_permissions(filter_permissions), many=True).data
    }
    group_serializer = GroupSerializer(data=group)
    if group_serializer.is_valid():
        group_data = group_serializer.data
        GroupManager().create(group_data)
        print 'The group "%s" was Created.' % (group[Field.NAME])
    else:
        print 'The group "%s" already exists.' % (group[Field.NAME])

    return Group.objects.get(name=group[Field.NAME])


def run():
    for user_data in USERS:
        group_name = "Group " + user_data[Field.USERNAME]
        group = get_or_create_group(group_name, user_data[Field.GROUPS])

        try:
            User.objects.get(username=user_data[Field.USERNAME])
            print 'The user "%s" already exists.' % (user_data[Field.USERNAME])
        except User.DoesNotExist:
            user_data[Field.GROUPS] = to_dict(group)
            UserManager().create(data=user_data)
            print 'The user "%s" was Created.' % (user_data[Field.USERNAME])
