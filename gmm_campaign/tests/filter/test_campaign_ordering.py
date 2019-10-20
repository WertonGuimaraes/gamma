from django.test import TestCase
from mock import patch, Mock

from gmm_util.ordering import OrderingCustom
from gmm_util.util_objects_test import create_campaign


class CampaignFilterTest(TestCase):
    def setUp(self):
        self.campaign = create_campaign()
        create_campaign(name="otherCampaign", participant_limit=100, active=False)

    def test__string_lower_case__name_test_lowercase(self):
        # Arrange
        data = "Test"
        # Act
        lowercase_name = OrderingCustom().convert_string_to_lower_case(data)
        # Assert
        self.assertEqual(lowercase_name, 'test')

    def test__int_lower_case__int_number_10(self):
        # Arrange
        data = 10
        # Act
        lowercase_name = OrderingCustom().convert_string_to_lower_case(data)
        # Assert
        self.assertEqual(lowercase_name, 10)

    def test__tuple_lower_case__all_tuple_in_lowercase(self):
        # Arrange
        data = (1, "Test")
        # Act
        lowercase_name = OrderingCustom().convert_elements_to_lower_case(data)
        # Assert
        self.assertEqual(lowercase_name, (1, 'test'))

    def test__not_tuple_lower_case_element_in_lowercase(self):
        # Arrange
        data = "XPTO"
        # Act
        lowercase_name = OrderingCustom().convert_elements_to_lower_case(data)
        # Assert
        self.assertEqual(lowercase_name, "xpto")

    @patch('gmm_util.ordering.OrderingCustom.get_ordering', return_value=['name'])
    def test__ordering_queryset_by_name__ordered_list(self, mock_ordering):
        # Arrange
        campaign_1 = Mock()
        campaign_2 = Mock()
        campaign_3 = Mock()

        campaign_1.name = "A"
        campaign_2.name = "B"
        campaign_3.name = "C"

        queryset = [campaign_2, campaign_3, campaign_1]

        # Act
        ordered_campaign = OrderingCustom().filter_queryset(Mock(), queryset, Mock())

        # Assert
        self.assertEqual(ordered_campaign[0].name, "A")
        self.assertEqual(ordered_campaign[1].name, "B")
        self.assertEqual(ordered_campaign[2].name, "C")

    @patch('gmm_util.ordering.OrderingCustom.get_ordering', return_value=['-name'])
    def test__ordering_queryset_by_name__ordered_revert_list(self, mock_ordering):
        # Arrange
        campaign_1 = Mock()
        campaign_2 = Mock()
        campaign_3 = Mock()

        campaign_1.name = "A"
        campaign_2.name = "B"
        campaign_3.name = "C"

        queryset = [campaign_2, campaign_3, campaign_1]

        # Act
        ordered_campaign = OrderingCustom().filter_queryset(Mock(), queryset, Mock())

        # Assert
        self.assertEqual(ordered_campaign[0].name, "C")
        self.assertEqual(ordered_campaign[1].name, "B")
        self.assertEqual(ordered_campaign[2].name, "A")

    @patch('gmm_util.ordering.OrderingCustom.get_ordering', return_value=None)
    def test__ordering_queryset_by_nonexistent__queryset_not_ordered(self, mock_ordering):
        # Arrange
        campaign_1 = Mock()
        campaign_2 = Mock()
        campaign_3 = Mock()

        campaign_1.name = "A"
        campaign_2.name = "B"
        campaign_3.name = "C"

        queryset = [campaign_2, campaign_3, campaign_1]

        # Act
        ordered_campaign = OrderingCustom().filter_queryset(Mock(), queryset, Mock())

        # Assert
        self.assertEqual(ordered_campaign[0].name, "B")
        self.assertEqual(ordered_campaign[1].name, "C")
        self.assertEqual(ordered_campaign[2].name, "A")
