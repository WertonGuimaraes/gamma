from django.contrib.auth.models import User, Permission
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.test import APITestCase

from gmm_util.util_test import AuthenticationUtil, JsonObjects


class GameView(APITestCase):

    @classmethod
    def setUpClass(self):
        super(GameView, self).setUpClass()
        self.user = User.objects.create_user(**JsonObjects.user())
        self.user.is_superuser = True
        self.user.save()

    @classmethod
    def tearDownClass(self):
        super(GameView, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        self.data = JsonObjects.game()
        self.resp = self.client.post('/gmm/game/', self.data, HTTP_AUTHORIZATION=self.token)

    def test_create_game__with_superuser__status201(self):
        self.assertEquals(self.resp.status_code, status.HTTP_201_CREATED)

    def test_create_game__with_superuser_false__201(self):
        # Arrange
        self.user.is_superuser = False
        self.user.save()
        # Act
        resp = self.client.post('/gmm/game/', self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_game__with_add_permission__status201(self):
        # Arrange
        self.user.is_superuser = False
        self.user.user_permissions.add(get_object_or_404(Permission.objects.all(), codename='add_game'))
        self.user.save()
        self.data['package_name'] = 'br.zenny'
        self.data['game_service_id'] = '1234'
        self.data['api_key'] = '123'
        # Act
        resp = self.client.post('/gmm/game/', self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_201_CREATED)

    def test_create_game__without_add_permission__status403(self):
        # Arrange
        self.user.is_superuser = False
        self.user.save()
        self.data['package_name'] = 'br.zenny'
        self.data['game_service_id'] = '1234'
        self.data['api_key'] = '123'
        # Act
        resp = self.client.post('/gmm/game/', self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_game__with_any_permission__status200(self):
        # Arrange
        self.user.is_superuser = False
        self.user.save()
        # Act
        resp = self.client.get('/gmm/game/1/', HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_200_OK)

    def test_edit_game__with_change_permission__status200(self):
        # Arrange
        self.user.is_superuser = False
        self.user.is_active = True
        self.user.user_permissions.add(get_object_or_404(Permission.objects.all(), codename='change_game'))
        self.user.save()
        self.data['package_name'] = 'com.whatever'
        # Act
        resp = self.client.put('/gmm/game/1/', data=self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_200_OK)

    def test_edit_game__without_change_permission__status403(self):
        # Arrange
        self.user.is_superuser = False
        self.user.is_active = True
        self.user.save()
        self.data['package_name'] = 'com.whatever'
        # Act
        resp = self.client.put('/gmm/game/1/', data=self.data, HTTP_AUTHORIZATION=self.token)
        # Assert
        self.assertEquals(resp.status_code, status.HTTP_403_FORBIDDEN)
