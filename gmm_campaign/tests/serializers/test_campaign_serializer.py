from datetime import datetime

from django.test.testcases import TestCase
from mock import patch, Mock
from pytz import timezone
from rest_framework.exceptions import ValidationError

from data_to_test_edit_control import DataToTestEditCampaignControl
from gmm_campaign.models import Rule, Campaign
from gmm_campaign.serializers import CampaignSerializer
from gmm_region.models import Region, Country
from gmm_util.constants import Constants
from gmm_util.field import Field
from gmm_util.util_objects_test import create_game
from gmm_util.util_test import JsonObjects, FORM_TEMPLATE


class CampaignSerializerTestCase(TestCase):

    FIELD_ACTIVE_REQUIRED = "[u'The field active requires be FALSE']"
    ERROR_NOT_NULL = "[u'This field may not be null.']"
    NAME_WITH_51_CHARACTERS = "A" * 51
    ERRO_NAME_BIGGER_THAN_50 = "[u'Ensure this field has no more than 50 characters.']"
    ERROR_INVALID_TYPE_ACTIVE_FIELD = '[u\'"Active" is not a valid boolean.\']'

    def convert_datetime_with_timezone(self, date):
        datetime_obj_naive = datetime.strptime(date, "%Y-%m-%d %H:%M:%S")
        return timezone('UTC').localize(datetime_obj_naive)

    @classmethod
    def setUpClass(self):
        super(CampaignSerializerTestCase, self).setUpClass()

        region1_data = JsonObjects.region()
        region2_data = JsonObjects.region(name="Brazil", countries=[["Brazil", "BR"]])
        country1_data = region1_data.pop(Field.COUNTRIES)[0]
        country2_data = region2_data.pop(Field.COUNTRIES)[0]

        region1 = Region(**region1_data)
        region1.save()
        region2 = Region(**region2_data)
        region2.save()

        region1.countries = Country.manager.filter(**country1_data)
        region2.countries = Country.manager.filter(**country2_data)

    def setUp(self):
        TestCase.setUp(self)
        self.instance = DataToTestEditCampaignControl.instance
        self.validate_data = DataToTestEditCampaignControl.validate_data.copy()
        self.rule_dict = DataToTestEditCampaignControl.rule_dict.copy()
        self.form_data = DataToTestEditCampaignControl.form_data[:]
        self.new_region = DataToTestEditCampaignControl.new_region[:]
        self.old_region = DataToTestEditCampaignControl.old_region.copy()
        self.list_1_to_compare_dict_lists = DataToTestEditCampaignControl.list_1_to_compare_dict_lists[:]
        self.list_2_to_compare_dict_lists = DataToTestEditCampaignControl.list_2_to_compare_dict_lists[:]

    def test__create_campaign__new_campaign(self):
        # Arrange
        create_game(name="zennyworldz", analytics_view_id=00000, package_name="br.com.asus.app.zennyworldz",
                    form_template=FORM_TEMPLATE,
                    game_image="https://gamma-test.s3.amazonaws.com/game/game_icon_1460643319494.jpg",
                    api_key="lr4cE2jGYJj46H8Gw0esY6k8Ll98Ej6D", game_service_id=1)
        # Act
        serializer = CampaignSerializer().create(JsonObjects.campaign())
        # Assert
        self.assertIsNotNone(serializer)
        self.assertFalse(serializer.active)

    def test__campaign_end_date__null(self):
        # Act
        serializer = CampaignSerializer(data=JsonObjects.campaign(end_date=None))
        serializer.is_valid()
        # Assert
        self.assertEqual(self.ERROR_NOT_NULL, str(serializer.errors[Field.END]))

    def test__campaign_begin_date__null(self):
        # Act
        serializer = CampaignSerializer(data=JsonObjects.campaign(begin_date=None))
        serializer.is_valid()
        # Assert
        self.assertEqual(self.ERROR_NOT_NULL, str(serializer.errors[Field.BEGIN]))

    def test__campaign_name__null(self):
        # Act
        serializer = CampaignSerializer(data=JsonObjects.campaign(name=None))
        serializer.is_valid()
        # Assert
        self.assertEqual(self.ERROR_NOT_NULL, str(serializer.errors[Field.NAME]))

    def test__active_campaign__not_null(self):
        # Act
        serializer = CampaignSerializer(data=JsonObjects.campaign(active=None))
        serializer.is_valid()
        self.assertEqual(self.ERROR_NOT_NULL, str(serializer.errors[Field.ACTIVE]))

    def test__campaign_name_bigger_than_50__error(self):
        # Act
        serializer = CampaignSerializer(
            data=JsonObjects.campaign(name=self.NAME_WITH_51_CHARACTERS))
        serializer.is_valid()
        # Assert
        self.assertEqual(self.ERRO_NAME_BIGGER_THAN_50, str(serializer.errors[Field.NAME]))

    def test__active_campaign__invalid_type(self):
        # Act
        serializer = CampaignSerializer(data=JsonObjects.campaign(active="Active"))
        serializer.is_valid()
        # Assert
        self.assertEqual(self.ERROR_INVALID_TYPE_ACTIVE_FIELD, str(serializer.errors[Field.ACTIVE]))

    def test__create_campaign_with_begin_date_bigger_than_end_date__false(self):
        # Arrange
        data = JsonObjects.campaign(begin_date="2055-09-04T19:13:40Z")
        # Act
        serializer = CampaignSerializer(data=data)
        is_true = serializer.is_valid()
        # Assert
        self.assertFalse(is_true)

    def test__game__was_modified__false(self):
        # Arrange
        rule = []
        rule_object = Rule(**self.rule_dict)
        rule.append(rule_object)
        # Act
        is_modified = CampaignSerializer().was_game_modified(self.form_data, rule)
        # Assert
        self.assertFalse(is_modified)

    def test__game__was_modified__true(self):
        # Arrange
        rule = []
        self.rule_dict[Field.GAME_ID] = 100
        rule_object = Rule(**self.rule_dict)
        rule.append(rule_object)
        # Act
        is_modified = CampaignSerializer().was_game_modified(self.form_data, rule)
        # Assert
        self.assertTrue(is_modified)

    def test__regions__was_modified__false(self):
        # Arrange
        old_region_list = []
        old_region_object = Region(**self.old_region)
        old_region_list.append(old_region_object)
        # Act
        was_modified = CampaignSerializer().was_regions_modified(old_region_list, self.new_region)
        # Assert
        self.assertFalse(was_modified)

    def test__regions__was_modified__true(self):
        # Arrange
        old_region_list = []
        self.old_region[Field.ID] = 5
        old_region_object = Region(**self.old_region)
        old_region_list.append(old_region_object)
        # Act
        was_modified = CampaignSerializer().was_regions_modified(old_region_list, self.new_region)
        # Assert
        self.assertTrue(was_modified)

    @patch('django.utils.timezone.now')
    def test__campaign_has_been_started__timezone_now__greater_than_begin_date__true(self, mock_timezone):
        # Arrange
        mock_timezone.return_value = datetime(2017, 2, 24, 13, 59, tzinfo=timezone("UTC"))
        # Act
        response = CampaignSerializer().campaign_has_been_started(self.instance)
        # Assert
        self.assertTrue(response)

    @patch('django.utils.timezone.now')
    def test__campaign_has_been_started__timezone_now__equals_begin_date__true(self, mock_timezone):
        # Arrange
        mock_timezone.return_value = datetime(2016, 2, 24, 13, 59, tzinfo=timezone("UTC"))
        # Act
        response = CampaignSerializer().campaign_has_been_started(self.instance)
        # Assert
        self.assertTrue(response)

    @patch('django.utils.timezone.now')
    def test__campaign_has_been_started__begin_date_greater_than_timezone_now__false(self, mock_timezone):
        # Arrange
        mock_timezone.return_value = datetime(2012, 2, 24, 13, 59, tzinfo=timezone("UTC"))
        # Act
        response = CampaignSerializer().campaign_has_been_started(self.instance)
        # Assert
        self.assertFalse(response)

    @patch('gmm_campaign.models.Campaign.participations')
    def test__campaign_finished_by_participant_limit__participant_limit_greater_than_participants_total__false(
            self, mock_participations_count):
        # Arrange
        mock_participations_count.count.return_value = self.instance.participant_limit - 1
        # Act
        response = CampaignSerializer().is_campaign_finished_by_participant_limit(self.instance)
        # Assert
        self.assertFalse(response)

    @patch('gmm_campaign.models.Campaign.participations')
    def test__campaign_finished_by_participant_limit__participant_limit_equals_participants_total__true(
            self, mock_participations_count):
        # Arrange
        mock_participations_count.count.return_value = self.instance.participant_limit
        # Act
        response = CampaignSerializer().is_campaign_finished_by_participant_limit(self.instance)
        # Assert
        self.assertTrue(response)

    @patch('gmm_campaign.models.Campaign.participations')
    def test__campaign_finished_by_participant_limit__participants_total__greater_than_participant_limit__true(
            self, mock_participations_count):
        # Arrange
        mock_participations_count.count.return_value = self.instance.participant_limit + 1
        # Act
        response = CampaignSerializer().is_campaign_finished_by_participant_limit(self.instance)
        # Assert
        self.assertTrue(response)

    @patch('gmm_campaign.serializers.CampaignSerializer.started_campaign_can_be_updated', return_value=True)
    @patch('gmm_campaign.models.Campaign.manager.edit', return_value=Campaign())
    def test__update_started_campaign__started_campaign__campaign_instance(
            self, mock_started_campaign_can_be_updated, mock_edit_campaign):
        # Arrange
        regions = Mock()
        form_data = Mock()
        validated_data = Mock()
        # Act
        response = CampaignSerializer().update_started_campaign(self.instance, validated_data, regions, form_data)
        # Assert
        self.assertIsInstance(response, Campaign)

    @patch('gmm_campaign.serializers.CampaignSerializer.started_campaign_can_be_updated', return_value=False)
    def test__update_started_campaign__started_campaign_with_invalid_rules__exception(
            self, mock_started_campaign_can_be_updated):
        # Arrange
        regions = Mock()
        form_data = Mock()
        validated_data = Mock()
        # Act / Assert
        with self.assertRaisesMessage(ValidationError, Constants.STARTED_CAMPAIGN_EDIT_CONTROL_ERROR):
            CampaignSerializer().update_started_campaign(self.instance, validated_data, regions, form_data)

    @patch('gmm_campaign.serializers.CampaignSerializer.not_started_campaign_can_be_updated', return_value=True)
    @patch('gmm_campaign.models.Campaign.manager.edit', return_value=Campaign())
    def test__update_not_started_campaign__not_started_campaign__campaign_instance(
            self, mock_started_campaign_can_be_updated, mock_edit_campaign):
        # Act
        response = CampaignSerializer().update_not_started_campaign(self.instance, self.validate_data)
        # Assert
        self.assertIsInstance(response, Campaign)

    @patch('gmm_campaign.serializers.CampaignSerializer.not_started_campaign_can_be_updated', return_value=False)
    def test__update_not_started_campaign__not_started_campaign_with_invalid_rules__exception(
            self, mock_started_campaign_can_be_updated):

        # Assert / Act
        with self.assertRaisesMessage(ValidationError, Constants.PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR):
            CampaignSerializer().update_not_started_campaign(self.instance, self.validate_data)

    @patch('gmm_campaign.serializers.CampaignSerializer.was_game_modified', return_value=True)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_regions_modified', return_value=True)
    def test__campaign__was__modified__true(self, mock_game, mock_regions):
        # Act
        was_modified = CampaignSerializer().was_campaign_modified(instance=self.instance,
                                                                  validated_data=self.validate_data,
                                                                  form_data='MOCK', regions_data='MOCK')
        # Assert
        self.assertTrue(was_modified)

    @patch('gmm_campaign.serializers.CampaignSerializer.was_game_modified', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_regions_modified', return_value=False)
    def test__campaign__was__modified__false(self, mock_game, mock_regions):
        # Act
        was_modified = CampaignSerializer().was_campaign_modified(instance=self.instance,
                                                                  validated_data=self.validate_data,
                                                                  form_data='MOCK', regions_data='MOCK')
        # Assert
        self.assertFalse(was_modified)

    @patch('gmm_campaign.serializers.CampaignSerializer.was_game_modified', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_regions_modified', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_campaign_modified', return_value=False)
    def test__started_campaign_can_be_updated__true(self, mock_game, mock_region, mock_campaign):
        # Act
        was_modified = CampaignSerializer().started_campaign_can_be_updated(self.instance,
                                                                            self.validate_data, "MOCK", "MOCK")
        # Assert
        self.assertTrue(was_modified)

    @patch('gmm_campaign.serializers.CampaignSerializer.was_game_modified', return_value=True)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_regions_modified', return_value=True)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_campaign_modified', return_value=True)
    def test__started_campaign_can_be_updated__game_and_regions_modified__false(self, mock_game, mock_region,
                                                                                mock_campaign):
        # Act
        was_modified = CampaignSerializer().started_campaign_can_be_updated(self.instance,
                                                                            self.validate_data, "MOCK", "MOCK")
        # Arrange
        self.assertFalse(was_modified)

    @patch('gmm_campaign.serializers.CampaignSerializer.was_game_modified', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_regions_modified', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_campaign_modified', return_value=True)
    def test__started_campaign_can_be_updated__just_campaign_was_modified__true(self, mock_game, mock_region,
                                                                                mock_campaign):
        # Act
        was_modified = CampaignSerializer().started_campaign_can_be_updated(self.instance,
                                                                            self.validate_data, "MOCK", "MOCK")
        # Assert
        self.assertTrue(was_modified)

    @patch('gmm_campaign.serializers.CampaignSerializer.is_campaign_finished_by_participant_limit', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.campaign_has_been_started', return_value=True)
    @patch('gmm_campaign.serializers.CampaignSerializer.started_campaign_can_be_updated', return_value=True)
    @patch('gmm_campaign.models.CampaignManager._create_relationship_with_forms', return_value=Rule())
    @patch('gmm_campaign.models.Campaign')
    @patch('gmm_campaign.models.Campaign.regions', return_value=Region())
    def test__update_campaign_according_rules__campaign_not_finished_by_participant_limit__campaign_instance(
            self, mock_participant_limit, mock_campaign_has_been_started, mock_started_campaign_can_be_updated,
            mock_save_rule, mock_campaign, mock_regions):
        # Arrange
        regions_data = "fake_region"
        form_data = 'fake_form_data'
        mock_campaign.save = Campaign()
        # Act
        response = CampaignSerializer().\
            update_campaign_according_rules(self.instance, self.validate_data, regions_data, form_data)
        # Assert
        self.assertIsInstance(response, Campaign)

    @patch('gmm_campaign.serializers.CampaignSerializer.is_campaign_finished_by_participant_limit', return_value=True)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_campaign_modified', return_value=True)
    def test__update_campaign_according_rules__campaign_finished_by_participant_limit__exception(
            self, mock_campaign_finished_by_participant_limit, mock_was_campaign_modified):
        # Arrange
        regions_data = "fake_region"
        form_data = 'fake_form_data'
        validate_data = "fake_validated_data"
        instance = "fake_instance"
        # Act / Assert
        with self.assertRaisesMessage(ValidationError,
                                      Constants.CAMPAIGN_FINISHED_BY_PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR):
            CampaignSerializer().update_campaign_according_rules(instance,
                                                                 validate_data, regions_data, form_data)

    @patch('gmm_campaign.serializers.CampaignSerializer.is_campaign_finished_by_participant_limit', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.campaign_has_been_started', return_value=False)
    def test__update_campaign_according_rules__not_started_campaign__exception(
            self, mock_campaign_finished_by_participant_limit, mock_campaign_has_been_started):
        # Arrange
        self.validate_data[Field.PARTICIPANT_LIMIT] += 1
        regions_data = "fake_region"
        form_data = 'fake_form_data'
        # Act / Assert
        with self.assertRaisesMessage(ValidationError, Constants.PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR):
            CampaignSerializer().update_campaign_according_rules(self.instance,
                                                                 self.validate_data, regions_data, form_data)

    @patch('gmm_campaign.serializers.CampaignSerializer.is_campaign_finished_by_participant_limit', return_value=True)
    @patch('gmm_campaign.serializers.CampaignSerializer.was_campaign_modified', return_value=False)
    def test__update_campaign_according_rules__campaign_not_modified__campaign_instance(
            self, mock_campaign_finished_by_participant_limit, mock_campaign_has_been_started):
        # Arrange
        regions_data = "fake_region"
        form_data = 'fake_form_data'
        # Act
        response = CampaignSerializer().update_campaign_according_rules(self.instance, self.validate_data, regions_data,
                                                                        form_data)
        #  Assert
        self.assertIsInstance(response, Campaign)

    @patch('gmm_campaign.serializers.CampaignSerializer.is_campaign_finished_by_participant_limit', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.campaign_has_been_started', return_value=False)
    @patch('gmm_campaign.serializers.CampaignSerializer.not_started_campaign_can_be_updated', return_value=True)
    @patch('gmm_campaign.models.CampaignManager._create_relationship_with_forms', return_value=Rule())
    @patch('gmm_campaign.models.Campaign')
    @patch('gmm_campaign.models.Campaign.regions', return_value=Region())
    @patch('gmm_campaign.serializers.CampaignSerializer.was_game_modified', return_value=False)
    def test__update_campaign_according_rules__campaign_not_started__campaign_instance(
            self, mock_campaign_finished_by_participant_limit, mock_campaign_has_been_started, campaign_not_started,
            mock_save_rule, mock_campaign_save, mock_regions, mock_game_modified):
        # Arrange
        regions_data = "fake_region"
        form_data = 'fake_form_data'
        mock_campaign_save.return_value = Campaign()
        # Act
        response = CampaignSerializer().update_campaign_according_rules(self.instance, self.validate_data, regions_data,
                                                                        form_data)
        #  Assert
        self.assertIsInstance(response, Campaign)

    def test__compare_dict_list__equal_lists__false(self):
        # Act
        response = CampaignSerializer().compare_dict_lists(self.list_1_to_compare_dict_lists,
                                                           self.list_1_to_compare_dict_lists)
        # Assert
        self.assertFalse(response)

    def test__compare_dict_list__different_lists__true(self):
        # Act
        response = CampaignSerializer().compare_dict_lists(self.list_1_to_compare_dict_lists,
                                                           self.list_2_to_compare_dict_lists)
        response_inverted_parameters = CampaignSerializer().compare_dict_lists(self.list_2_to_compare_dict_lists,
                                                                               self.list_1_to_compare_dict_lists)
        # Assert
        self.assertTrue(response)
        self.assertTrue(response_inverted_parameters)
