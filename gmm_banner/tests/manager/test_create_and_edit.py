from django.test import TestCase

from gmm_banner.models import BannerConfiguration
from gmm_util.util_test import JsonObjects


class BannerConfigurationManagerTest(TestCase):
    def test__created_banner_configuration(self):
        # Arrange
        banner_data = JsonObjects.banner()
        # Act
        banner_created = BannerConfiguration.manager.create(banner_data)
        # Assert
        self.assertEqual(banner_created.id, 1)

    def test__edited_banner_configuration(self):
        # Arrange
        banner = BannerConfiguration.manager.create(JsonObjects.banner())
        new_banner_data = JsonObjects.banner(banner_configuration_name="new banner")
        # Act
        banner_created = BannerConfiguration.manager.edit(banner, new_banner_data)
        # Assert
        self.assertEqual(banner_created.id, 1)
        self.assertEqual(banner_created.banner_configuration_name, "new banner")
