from datetime import datetime
from django.test import TestCase
from pytz import utc
from gmm_push.filters import DeviceUserFilter
from gmm_push.models import DeviceUser
from gmm_util.util_objects_test import create_device_user, create_game


class FilterDeviceUserTest(TestCase):

    def setUp(self):
        create_device_user()

    def test__filter_device_user_by_email(self):
        # Arrange
        create_device_user(email="asus_gmm@asus.embedded.ufcg.edu.br")
        device_user_queryset = DeviceUser.manager.all()
        # Act
        response_query_set = DeviceUserFilter().filter_all(device_user_queryset, "asus_gmm")
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_device_user_by_gcm_id(self):
        # Arrange
        create_device_user(gcm_id="gcm1Dasus")
        device_user_queryset = DeviceUser.manager.all()
        # Act
        response_query_set = DeviceUserFilter().filter_all(device_user_queryset, "gcm1Dasu")
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_device_user_by_gpg_id(self):
        # Arrange
        create_device_user(gpg_id="gpg1Dasus")
        device_user_queryset = DeviceUser.manager.all()
        # Act
        response_query_set = DeviceUserFilter().filter_all(device_user_queryset, "gpg1Dasus")
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_device_user_by_country_code(self):
        # Arrange
        create_device_user(country_code="YT")
        device_user_queryset = DeviceUser.manager.all()
        # Act
        response_query_set = DeviceUserFilter().filter_location_country_codes(device_user_queryset, "YT")
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_device_user_by_game_id(self):
        # Arrange
        game = create_game()
        create_device_user(game=game)
        device_user_queryset = DeviceUser.manager.all()
        # Act
        response_query_set = DeviceUserFilter().filter_games(device_user_queryset, "1")
        # Assert
        self.assertEqual(response_query_set.count(), 1)
