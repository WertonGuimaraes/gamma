from django.contrib.auth.backends import ModelBackend


class CustomModelBackend(ModelBackend):
    EMPTY_GROUP_PERMISSIONS = []
    '''
        This is necessary to skip group permissions
    '''
    def get_group_permissions(self, user_obj, obj=None):
        return self.EMPTY_GROUP_PERMISSIONS
