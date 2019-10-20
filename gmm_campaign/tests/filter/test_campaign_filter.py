from datetime import datetime
from django.test import TestCase
from pytz import utc
from gmm_campaign.filters import CampaignFilter, ParticipationFilter
from gmm_campaign.models import Campaign, Participation
from gmm_push.filters import DeviceUserFilter
from gmm_push.models import DeviceUser
from gmm_region.models import Region
from gmm_util.util_objects_test import create_campaign, create_game, create_forms, create_device_user, \
    create_participation


class CampaignFilterTest(TestCase):
    def setUp(self):
        self.campaign = create_campaign(name="Current Campaign")
        create_campaign(name="Fake Current campaign", participant_limit=100, active=False)

    def test__filter_campaign_by_name__the_string_fak__campaigns_filtered_by_name_fak(self):
        # Arrange
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_all(campaign_queryset, "Fak")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_game_name__the_string_zenny__aal_campaigns_with_zenny_game(self):
        # Arrange
        create_forms(self.campaign, create_game())
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_all(campaign_queryset, "zenny")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_region_name__the_Mayotte_country_name__all_campaigns_in_Mayotte(self):
        # Arrange
        self.campaign.regions = Region.manager.filter(name="Mayotte")
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_all(campaign_queryset, "Mayotte")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_country_code__the_Mayotte_country_code__all_campaigns_in_Mayotte(self):
        # Arrange
        self.campaign.regions = Region.manager.filter(name="Mayotte")
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_all(campaign_queryset, "YT")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_country_code_to_mobile__the_Mayotte_country_code__all_campaigns_in_Mayotte(self):
        # Arrange
        self.campaign.regions = Region.manager.filter(name="Mayotte")
        banner_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_country_code(banner_queryset, "YT")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_opened_campaign__the_boolean_true__all_opened_campaigns(self):
        # Arrange
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_opened(campaign_queryset, True)
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_closed_campaign__the_boolean_false__all_closed_campaigns(self):
        # Arrange
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_opened(campaign_queryset, False)
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_status__the_param_disable__all_disable_campaigns(self):
        # Arrange
        create_campaign(name="To Start Campaign", begin_date="2050-02-16 17:53")
        create_campaign(name="Finished campaign", end_date="2016-02-16 17:54")

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_status(campaign_queryset, "paused")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_status__the_param_inactive__all_inactive_campaigns(self):
        # Arrange
        create_campaign(name="To Start Campaign", begin_date="2050-02-16 17:53")
        create_campaign(name="Finished campaign", end_date="2016-02-16 17:54")

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_status(campaign_queryset, "finished")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_status__the_param_active__all_actived_campaign(self):
        # Arrange
        create_campaign(name="To Start Campaign", begin_date="2050-02-16 17:53")
        create_campaign(name="Finished campaign", end_date="2016-02-16 17:54")

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_status(campaign_queryset, "started")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_status__the_param_deactivate__all_deactivated_campaigns(self):
        # Arrange
        create_campaign(name="To Start Campaign", begin_date="2050-02-16 17:53")
        create_campaign(name="Finished campaign", end_date="2016-02-16 17:54")

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_status(campaign_queryset, "about to start")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_campaign_by_nonexisting_param__the_wrong_param___all_campaigns(self):
        # Arrange
        create_campaign(name="To Start Campaign", begin_date="2050-02-16 17:53")
        create_campaign(name="Finished campaign", end_date="2016-02-16 17:54")

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_status(campaign_queryset, "nonexitent_param")
        # Assert
        self.assertEqual(response_queryset.count(), campaign_queryset.count())

    def test__filter_campaign_by_games__the_games_ids__all_campaigns_with_game_zenny(self):
        # Arrange
        zenny = create_game("Zenny Worldz")
        blaster_boy = create_game("Blaster Boy")
        create_forms(create_campaign(name="ZennyCampaign"), zenny)
        create_forms(create_campaign(name="OtherZennyCampaign"), zenny)
        create_forms(create_campaign(name="BlasterBoyCampaign"), blaster_boy)

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_games(campaign_queryset, "1")
        # Assert
        self.assertEqual(response_queryset.count(), 2)

    def test__filter_campaigns_by_games__the_games_ids__all_campaigns_with_games_zenny_and_blaster_boy(self):
        # Arrange
        zenny = create_game("Zenny Worldz")
        blaster_boy = create_game("Blaster Boy")
        create_forms(create_campaign(name="ZennyCampaign"), zenny)
        create_forms(create_campaign(name="OtherZennyCampaign"), zenny)
        create_forms(create_campaign(name="BlasterBoyCampaign"), blaster_boy)

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_games(campaign_queryset, "1,2")
        # Assert
        self.assertEqual(response_queryset.count(), 3)

    def test__filter_campaigns_by_regions__the_country_codes__all_campaigns_in_Germany_and_Argentina(self):
        # Arrange
        brazil_campaign = create_campaign(name="Brazil Campaign")
        germany_campaign = create_campaign(name="Germany Campaign")
        argentina_campaign = create_campaign(name="Argentina Campaign")

        brazil_campaign.regions = [Region.manager.get(name="Brazil")]
        germany_campaign.regions = [Region.manager.get(name="Germany")]
        argentina_campaign.regions = [Region.manager.get(name="Argentina")]

        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_regions(campaign_queryset, "BR,AR")
        # Assert
        self.assertEqual(response_queryset.count(), 2)

    def test__filter_campaign_by_name__the_campaigns_ids__campaign_with_id_number_one(self):
        # Arrange
        campaign_queryset = Campaign.manager.all()
        # Act
        response_queryset = CampaignFilter().filter_campaigns(campaign_queryset, "1")
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_player_by_last_date_played_using_begin_date__two_players_after_begin_date__2(self):
        # Arrange
        game = create_game()
        campaign = create_campaign()
        last_time_played_after_begin_date_1 = datetime(2016, 4, 25, 14, 46, 58, 28310, tzinfo=utc)
        last_time_played_after_begin_date_2 = datetime(2016, 6, 25, 14, 46, 58, 28310, tzinfo=utc)

        begin_date_period_consult = datetime(2016, 2, 25, 14, 46, 58, 28310, tzinfo=utc)

        player_1 = create_device_user(game=game, last_date_played=last_time_played_after_begin_date_1)
        player_2 = create_device_user(game=game, last_date_played=last_time_played_after_begin_date_2)

        device_user_queryset = Participation.manager.all()
        create_participation(campaign=campaign, player=player_1)
        create_participation(campaign=campaign, player=player_2)
        # Act
        response_query_set = ParticipationFilter().filter_begin_date(device_user_queryset,
                                                                     str(begin_date_period_consult))

        # Assert
        self.assertEqual(response_query_set.count(), 2)

    def test__filter_player_by_last_date_played_using_begin_date__one_player_before_begin_date_and_other_after__1(self):
        # Arrange
        game = create_game()
        campaign = create_campaign()
        last_time_played_after_begin_date_1 = datetime(2016, 1, 25, 14, 46, 58, 28310, tzinfo=utc)
        last_time_played_after_begin_date_2 = datetime(2016, 6, 25, 14, 46, 58, 28310, tzinfo=utc)

        begin_date_period_consult = datetime(2016, 2, 25, 14, 46, 58, 28310, tzinfo=utc)

        player_1 = create_device_user(game=game, last_date_played=last_time_played_after_begin_date_1)
        player_2 = create_device_user(game=game, last_date_played=last_time_played_after_begin_date_2)

        create_participation(campaign=campaign, player=player_1)
        create_participation(campaign=campaign, player=player_2)

        device_user_queryset = Participation.manager.all()

        # Act
        response_query_set = ParticipationFilter().filter_begin_date(device_user_queryset,
                                                                     str(begin_date_period_consult))
        # Assert
        self.assertEqual(response_query_set.count(), 1)

    def test__filter_player_by_last_date_played_using_begin_date__two_players_dates_before_begin_date__0(self):
        # Arrange
        game = create_game()
        campaign = create_campaign()
        last_time_played_after_begin_date_1 = datetime(2016, 1, 25, 14, 46, 58, 28310, tzinfo=utc)
        last_time_played_after_begin_date_2 = datetime(2016, 2, 25, 14, 46, 58, 28310, tzinfo=utc)

        begin_date_period_consult = datetime(2016, 5, 25, 14, 46, 58, 28310, tzinfo=utc)

        player_1 = create_device_user(game=game, last_date_played=last_time_played_after_begin_date_1)
        player_2 = create_device_user(game=game, last_date_played=last_time_played_after_begin_date_2)

        create_participation(campaign=campaign, player=player_1)
        create_participation(campaign=campaign, player=player_2)

        device_user_queryset = Participation.manager.all()

        # Act
        response_query_set = ParticipationFilter().filter_begin_date(device_user_queryset,
                                                                     str(begin_date_period_consult))
        # Assert
        self.assertEqual(response_query_set.count(), 0)

    def test__filter_player_by_last_date_played_using_end_date__two_players_dates_after_end_date__0(self):
        # Arrange
        game = create_game()
        campaign = create_campaign()
        last_time_played_after_end_date_1 = datetime(2016, 10, 25, 14, 46, 58, 28310, tzinfo=utc)
        last_time_played_after_end_date_2 = datetime(2016, 11, 25, 14, 46, 58, 28310, tzinfo=utc)

        end_date_period_consult = datetime(2016, 5, 25, 14, 46, 58, 28310, tzinfo=utc)

        player_1 = create_device_user(game=game, last_date_played=last_time_played_after_end_date_1)
        player_2 = create_device_user(game=game, last_date_played=last_time_played_after_end_date_2)

        create_participation(campaign=campaign, player=player_1)
        create_participation(campaign=campaign, player=player_2)

        device_user_queryset = Participation.manager.all()

        # Act
        response_query_set = ParticipationFilter().filter_end_date(device_user_queryset, str(end_date_period_consult))
        # Assert
        self.assertEqual(response_query_set.count(), 0)
