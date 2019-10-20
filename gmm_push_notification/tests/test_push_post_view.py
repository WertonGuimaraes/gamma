from mock import patch
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_jwt.serializers import User
from gmm_util.field import Field
from gmm_util.util_objects_test import create_game, create_campaign, create_participation, create_device_user
from gmm_util.util_test import AuthenticationUtil, JsonObjects


class PushTestCase(APITestCase):

    url = '/gmm/push/'
    valid_gcm_id_2 = 'frDQ0klUrIU:APA91bG5Np33ih4O2MCdhTCSFiI4VUBSVr1vQFZcdTWJnA9rErvmBkaCJ0zwEWnmx7jAFY1N3QOpWHwquut' \
                     'mfkttwi_mOg5FEtSKAnZYFnrIPqOyLYh8-5EKg9SRJXhW6-GqBNzYWl1e'
    api_key_2 = 'AIzaSyAigLXJ9cGRoDzzgDOJIHuajEyUR0tCPXg'

    fake_gcm_id_1 = 'fake_gcm_id_1'
    fake_gcm_id_2 = 'fake_gcm_id_2'
    fake_gcm_id_3 = 'fake_gcm_id_3'

    mock_return = {'errors': {'teste': 'invalid'},
                   'success': {u'ciF1ZbHwCCk:APA91bEvRxWZzPSYp6rkrPnDBzBq_K8waoBw52s1ClT3La'
                               u'VovIZfDjQV1JbwXCeP5fiKXvnuyJdtLviupP4uoKLDUowKZAcx6doQATI_'
                               u'8F8Y-gvVrYR2TK6vU8t3P6YfoWgRJ4jOpONS':
                               u'0:1453313800352565%744ab298f9fd7ecd'}}
    mock_push_details = {'errors': {'fake_gcm_id_1': 'invalid'},
                         'success': {'fake_gcm_id_2': 'invalid_2', 'fake_gcm_id_3': 'ppp'}}

    @classmethod
    def setUpClass(self):
        super(PushTestCase, self).setUpClass()
        self.user_json = JsonObjects.user()
        self.user = User.objects.create_user(**self.user_json)
        self.user.is_superuser = True
        self.user.save()

    @classmethod
    def tearDownClass(self):
        super(PushTestCase, self).tearDownClass()
        self.user.delete()

    def login(self):
        return AuthenticationUtil.login(self.user)

    def setUp(self):
        self.token = self.login()

    @patch('gmm_push_notification.models.send_push', return_value=mock_push_details)
    def test__push_details__players__status200(self, mock_details):
        # arrange
        game = create_game()

        create_device_user(game=game, gcm_id=self.fake_gcm_id_1)
        create_device_user(game=game, gcm_id=self.fake_gcm_id_2)
        create_device_user(game=game, gcm_id=self.fake_gcm_id_3)

        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(game.id) + "'}"}
        self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # act
        response_details = self.client.get('/gmm/push/1/details', HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response_details.status_code, status.HTTP_200_OK)

    @patch('gmm_push_notification.models.send_push', return_value=mock_push_details)
    def test__push_details__participation__status200(self, mock_details):
        # arrange
        game = create_game(api_key=self.api_key_2)
        campaign = create_campaign()
        create_participation(campaign, country_code="US", player=create_device_user(game=game))

        data = {"data": "{'message': 'default_message'}",
                "query": "{'games': '" + str(game.id) + "', 'campaigns': '" + str(campaign.id) + "'}"}

        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
        # act
        response_details = self.client.get('/gmm/push/' + str(response.data[Field.ID]) + "/" + 'details',
                                           HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response_details.status_code, status.HTTP_200_OK)

    def test_send_push__more_than_1000_regs_ids_per_api_key__status201(self):
        game = create_game()

        for i in range(100):
            create_device_user(game=game, gcm_id=i)
        for i in range(100):
            create_device_user(game=game, gcm_id="")

        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(game.id) + "'}"}
        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    '''
    @patch('gmm_push_notification.models.send_push', return_value=mock_return)
    @patch('gmm_push_notification.models.PushManager.extract_api_key_from_devices', return_value=[])
    def test_send_push__game_with_no_player__status404(self, mock_push, moc_devices):
        # arrange
        game = create_game()
        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(game.id) + "'}"}
        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_404_NOT_FOUND)
    '''

    def test_send_push_to_different_games__several_players_with_invalid_gcm_id__status201(self):
        # arrange
        game = create_game()
        game2 = create_game(api_key=self.api_key_2, package_name="pack", game_service_id="service_id")
        game3 = create_game(api_key=self.api_key_2, package_name="other_pack", game_service_id="service_id_2")

        for i in range(2):
            create_device_user(game=game,  gcm_id="C")
        for i in range(2):
            create_device_user(game=game2, gcm_id="B")
        for i in range(6):
            create_device_user(game=game3, gcm_id="")
        for i in range(11):
            create_device_user(game=game3, gcm_id="OLA")
        for i in range(11):
            create_device_user(game=game2, gcm_id="")

        data = {"data": "{'message': 'default_message'}",
                "query": "{'games': '" + str(game.id) + ',' + str(game3.id) + ',' + str(game2.id) + "'}"}

        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    @patch('gmm_push_notification.models.send_push', return_value=mock_return)
    def test_send_push__to_valid_end_invalid_gcm_ids__status201(self, mock_push):
        # arrange
        game = create_game()
        game2 = create_game(api_key=self.api_key_2, package_name="pack", game_service_id="service_id")

        create_device_user(game=game)
        create_device_user(gcm_id="wrong gcm id", game=game2)
        create_device_user(gcm_id=self.valid_gcm_id_2, game=game)

        data = {"data": "{'message': 'default_message'}",
                "query": "{'games': '" + str(game.id) + ',' + str(game2.id) + "'}"}

        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    @patch('gmm_push_notification.models.send_push', return_value=mock_return)
    def test_send_push__with_invalid_gcm_id__status201(self, mock_push):
        # arrange
        game = create_game()
        create_device_user(game=game, gcm_id='invalid')
        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(game.id) + "'}"}
        # act
        response = self.client.post(self.url, data=data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_send_push__with_several_different_entries__status201(self):
        # arrange
        game_invalid_api_key = create_game(api_key="invalid api key")
        game_valid_api_key = create_game()

        # fail
        create_device_user(game=game_invalid_api_key)
        # fail
        create_device_user(gcm_id="invalid_gcm", game=game_invalid_api_key)
        # error
        create_device_user(gcm_id="valid_key_invalid_gcm", game=game_valid_api_key)
        # error
        create_device_user(gcm_id="valid_key_invalid_gcm_two", game=game_valid_api_key)
        # success
        create_device_user(game=game_valid_api_key)

        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(game_invalid_api_key.id) +
                                                                   ',' + str(game_valid_api_key.id) + "'}"}
        # act
        response = self.client.post(self.url, data=data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    @patch('gmm_push_notification.models.send_push', return_value=mock_return)
    def test_send_push__valid_participation__status201(self, mock_push):
        # arrange
        game = create_game(api_key=self.api_key_2)
        campaign = create_campaign()
        player = create_device_user(game=game)
        create_participation(campaign, player=player, country_code="US")
        data = {"data": "{'message': 'default_message'}",
                "query": "{'games': '" + str(game.id) + "', 'campaigns': '" + str(campaign.id) + "'}"}
        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    @patch('gmm_push_notification.models.send_push', return_value=mock_return)
    def test_send_push__with_valid_and_invalid_gcm_id__status201(self, mock_push):
        # arrange
        game = create_game()
        create_device_user(game=game)
        create_device_user(game=game, gcm_id='invalid gcm')
        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(game.id) + "'}"}
        # act
        response = self.client.post(self.url, data=data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_send_push__with_invalid_gcm_id_and_api_key__status201(self):
        # arrange
        game_with_invalid_api_key = create_game(api_key="invalid api key")
        create_device_user(gcm_id='invalid', game=game_with_invalid_api_key)
        data = {"data": "{'message': 'default_message'}",
                "query": "{'games': '" + str(game_with_invalid_api_key.id) + "'}"}
        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    def test_send_push__with_invalid_data__status400(self):
        # arrange
        game = create_game()
        create_device_user(gcm_id='invalid', game=game)
        data = {"data": 'message', "query": "{'games': '" + str(game.id) + "'}"}
        # act
        response = self.client.post(self.url, data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_send_push__without_token__status401(self):
        # arrange
        game = create_game()
        create_device_user(gcm_id='invalid gcm', game=game)
        data = {"data": "message", "query": "{'games': '" + str(game.id) + "'}"}
        # act
        response = self.client.post(self.url, data)
        # assert
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @patch('gmm_push_notification.models.send_push', return_value=mock_return)
    def test_send_push__with_invalid_query__status201(self, mock_push):
        # arrange
        game = create_game()
        create_device_user(game=game)
        create_device_user(game=game, gcm_id='invalid gcm')
        data = {"data": "{'message': 'default_message'}", "query": "{'games': '" + str(10) + "'}"}
        # act
        response = self.client.post(self.url, data=data, HTTP_AUTHORIZATION=self.token)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)
