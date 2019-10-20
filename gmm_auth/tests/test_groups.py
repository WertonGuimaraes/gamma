from django.contrib.auth.models import User, Group, Permission
from rest_framework import status
from rest_framework.test import APITestCase

from gmm_util.field import Field
from gmm_util.util_test import JsonObjects, AuthenticationUtil


class GroupsPost(APITestCase):

    @classmethod
    def setUpClass(self):
        super(GroupsPost, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()

    @classmethod
    def tearDownClass(self):
        super(GroupsPost, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        self.data = dict(name="admin", permissions=[{'codename': 'add_banner'}, {'codename': 'change_banner'}])
        self.resp = self.client.post('/gmm/group/', data=self.data, HTTP_AUTHORIZATION=self.token)

    def test_create_group__group_dict__status201(self):
        self.assertEquals(self.resp.status_code, status.HTTP_201_CREATED)

    def test_create_group__with_the_same_name__status400(self):
        resp = self.client.post('/gmm/group/', data=self.data, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(resp.status_code, status.HTTP_400_BAD_REQUEST)


class GroupEdit(APITestCase):

    @classmethod
    def setUpClass(self):
        super(GroupEdit, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()

    @classmethod
    def tearDownClass(self):
        super(GroupEdit, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        self.data = dict(name="admin", permissions=[{'codename': 'change_banner'}, {'codename': 'add_game'},
                                                    {'codename': 'add_banner'}])
        self.resp = self.client.post('/gmm/group/', data=self.data, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(self.resp.status_code, status.HTTP_201_CREATED)
        self.user.groups = Group.objects.filter(name='admin')
        self.user.save()

    def test_edit_user__other_name(self):
        # Arrange
        self.data[Field.NAME] = 'jv'
        self.data[Field.PERMISSIONS] = [{'codename': 'change_banner'}]
        group = Group.objects.get(name='admin')
        # Act
        resp = self.client.put('/gmm/group/'+str(group.id)+'/', data=self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_200_OK)

    def test_edit_group__new_permissions__true_and_status200(self):
        """
        Original user permissions: None
        Original group permissions: change_banner, add_game, add_banner
        Group Permissions after update: change_banner, add_banner
        User Permissions after group update: change_banner, add_banner
        """
        # Arrange
        self.data[Field.PERMISSIONS] = [{'codename': 'change_banner'}, {'codename': 'add_banner'}]
        group = Group.objects.get(name='admin')
        # Act
        resp = self.client.put('/gmm/group/'+str(group.id)+'/', data=self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        user = User.objects.get(groups__name='admin')
        user_permissions_list = user.user_permissions.all()
        group_permissions_list = group.permissions.all()

        self.assertListEqual(list(user_permissions_list), list(group_permissions_list))
        self.assertEquals(resp.status_code, status.HTTP_200_OK)

    def test_edit_group__remove_add_banner_permission_from_group__true_and_status200(self):
        """
        Original user permissions : add_rule, change_banner, add_banner, add_game
        Original group permissions: change_banner, add_game, add_banner
        Group Permissions after update (add_banner removed) : change_banner, add_game
        User Permissions after group update: change banner, add_game, add_rule
        """
        # Arrange
        user = User.objects.get(groups__name='admin')
        user.user_permissions.add(Permission.objects.get(codename='add_rule'),
                                  Permission.objects.get(codename='add_banner'),
                                  Permission.objects.get(codename='change_banner'),
                                  Permission.objects.get(codename='add_game'))
        user.save()
        self.data[Field.PERMISSIONS] = [{'codename': 'change_banner'}, {'codename': 'add_game'}]
        group = Group.objects.get(name='admin')
        # Act
        resp = self.client.put('/gmm/group/'+str(group.id)+'/', data=self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        permissions = Permission.objects.filter(codename__in=['change_banner', 'add_game', 'add_rule'])
        self.assertListEqual(list(user.user_permissions.all()), list(permissions))
        self.assertEquals(resp.status_code, status.HTTP_200_OK)


class GroupGet(APITestCase):

    @classmethod
    def setUpClass(self):
        super(GroupGet, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()

    @classmethod
    def tearDownClass(self):
        super(GroupGet, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        self.data = dict(name="admin", permissions=[{'codename': 'add_banner'}])
        self.resp = self.client.post('/gmm/group/', data=self.data, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(self.resp.status_code, status.HTTP_201_CREATED)

    def test_get_all_user_from_groups__status200(self):
        resp = self.client.get('/gmm/group/', HTTP_AUTHORIZATION=self.token)
        self.assertEquals(resp.status_code, status.HTTP_200_OK)
