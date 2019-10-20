from datetime import timedelta
from django.test import TestCase
from django.utils import timezone
from mock import Mock, patch

from gmm.events_asynchronous import AsyncAlertsStartedCampaign
from gmm_util.constants import Constants


def create_push_campaign(status):
    campaign_push = Mock()
    campaign_push.rule = Mock()
    campaign_push.rule.campaign.status = status
    campaign_push.data = {}

    return campaign_push


class EventsPushTest(TestCase):
    def test__verify_in_time__dates_null__is_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = None
        push.push_end_date = None
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertTrue(in_time)

    def test__verify_in_time__begin_date_is_null_and_push_end_date_less_than_current_time__is_not_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = None
        push.push_end_date = current_time + timedelta(seconds=-1)
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertFalse(in_time)

    def test__verify_in_time__begin_date_is_null_and_push_end_date_equals_current_time__is_not_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = None
        push.push_end_date = current_time
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertFalse(in_time)

    def test__verify_in_time__begin_date_is_null_and_push_end_date_bigger_than_current_time__is_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = None
        push.push_end_date = current_time + timedelta(seconds=1)
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertTrue(in_time)

    def test__verify_in_time__end_date_is_null_and_begin_date_less_than_current_time__is_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = current_time + timedelta(seconds=-1)
        push.push_end_date = None
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertTrue(in_time)

    def test__verify_in_time__end_date_is_null_and_begin_date_equals_current_time__is_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = current_time
        push.push_end_date = None
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertTrue(in_time)

    def test__verify_in_time_end_date_is_null_and_begin_date_bigger_than_current_time__is_not_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = current_time + timedelta(seconds=1)
        push.push_end_date = None
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertFalse(in_time)

    def test__verify_in_time_date_is_not_null__is_in_time(self):
        # Arrange
        current_time = timezone.now()
        push = Mock()
        push.push_begin_date = current_time + timedelta(seconds=-1)
        push.push_end_date = current_time + timedelta(seconds=1)
        # Act
        in_time = AsyncAlertsStartedCampaign().verify_time(push, current_time)
        # Assert
        self.assertTrue(in_time)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=True)
    def test__validate_push_to_send__first_send_and_in_time_and_with_data__can_send_equals_true(self, verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = True
        push.data = {Constants.MESSAGE: Constants.NAME}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertTrue(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=True)
    def test__validate_push_to_send__first_send_and_in_time_and_without_data__can_send_equals_false(self, verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = True
        push.data = {}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=False)
    def test__validate_push_to_send__first_send_and_not_in_time_and_with_data__can_send_equals_false(self, verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = True
        push.data = {Constants.MESSAGE: Constants.NAME}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=True)
    def test__validate_push_to_send__first_send_and_not_in_time_and_without_data__can_send_equals_false(self,
                                                                                                        verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = True
        push.data = {}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=True)
    def test__validate_push_to_send__second_send_and_in_time_and_with_data__can_send_equals_true(self, verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = False
        push.data = {Constants.MESSAGE: Constants.NAME}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=True)
    def test__validate_push_to_send__second_send_and_in_time_and_without_data__can_send_equals_false(self, verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = False
        push.data = {}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=False)
    def test__validate_push_to_send__second_send_and_not_in_time_and_with_data__can_send_equals_false(self,
                                                                                                      verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = False
        push.data = {Constants.MESSAGE: Constants.NAME}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.verify_time', return_value=True)
    def test__validate_push_to_send__second_send_and_not_in_time_and_without_data__can_send_equals_false(self,
                                                                                                         verify_time):
        # Arrange
        push = Mock()
        push.can_send_push = False
        push.data = {}
        # Act
        can_send_push = AsyncAlertsStartedCampaign()._push_valid_to_send(push, timezone.now())
        # Assert
        self.assertFalse(can_send_push)

    def test__get_query_in_campaign_push__push_rule__query_to_push(self):
        # Arrange
        game = Mock()
        game.id = 1

        campaign = Mock()
        campaign.countries_codes = ["BR", "AR"]

        push = Mock()
        push.rule.campaign = campaign
        push.rule.game = game

        # Act
        query = AsyncAlertsStartedCampaign().get_query_to_campaign_push(push)

        # Assert
        self.assertDictEqual(query, {"regions": "BR,AR", "games": "1"})

    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign.get_query_to_campaign_push',
           return_value={"regions": "BR,AR", "games": "1"})
    def test__update_query_in_push__push_without_query__push_updated_with_query(self, mock_get_query):
        # Arrange
        push = Mock()
        push.query = {}

        # Act
        AsyncAlertsStartedCampaign()._update_query_in_push(push)

        # Assert
        self.assertDictEqual(push.query, {"regions": "BR,AR", "games": "1"})

    @patch('django.db.models.query.QuerySet.filter')
    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign._push_valid_to_send', return_value=False)
    def test__get_and_send_push__without_valid_push_to_send__zero_pushes_sent(self, mock_pushes,
                                                                                    mock_is_valid_to_send):
        pushes = [Mock(), Mock()]
        total_push = len(pushes)
        mock_pushes.return_value = pushes
        current_time = timezone.now()
        # Act
        AsyncAlertsStartedCampaign()._get_push_and_send(current_time)
        # Assert
        self.assertEqual(total_push, len(pushes))

    @patch('django.db.models.query.QuerySet.filter')
    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign._push_valid_to_send', return_value=True)
    def test__get_and_send_push__valid_push_to_send_and_status_about_to_start__zero_pushes_sent(self, mock_pushes,
                                                                                    mock_is_valid_to_send):

        # Arrange
        campaign_push = Mock()
        campaign_push.rule = Mock()
        campaign_push.rule.campaign.status = Constants.STATUS_ABOUT_TO_START

        pushes = [campaign_push, Mock()]
        total_push = len(pushes)
        mock_pushes.return_value = pushes
        current_time = timezone.now()
        # Act
        AsyncAlertsStartedCampaign()._get_push_and_send(current_time)
        # Assert
        self.assertEqual(total_push, len(pushes))

    @patch('django.db.models.query.QuerySet.filter')
    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign._push_valid_to_send', return_value=True)
    def test__get_and_send_push__valid_push_to_send_and_status_finished__zero_pushes_sent(self, mock_pushes,
                                                                                          mock_is_valid_to_send):

        # Arrange
        campaign_push = Mock()
        campaign_push.rule = Mock()
        campaign_push.rule.campaign.status = Constants.STATUS_FINISHED

        pushes = [campaign_push, Mock()]
        total_push = len(pushes)
        mock_pushes.return_value = pushes
        current_time = timezone.now()
        # Act
        AsyncAlertsStartedCampaign()._get_push_and_send(current_time)
        # Assert
        self.assertEqual(total_push, len(pushes))

    @patch('django.db.models.query.QuerySet.filter')
    @patch('gmm.events_asynchronous.AsyncAlertsStartedCampaign._push_valid_to_send', return_value=True)
    def test__get_and_send_push__valid_push_to_send_and_status_paused__zero_pushes_sent(self, mock_pushes,
                                                                                        mock_is_valid_to_send):

        # Arrange
        campaign_push = Mock()
        campaign_push.rule = Mock()
        campaign_push.rule.campaign.status = Constants.STATUS_PAUSED

        pushes = [campaign_push, Mock()]
        total_push = len(pushes)
        mock_pushes.return_value = pushes
        current_time = timezone.now()
        # Act
        AsyncAlertsStartedCampaign()._get_push_and_send(current_time)
        # Assert
        self.assertEqual(total_push, len(pushes))
