from django.test import TestCase
from gmm_game.filters import GameFilter
from gmm_game.models import Game
from gmm_util.util_objects_test import create_game


class FilterGameTest(TestCase):

    def setUp(self):
        create_game(name="NameGame", package_name="my.package_name.test", game_service_id="S3rv1c3_1D",
                    api_key="api_key_1")
        create_game(name="OtherGame", package_name="p4ck4g3", game_service_id="other_service_id", api_key="api_key_2")

    def test__filter_game_by_name(self):
        # Arrange
        self.game_queryset = Game.manager.all()
        # Act
        response_query_set = GameFilter().filter_all(self.game_queryset, "NameGame")
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_game_by_package_name(self):
        # Arrange
        self.game_queryset = Game.manager.all()
        # Act
        response_query_set = GameFilter().filter_all(self.game_queryset, "package")
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_game_by_game_service_id(self):
        # Arrange
        self.game_queryset = Game.manager.all()
        # Act
        response_query_set = GameFilter().filter_all(self.game_queryset, "rv1")
        # Assert
        self.assertEqual(response_query_set.count(), 1)
