from rest_framework import status
from rest_framework.test import APITestCase, APIRequestFactory
from rest_framework_jwt.serializers import User

from gmm_campaign.filters import ParticipationFilter
from gmm_push.filters import DeviceUserFilter
from gmm_push_notification.models import PushManager
from gmm_push_notification.views import PushViewSet
from gmm_util.util_test import JsonObjects, AuthenticationUtil


class PushTestCaseGet(APITestCase):

    @classmethod
    def setUpClass(self):
        super(PushTestCaseGet, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)

    @classmethod
    def tearDownClass(self):
        super(PushTestCaseGet, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()
        self.view = PushViewSet.as_view({'get': 'list'})

    def test__get__push__status200(self):
        # Arrange
        factory = APIRequestFactory()
        # Act
        request = factory.get('/gmm/push/', HTTP_AUTHORIZATION=self.token)
        response = self.view(request)
        # Assert
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test__get_push_pagination__status200(self):
        # Arrange
        factory = APIRequestFactory()
        # Act
        request = factory.get('/gmm/push/', {'page': 1}, HTTP_AUTHORIZATION=self.token)
        response = self.view(request)
        # Assert
        self.assertEquals(response.status_code, status.HTTP_200_OK)

    def test__get_search_serializer__with_campaign__participation(self):
        # Arrange
        query_data = {'campaigns': '1,2,3', 'games': '1,2,3'}
        # Act
        response = PushManager().get_devices(query_data)
        # Assert
        self.assertIsInstance(response, ParticipationFilter)

    def test__get_search_serializer__without_campaign__device_user(self):
        # Arrange
        query_data = {'games': '1,2,3'}
        # Act
        response = PushManager().get_devices(query_data)
        # Assert
        self.assertIsInstance(response, DeviceUserFilter)
