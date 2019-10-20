from django.test import TestCase
from mock import Mock

from gmm_mobile.v1.exceptions import PlayerAlreadyRegisteredError
from gmm_push.models import DeviceUser
from gmm_util.util_objects_test import create_device_user, create_game
from gmm_util.field import Field
from gmm_util.util_test import create_user, JsonObjects


class CreateDeviceUserTest(TestCase):

    def setUp(self):
        self.game = create_game("Zennynho", package_name="br.com.asus.test.zenny",
                                game_service_id="SERVICE_Id_XPTO", api_key="key")
        self.user = create_user("test@zenny.com", "gpg_id", "gcm_id")
        self.environment_info_data = JsonObjects.environment_info_1()
        create_device_user(game=self.game, gcm_id="testing_gcm_id", email="email@embedded.ufcg.edu.br")
        self.game2 = create_game("Zenny2", package_name="br.com.asus.test.zenny2",
                                 game_service_id="SERVICE_ID_2", api_key="key2")

    def test__device_user_create_success(self):
        # Act
        is_new_player = DeviceUser.manager.create_or_update(self.user, self.environment_info_data, self.game)

        # Assert
        self.assertTrue(is_new_player)

    def test__device_user_update_success(self):
        # Arrange
        DeviceUser.manager.create_or_update(self.user, self.environment_info_data, self.game)
        player_id = DeviceUser.manager.get_player(self.user, self.game).id
        new_gpg_id = "new_arbitrary_gpg_id"
        self.user[Field.GPG_ID] = new_gpg_id

        # Act
        is_new_player = DeviceUser.manager.create_or_update(self.user, self.environment_info_data, self.game)

        # Assert
        player = DeviceUser.manager.get_player(self.user, self.game)
        self.assertFalse(is_new_player, msg="The method performed as a create (update expected).")
        self.assertEquals(player.id, player_id, msg="The method performed as a create (update expected).")
        self.assertEquals(player.gpg_id, new_gpg_id, msg="Player's GPG ID was not updated correctly.")

    def test__device_user_create_error_player_exists(self):
        # Arrange
        DeviceUser.manager.create_or_update(self.user, self.environment_info_data, self.game)

        # Act & Assert
        with self.assertRaises(PlayerAlreadyRegisteredError):
            DeviceUser.manager.create_or_update(self.user, self.environment_info_data, self.game)

    def test__device_user_exist_gpg_id_true(self):
        # Arrange
        player = Mock()
        player.gpg_id = "gpg_id_1"
        player_data = {Field.GPG_ID: "gpg_id_1"}

        # Act
        response = DeviceUser.manager.exist_gpg_id(player, player_data)

        # Assert
        self.assertTrue(response)

    def test__device_user_exist_gpg_id_false(self):
        # Arrange
        player = Mock()
        player.gpg_id = "gpg_id_1"
        player_data = {Field.GPG_ID: "gpg_id_2"}

        # Act
        response = DeviceUser.manager.exist_gpg_id(player, player_data)

        # Assert
        self.assertFalse(response)

    def test__device_user_get_player_success(self):
        # Arrange
        player = DeviceUser.manager.all()[0]
        player_data = {Field.GCM_ID: player.gcm_id, Field.EMAIL: player.email}

        # Act
        response = DeviceUser.manager.get_player(player_data, player.game)

        # Assert
        self.assertEquals(response.id, player.id)

    def test__device_user_get_player_error_wrong_email(self):
        # Arrange
        player = DeviceUser.manager.all()[0]
        player_data = {Field.GCM_ID: player.gcm_id, Field.EMAIL: "WRONG EMAIL"}

        # Act & Assert
        with self.assertRaises(DeviceUser.DoesNotExist):
            DeviceUser.manager.get_player(player_data, player.game)

    def test__device_user_get_player_error_wrong_gcm_id(self):
        # Arrange
        player = DeviceUser.manager.all()[0]
        player_data = {Field.GCM_ID: "WRONG GCM", Field.EMAIL: player.email}

        # Act & Assert
        with self.assertRaises(DeviceUser.DoesNotExist):
            DeviceUser.manager.get_player(player_data, player.game)

    def test__device_user_get_player_error_wrong_game(self):
        # Arrange
        player = DeviceUser.manager.all()[0]
        player_data = {Field.GCM_ID: player.gcm_id, Field.EMAIL: player.email}

        # Act & Assert
        with self.assertRaises(DeviceUser.DoesNotExist):
            DeviceUser.manager.get_player(player_data, self.game2)
