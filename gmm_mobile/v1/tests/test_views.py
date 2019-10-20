from django.core.urlresolvers import reverse
from django.http import Http404
from mock import patch, Mock
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.test import APITestCase, APIRequestFactory
from gmm_banner.models import Banner
from gmm_campaign.models import Campaign
from gmm_game.models import Game
from gmm_mobile.v1.urls import BANNER_MOBILE, CONSULT_PARTICIPANT, OPENED_CAMPAIGNS, PARTICIPANT_MOBILE, PLAYER_MOBILE
from gmm_mobile.v1.views import \
    BannerViewMobile, ParticipantViewMobile, OpenedCampaignsViewMobile, ConsultParticipantMobile, PlayerViewMobile
from gmm_push.environment_configuration import EnvironmentConfiguration
from gmm_push.models import DeviceUser
from gmm_util.util_test import JsonObjects


class BannerViewMobileTests(APITestCase):

    factory = APIRequestFactory()
    url = reverse(BANNER_MOBILE, kwargs={'service_id': 1})

    def setUp(self):
        super(BannerViewMobileTests, self).setUp()
        self.view = BannerViewMobile.as_view()

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    @patch('gmm_mobile.v1.views.BannerFilter', return_value=[])
    def test__get__game_exists__status_200(self, mock_404, mock_filter):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    @patch('gmm_mobile.v1.views.BannerFilter', return_value=[Banner(), Banner()])
    def test__get__banners_found__status_200(self, mock_404, mock_filter):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('gmm_mobile.v1.views.get_object_or_404', side_effect=Http404())
    def test__get__game_does_not_exist__status_200(self, mock_404):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    def test__get__no_location__status_400(self, mock_404):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    def test__get__invalid_location__status_400(self, mock_404):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV={'invalid_field': 'invalid_value'},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ParticipantViewMobileTests(APITestCase):

    factory = APIRequestFactory()
    url = reverse(PARTICIPANT_MOBILE, kwargs={'service_id': 1, 'campaign_id': 1})

    def setUp(self):
        super(ParticipantViewMobileTests, self).setUp()
        self.view = ParticipantViewMobile.as_view()

    @patch('gmm_mobile.v1.views.RegisterParticipationSerializer')
    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=DeviceUser())
    def test__post__valid_data__status_201(self, mock_serializer, mock_device_user):
        # Arrange
        mock_instance = Mock()
        mock_serializer.return_value = mock_instance
        request = self.factory.post(
            self.url,
            {'player': {'email': 'cc@gmail.com', 'gpg_id': '1', 'gcm_id': '1'}},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    '''
    @patch('gmm_mobile.v1.views.RegisterParticipationSerializer')
    def test__post__invalid_data__status_400(self, mock_serializer):
        # Arrange
        mock_instance = Mock()
        mock_serializer.return_value = mock_instance
        mock_instance.is_valid.side_effect = ValidationError({})
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    '''
    def test__post__no_location__status_400(self):
        # Arrange
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test__post__invalid_location__status_400(self):
        # Arrange
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV={'invalid_field': 'invalid_value'},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class OpenedCampaignsViewMobileTests(APITestCase):

    factory = APIRequestFactory()
    url = reverse(OPENED_CAMPAIGNS, kwargs={'service_id': 1})

    def setUp(self):
        super(OpenedCampaignsViewMobileTests, self).setUp()
        self.view = OpenedCampaignsViewMobile.as_view()

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    @patch('gmm_mobile.v1.views.CampaignFilter', return_value=[])
    def test__get__game_exists__status_200(self, mock_404, mock_filter):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    @patch('gmm_mobile.v1.views.CampaignFilter', return_value=[Campaign(), Campaign()])
    @patch('gmm_mobile.v1.serializers.OpenedCampaignMobileSerializer.to_representation', return_value=Mock())
    def test__get__campaigns_found__status_200(self, mock_404, mock_filter, mock_representation):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('gmm_mobile.v1.views.get_object_or_404', side_effect=Http404())
    def test__get__game_does_not_exist__status_200(self, mock_404):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    def test__get__no_location__status_400(self, mock_404):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('gmm_mobile.v1.views.get_object_or_404', return_value=Game())
    def test__get__invalid_location__status_400(self, mock_404):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV={'invalid_field': 'invalid_value'},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ConsultParticipantMobileTests(APITestCase):

    factory = APIRequestFactory()
    url = reverse(CONSULT_PARTICIPANT, kwargs={'service_id': 1, 'campaign_id': 1, 'email': 'email@test.com'})

    def setUp(self):
        super(ConsultParticipantMobileTests, self).setUp()
        self.view = ConsultParticipantMobile.as_view()
        self.patch_participation_manager = patch(
            'gmm_mobile.v1.views.Participation.manager.verify_participant_resgistered_in_campaign_by_id')
        self.mock_participation_manager = self.patch_participation_manager.start()
        self.mock_participation_manager.return_value = {}

    def tearDown(self):
        self.patch_participation_manager.stop()
        super(ConsultParticipantMobileTests, self).tearDown()

    def test__get__data_exists_exists__status_200(self):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1, 'email@test.com')
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test__get__game_does_not_exist__status_200(self):
        # Arrange
        self.mock_participation_manager.side_effect = Game.DoesNotExist()
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1, 'email@test.com')
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test__get__campaign_does_not_exist__status_200(self):
        # Arrange
        self.mock_participation_manager.side_effect = Campaign.DoesNotExist()
        request = self.factory.get(
            self.url,
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1, 'email@test.com')
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test__get__no_location__status_400(self):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1, 'email@test.com')
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test__get__invalid_location__status_400(self):
        # Arrange
        request = self.factory.get(
            self.url,
            HTTP_X_ENV={'invalid_field': 'invalid_value'},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1, 1, 'email@test.com')
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class PlayerViewMobileTests(APITestCase):

    factory = APIRequestFactory()
    url = reverse(PLAYER_MOBILE, kwargs={'game_service_id': 1})

    def setUp(self):
        super(PlayerViewMobileTests, self).setUp()
        self.view = PlayerViewMobile.as_view()
        self.patch_game_manager = patch('gmm_mobile.v1.views.Game.manager.get')
        self.mock_game_manager = self.patch_game_manager.start()

    def tearDown(self):
        self.patch_game_manager.stop()
        super(PlayerViewMobileTests, self).tearDown()

    @patch('gmm_mobile.v1.views.PlayerRegisterSerializer')
    def test__post__valid_data__status_201(self, mock_serializer):
        # Arrange
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('gmm_mobile.v1.views.PlayerRegisterSerializer')
    def test__post__invalid_data__status_400(self, mock_serializer):
        # Arrange
        mock_instance = Mock()
        mock_serializer.return_value = mock_instance
        mock_instance.is_valid.side_effect = ValidationError({})
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test__post__no_location__status_400(self):
        # Arrange
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test__post__invalid_location__status_400(self):
        # Arrange
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV={'invalid_field': 'invalid_value'},
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch('gmm_mobile.v1.views.PlayerRegisterSerializer')
    def test__post__new_player__status_201(self, mock_serializer):
        # Arrange
        mock_instance = Mock()
        mock_serializer.return_value = mock_instance
        mock_instance.create_or_update.return_value = True
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch('gmm_mobile.v1.views.PlayerRegisterSerializer')
    def test__post__existing_player__status_201(self, mock_serializer):
        # Arrange
        mock_instance = Mock()
        mock_serializer.return_value = mock_instance
        mock_instance.create_or_update.return_value = False
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    @patch('gmm_mobile.v1.views.PlayerRegisterSerializer')
    def test__post__game_does_not_exist__status_201(self, mock_serializer):
        # Arrange
        self.mock_game_manager.side_effect = Game.DoesNotExist
        request = self.factory.post(
            self.url,
            {},
            HTTP_X_ENV=JsonObjects.environment_info_1(),
            HTTP_X_TOKEN=EnvironmentConfiguration.get_token(False))
        # Act
        response = self.view(request, 1)
        # Assert
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
