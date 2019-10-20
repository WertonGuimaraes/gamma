from django.test import TestCase
from gmm_campaign.filters import ParticipationFilter
from gmm_campaign.models import Participation
from gmm_util.util_objects_test import create_campaign, create_game, create_participation, create_device_user


class ParticipantFilterTest(TestCase):

    def setUp(self):
        self.campaign = create_campaign()
        self.game = create_game()
        self.player = create_device_user()

    def test__filter_participant_by_country_code(self):
        # Arrange
        create_participation(self.campaign, country_code="US", player=self.player)
        create_participation(self.campaign, country_code="BR", player=create_device_user())
        participant_queryset = Participation.manager.all()
        # Act
        response_queryset = ParticipationFilter().filter_location_country_codes(participant_queryset, "US")
        # Assert
        self.assertEqual(participant_queryset.count(), 2)
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_participant_by_country_codes(self):
        # Arrange
        create_participation(self.campaign, country_code="US", player=self.player)
        create_participation(self.campaign, country_code="BR", player=create_device_user())
        create_participation(self.campaign, country_code="CA", player=create_device_user())
        participant_queryset = Participation.manager.all()
        # Act
        response_queryset = ParticipationFilter().filter_location_country_codes(participant_queryset, "BR,US")
        # Assert
        self.assertEqual(participant_queryset.count(), 3)
        self.assertEqual(response_queryset.count(), 2)

    def test__filter_participant_by_campaign_id(self):
        # Arrange
        other_campaign = create_campaign(name="OtherCampaign")
        create_participation(other_campaign, player=self.player)
        participant_queryset = Participation.manager.all()
        # Act
        response_queryset = ParticipationFilter().filter_campaigns(participant_queryset, str(other_campaign.id))
        # Assert
        self.assertEqual(response_queryset.count(), 1)

    def test__filter_participant_by_campaign_ids(self):
        # Arrange
        other_campaign = create_campaign(name="OtherCampaign")
        create_participation(other_campaign, player=self.player)
        create_participation(self.campaign, country_code="BR", player=create_device_user())
        participant_queryset = Participation.manager.all()
        # Act
        response_queryset = ParticipationFilter().filter_campaigns(participant_queryset, str(self.campaign.id)+',' +
                                                                   str(other_campaign.id))
        # Assert
        self.assertEqual(response_queryset.count(), 2)
