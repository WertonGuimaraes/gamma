from django.test import TestCase
from mock import Mock, patch

from gmm_banner.models import BannerConfigurationManager


class BannerConfigurationModelsTest(TestCase):

    @patch('django.db.models.query.QuerySet.filter', return_value=[Mock(), Mock(), Mock()])
    def test__create_relationship_banner_configuration_and_game(self, filter_result):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.games = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_games(banner_configuration, {})
        # Assert
        self.assertEqual(len(banner_configuration.games), 3)

    def test__create_relationship_banner_configuration_and_game__relationship_dont_updated(self):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.games = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_games(banner_configuration, None)
        # Assert
        self.assertEqual(len(banner_configuration.games), 1)

    @patch('django.db.models.query.QuerySet.filter', return_value=[Mock(), Mock(), Mock()])
    def test__create_relationship_banner_configuration_and_regions(self, filter_result):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.regions = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_regions(banner_configuration, {})
        # Assert
        self.assertEqual(len(banner_configuration.regions), 3)

    def test__create_relationship_banner_configuration_and_regions__relationship_dont_updated(self):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.regions = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_regions(banner_configuration, None)
        # Assert
        self.assertEqual(len(banner_configuration.regions), 1)

    @patch('django.db.models.query.QuerySet.filter', return_value=[Mock(), Mock(), Mock()])
    def test__create_relationship_banner_configuration_and_banners(self, filter_result):
        # TODO: create test to update banners in banner configuration
        pass

    def test__create_relationship_banner_configuration_and_banners__relationship_dont_updated(self):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.banners = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_banners(banner_configuration, None)
        # Assert
        self.assertEqual(len(banner_configuration.banners), 1)

    @patch('gmm_banner.models.Campaign.manager.filter', return_value=[Mock(), Mock(), Mock()])
    def test__create_relationship__banner_configuration_and_campaign__3(self, filter_result):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.campaigns = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_campaign(banner_configuration, {})
        # Assert
        self.assertEqual(len(banner_configuration.campaigns), 3)

    @patch('gmm_banner.models.Campaign.manager.filter', return_value=[])
    def test__create_relationship_banner_configuration_and_campaign__without_campaigns__1(self, filter_result):
        # Arrange
        banner_configuration = Mock()
        banner_configuration.campaigns = [Mock()]
        # Act
        BannerConfigurationManager()._create_relationship_with_campaign(banner_configuration, None)
        # Assert
        self.assertEqual(len(banner_configuration.campaigns), 1)
