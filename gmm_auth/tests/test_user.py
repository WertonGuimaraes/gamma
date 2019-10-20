from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_jwt.serializers import User

from gmm_util.field import Field
from gmm_util.util_test import JsonObjects, AuthenticationUtil


class UserPost(APITestCase):

    @classmethod
    def setUpClass(self):
        super(UserPost, self).setUpClass()
        self.user = User.objects.create_user(**JsonObjects.user())
        self.user.is_superuser = True
        self.user.save()

    @classmethod
    def tearDownClass(self):
        super(UserPost, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        self.data = dict(username='user', first_name='first_name', last_name='last_name', password=123,
                         email='test@gmail.com', is_active=True, is_superuser=True,
                         user_permissions=[{'codename': 'add_banner'}], groups=[{'name': 'new_group'}])
        data_group = dict(name="new_group", permissions=[{'codename': 'add_banner'}, {'codename': 'change_banner'}])
        resp_group = self.client.post('/gmm/group/', data=data_group, HTTP_AUTHORIZATION=self.token)
        self.assertEqual(resp_group.status_code, status.HTTP_201_CREATED)

        self.resp = self.client.post('/gmm/user/', self.data, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(self.resp.status_code, status.HTTP_201_CREATED)
        self.url_user_post = '/gmm/user/'

    def test_create_user__user_dict__status201(self):
        self.assertEquals(self.resp.status_code,  status.HTTP_201_CREATED)

    def create_inactive_user__is_active_false__status201(self):
        # Arrange
        self.data[Field.USERNAME] = 'user2'
        self.data[Field.IS_ACTIVE] = False
        # Assert
        self.assertEquals(self.resp.status_code,  status.HTTP_201_CREATED)

    def create_user__with_existing_group__status201(self):
        self.data['username'] = 'jv'
        self.data['email'] = 'test@gmail.com'
        self.data['user_permissions'] = [{'codename': 'change_banner'}]

        resp = self.client.post('/gmm/user/', self.data, HTTP_AUTHORIZATION=self.token)
        s = User.objects.get(username='jv')
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_create_user__with_view_game_permission__status201(self):
        # Arrange
        self.data['user_permissions'] = [{'codename': 'view_game'}]
        self.data['username'] = 'user2'
        self.data['email'] = 'test1@gmail.com'
        self.data['is_superuser'] = False
        us = User.objects.get(username='user')

        # Act
        resp_same_user = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        us = User.objects.get(username='user2')
        # Assert
        self.assertEquals(us.user_permissions.all()[0].codename, 'view_game')
        self.assertEquals(resp_same_user.status_code, status.HTTP_201_CREATED)


class UserPostError(APITestCase):

    @classmethod
    def setUpClass(self):
        super(UserPostError, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()
        self.url_user_post = '/gmm/user/'

    @classmethod
    def tearDownClass(self):
        super(UserPostError, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        data_group = dict(name="new_group",  permissions=[{'codename': 'add_banner'}, {'codename': 'change_banner'}])
        resp_group = self.client.post('/gmm/group/', data=data_group, HTTP_AUTHORIZATION=self.token)
        self.assertEqual(resp_group.status_code, status.HTTP_201_CREATED)
        self.data = dict(username='user',  first_name='first_name', last_name='last_name', password=123,
                         email='test@gmail.com', is_active=True, is_superuser=True,
                         user_permissions=[{'codename': 'add_banner'}], groups=[{'name': 'new_group'}])

    def test_get_create_user__without_field_username__status401(self):
        # Arrange
        self.data.pop(Field.USERNAME)
        # Act
        resp = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_create_user__without_field_password__status401(self):
        # Arrange
        self.data.pop(Field.PASSWORD)
        # Act
        resp = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_create_user__without_field_is_active__status201(self):
        # Arrange
        self.data.pop(Field.IS_ACTIVE)
        # Act
        resp = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_get_create_user__without_field_is_superuser__status201(self):
        # Arrange
        self.data.pop(Field.IS_SUPERUSER)
        # Act
        resp = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEqual(resp.status_code, status.HTTP_201_CREATED)

    def test_get_create_user__with_is_superuser_false__status403(self):
        # Arrange
        self.user.is_superuser = False
        self.user.save()
        # Act
        resp = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_user__existing_user__status400(self):
        # Arrange
        self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Act
        resp_same_user = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp_same_user.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user__without_permissions__status400(self):
        # Arrange
        self.data.pop(Field.USER_PERMISSIONS)
        # Act
        resp_same_user = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp_same_user.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user__without_first_name__status400(self):
        # Arrange
        self.data.pop(Field.FIRST_NAME)
        # Act
        resp_same_user = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp_same_user.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_user__without_last_name__status400(self):
        # Arrange
        self.data.pop(Field.LAST_NAME)
        # Act
        resp_same_user = self.client.post(self.url_user_post, self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp_same_user.status_code, status.HTTP_400_BAD_REQUEST)


class UserGet(APITestCase):
    @classmethod
    def setUpClass(self):
        super(UserGet, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()
        self.url_user_get = '/gmm/user/'

    @classmethod
    def tearDownClass(self):
        super(UserGet, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        data_group = dict(name="new_group", permissions=[{'codename': 'add_banner'}, {'codename': 'change_banner'}])
        resp_group = self.client.post('/gmm/group/', data=data_group, HTTP_AUTHORIZATION=self.token)
        self.assertEqual(resp_group.status_code, status.HTTP_201_CREATED)

        self.data = dict(username='user',  first_name='first_name', last_name='last_name', password=123,
                         email='test@gmail.com', is_active=True, is_superuser=True,
                         user_permissions=[{'codename': 'add_banner'}], groups={'name': 'new_group'})
        self.resp = self.client.post(self.url_user_get, self.data, HTTP_AUTHORIZATION=self.token)

    def test_get_all_users__status200(self):
        resp = self.client.get(self.url_user_get, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(resp.status_code, status.HTTP_200_OK)

    def test_get_one_user__status200(self):
        resp = self.client.get('/gmm/user/1/', HTTP_AUTHORIZATION=self.token)
        self.assertEquals(resp.status_code, status.HTTP_200_OK)


class UserGetError(APITestCase):

    @classmethod
    def setUpClass(self):
        super(UserGetError, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()
        self.url_user_get = '/gmm/user/'

    @classmethod
    def tearDownClass(self):
        super(UserGetError, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        data_group = dict(name="new_group", permissions=[{'codename': 'add_banner'}, {'codename': 'change_banner'}])
        resp_group = self.client.post('/gmm/group/', data=data_group, HTTP_AUTHORIZATION=self.token)
        self.assertEqual(resp_group.status_code, status.HTTP_201_CREATED)
        self.data = dict(username='user', first_name='first_name', last_name='last_name', password=123,
                         email='test@gmail.com', is_active=True, is_superuser=True,
                         user_permissions=[{'codename': 'add_banner'}], groups={'name': 'new_group'})
        self.resp = self.client.post(self.url_user_get, self.data, HTTP_AUTHORIZATION=self.token)

    def test_get_user__without_token__status400(self):
        resp = self.client.get(self.url_user_get)
        self.assertEquals(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user_does_not_exist__user_invalid__status400(self):
        resp = self.client.get('/gmm/user/1000/', HTTP_AUTHORIZATION=self.token)
        self.assertEquals(resp.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_user__superuser_false__status200(self):
        resp = self.client.get(self.url_user_get, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(resp.status_code, status.HTTP_200_OK)


class UserEdit(APITestCase):
    @classmethod
    def setUpClass(self):
        super(UserEdit, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()
        self.url_user_get = '/gmm/user/'

    @classmethod
    def tearDownClass(self):
        super(UserEdit, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        data_group = dict(name="new_group", permissions=[{'codename': 'add_banner'}, {'codename': 'change_banner'}])
        resp_group = self.client.post('/gmm/group/', data=data_group, HTTP_AUTHORIZATION=self.token)

        self.assertEqual(resp_group.status_code, status.HTTP_201_CREATED)

        self.data = dict(first_name='first_name', last_name='last_name', username='user', password=123,
                         email='test@gmail.com', is_active=True, is_superuser=True,
                         user_permissions=[{'codename': 'add_banner'}], groups=[{'name': 'new_group'}])
        self.resp = self.client.post(self.url_user_get, self.data, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(self.resp.status_code, status.HTTP_201_CREATED)

    def test_edit_user__other_user__status200(self):
        # Arrange
        data = dict(first_name='first_name', last_name='last_name', username='xpto', password=123,
                    email='test@gmail.com', is_active=True, is_superuser=True,
                    user_permissions=[{'codename': 'add_banner'}], groups=[{'name': 'new_group'}])
        # Act
        us = User.objects.get(username='user')
        resp = self.client.put('/gmm/user/' + str(us.id) + '/', data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_200_OK)
