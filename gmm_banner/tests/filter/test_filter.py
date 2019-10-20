from django.test import TestCase
from django.utils import timezone

from gmm_banner.filters import BannerConfigurationFilter
from gmm_banner.models import BannerConfiguration
from gmm_region.models import Region
from gmm_util.util_objects_test import create_banner, create_game, create_campaign


class BannerConfigurationFilterTest(TestCase):
    def setUp(self):
        self.banner = create_banner()

    def test__filter_banner_by_name(self):
        # Arrange
        create_banner(banner_configuration_name="AsusBanner")
        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_all(banner_queryset, "AsusBa")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_name_game(self):
        # Arrange
        create_banner()
        self.banner.games = [create_game()]
        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_all(banner_queryset, "Zenny")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_region_name(self):
        # Arrange
        self.banner.regions = Region.manager.filter(name="Mayotte")
        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_all(banner_queryset, "Mayotte")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_country_code(self):
        # Arrange
        self.banner.regions = Region.manager.filter(name="Mayotte")
        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_all(banner_queryset, "YT")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_country_code__to_mobile(self):
        # Arrange
        self.banner.regions = Region.manager.filter(name="Mayotte")
        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_country_code(banner_queryset, "YT")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_to_mobile__with_one_end_date_none_and_two_less_than_timezone_now__1(self):
        # Arrange
        create_banner(banner_configuration_name="AsusBanner", end_date="2012-09-04T19:13:40Z")
        create_banner(banner_configuration_name="AsusBanner2", end_date="2014-09-04T19:13:40Z")
        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_is_banner_exists(banner_queryset, timezone.now())
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_to_mobile__with_two_empties_and_one_valid_end_date__3(self):
        # Arrange
        create_banner(banner_configuration_name="AsusBanner", end_date=None)
        create_banner(banner_configuration_name="AsusBanner2", end_date="2018-09-04T19:13:40Z")
        create_banner(banner_configuration_name="AsusBanner3", end_date="2015-09-04T19:13:40Z")
        create_banner(banner_configuration_name="AsusBanner4", end_date="2012-09-04T19:13:40Z")

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_is_banner_exists(banner_queryset, timezone.now())
        # Assert
        self.assertEqual(response_queryset.count(), 3)

    def test__filter_banner_to_mobile__with_four_empties_end_date__4(self):
        # Arrange
        create_banner(banner_configuration_name="AsusBanner", end_date=None)
        create_banner(banner_configuration_name="AsusBanner2", end_date=None)
        create_banner(banner_configuration_name="AsusBanner3", end_date=None)

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_is_banner_exists(banner_queryset, timezone.now())
        # Assert
        self.assertEqual(response_queryset.count(), 4)

    def test__filter_banner_by_status__the_param_disable__all_disable_banners(self):
        # Arrange
        create_banner(banner_configuration_name="To Start banner", begin_date="2050-02-16 17:53")
        create_banner(banner_configuration_name="Finished banner", end_date="2016-02-16 17:54")
        create_banner(banner_configuration_name="Deactivate banner", active=False)

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_status(banner_queryset, "paused")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_status__the_param_inactive__all_inactive_banners(self):
        # Arrange
        create_banner(banner_configuration_name="To Start banner", begin_date="2050-02-16 17:53")
        create_banner(banner_configuration_name="Finished banner", end_date="2016-02-16 17:54")
        create_banner(banner_configuration_name="Deactivate banner", active=False)

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_status(banner_queryset, "finished")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_status__the_param_active__all_actived_banner(self):
        # Arrange
        create_banner(banner_configuration_name="To Start banner", begin_date="2050-02-16 17:53")
        create_banner(banner_configuration_name="Finished banner", end_date="2016-02-16 17:54")
        create_banner(banner_configuration_name="Deactivate banner", active=False)

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_status(banner_queryset, "started")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_status__the_param_deactivate__all_deactivated_banners(self):
        # Arrange
        create_banner(banner_configuration_name="To Start banner", begin_date="2050-02-16 17:53")
        create_banner(banner_configuration_name="Finished banner", end_date="2016-02-16 17:54")
        create_banner(banner_configuration_name="Deactivate banner", active=False)

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_status(banner_queryset, "about to start")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_banner_by_nonexisting_param__the_wrong_param___all_banners(self):
        # Arrange
        create_banner(banner_configuration_name="To Start banner", begin_date="2050-02-16 17:53")
        create_banner(banner_configuration_name="Finished banner", end_date="2016-02-16 17:54")
        create_banner(banner_configuration_name="Deactivate banner", active=False)

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_status(banner_queryset, "nonexitent_param")
        # Assert
        self.assertEqual(response_queryset.count(), banner_queryset.count())

    def test__filter_banner_by_games__the_games_ids__all_banners_with_game_zenny(self):
        # Arrange
        zenny = create_game("Zenny Worldz")
        blaster_boy = create_game("Blaster Boy")
        create_banner(banner_configuration_name="ZennyBanner", games=(zenny,))
        create_banner(banner_configuration_name="OtherZennyBanner", games=(zenny,))
        create_banner(banner_configuration_name="BlasterBoyBanner", games=(blaster_boy,))

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_games(banner_queryset, "1")
        # Assert
        self.assertEqual(response_queryset.count(), 2)

    def test__filter_banners_by_games__the_games_ids__all_banners_with_games_zenny_and_blaster_boy(self):
        # Arrange
        zenny = create_game("Zenny Worldz")
        blaster_boy = create_game("Blaster Boy")
        create_banner(banner_configuration_name="ZennyBanner", games=(zenny,))
        create_banner(banner_configuration_name="OtherZennyBanner", games=(zenny,))
        create_banner(banner_configuration_name="BlasterBoyBanner", games=(blaster_boy,))

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_games(banner_queryset, "1,2")
        # Assert
        self.assertEqual(response_queryset.count(), 3)

    def test__filter_banner_by_campaigns__the_campaigns_ids__all_banners_with_campaign_zenny(self):
        # Arrange
        zenny = create_campaign("Zenny Worldz")
        blaster_boy = create_campaign("Blaster Boy")
        create_banner(banner_configuration_name="ZennyBanner", campaigns=(zenny,))
        create_banner(banner_configuration_name="OtherZennyBanner", campaigns=(zenny,))
        create_banner(banner_configuration_name="BlasterBoyBanner", campaigns=(blaster_boy,))

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_campaigns(banner_queryset, "1")
        # Assert
        self.assertEqual(response_queryset.count(), 2)

    def test__filter_banners_by_campaigns__the_campaigns_ids__all_banners_with_campaigns_zenny_and_blaster_boy(self):
        # Arrange
        campaign_zenny = create_campaign("Zenny Worldz")
        campaign_blaster_boy = create_campaign("Blaster Boy")
        create_banner(banner_configuration_name="ZennyBanner", campaigns=(campaign_zenny,))
        create_banner(banner_configuration_name="OtherZennyBanner", campaigns=(campaign_zenny,))
        create_banner(banner_configuration_name="BlasterBoyBanner", campaigns=(campaign_blaster_boy,))

        banner_queryset = BannerConfiguration.manager.all()
        # Act
        response_queryset = BannerConfigurationFilter().filter_campaigns(banner_queryset, "1,2")
        # Assert
        self.assertEqual(response_queryset.count(), 3)
