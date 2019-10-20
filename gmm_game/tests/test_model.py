from django.test import TestCase
from mock import Mock, patch

from gmm_campaign.exceptions import UniqueFieldGameError
from gmm_game.models import Game, GameManager
from gmm_util.util_test import JsonObjects


class CreateAndEditGameTest(TestCase):
    def test__create_game(self):
        # Arrange
        game_data = JsonObjects.game()
        # Act
        game_created = Game.manager.create(game_data)
        # Assert
        self.assertEqual(game_created.id, 1)

    def test__edit_game(self):
        # Arrange
        game = Game.manager.create(JsonObjects.game())
        new_game_data = JsonObjects.game(name="new game")
        # Act
        game_created = Game.manager.edit(game, new_game_data)
        # Assert
        self.assertEqual(game_created.id, 1)
        self.assertEqual(game_created.name, "new game")


class ValidatorGameTest(TestCase):
    @patch('gmm_game.models.Game.manager.get')
    def test__validate_unique_game_service_id(self, game_found_mock):
        # Arrange
        game = Mock()
        game_found_mock.return_value = game
        # Act
        response = GameManager()._validate_unique(game, game_service_id="service_id")
        # Assert
        self.assertEqual(game, response)

    @patch('gmm_game.models.Game.manager.get')
    def test__validate_not_unique_game_service_id(self, game_found_mock):
        # Arrange
        game = Mock()
        game_found_mock.return_value = Mock()
        # Act and Assert
        with self.assertRaises(UniqueFieldGameError):
            GameManager()._validate_unique(game, game_service_id="other_service_id")

    @patch('gmm_game.models.Game.manager.get')
    def test__validate_unique_package_name(self, game_found_mock):
        # Arrange
        game = Mock()
        game_found_mock.return_value = game
        # Act
        response = GameManager()._validate_unique(game, package_name="pack_name")
        # Assert
        self.assertEqual(game, response)

    @patch('gmm_game.models.Game.manager.get')
    def test__validate_not_unique_package_name(self, game_found_mock):
        # Arrange
        game = Mock()
        game_found_mock.return_value = Mock()
        # Act and Assert
        with self.assertRaises(UniqueFieldGameError):
            GameManager()._validate_unique(game, package_name="other_pack_name")
