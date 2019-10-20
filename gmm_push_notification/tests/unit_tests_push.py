from unittest import TestCase
from gmm_push.models import DeviceUser, EnvironmentInfo
from gmm_push_notification.models import PushManager, Push, PushDetails
from gmm_util.push_notification import send_push, list_results_from_push_notification_response, \
    push_notification_exception_treatment
from gmm_util.util_objects_test import create_game


class PushUnitTest(TestCase):

    def setUp(self):
        game = create_game()
        device = DeviceUser(email="email", gpg_id="1", gcm_id="gcm_id", environment_info=EnvironmentInfo(),
                            game=game)
        self.devices = [device, device]

        data = {"data": "{'message': 'default_message'}", "query": "{'games': '1'}"}
        self.push = Push(**data)
        self.push.save()

    def test__extract_api_key__device_user__data_structure(self):
        # Arrange
        expect = {'api_key': ['gcm_id', 'gcm_id']}
        # Act
        resp = PushManager().extract_api_key_from_devices(self.devices)
        # Assert
        self.assertEquals(expect, resp)

    def test__save_push_details__push_details_object_status_true(self):
        # Arrange
        response_push = {'success': ['gcm_id', 'gcm_id'], 'errors': ['fake']}
        # Act
        push_details = PushManager().save_push_details(self.devices, response_push, self.push)
        # Assert
        self.assertIsInstance(push_details, PushDetails)
        self.assertTrue(push_details.status)

    def test__save_push_details__push_details_object_status_false(self):
        # Arrange
        response_push = {'success': ['gcm_id_2', 'gcm_id_3'], 'errors': ['fake']}
        # Act
        push_details = PushManager().save_push_details(self.devices, response_push, self.push)
        # Assert
        self.assertIsInstance(push_details, PushDetails)
        self.assertFalse(push_details.status)

    def test__send_push__api_key_dic_with_invalid_gcm_ids__dict_equals_to_expected(self):
        # Arrange
        api_key = {u'AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE': [u'C', u'C'],
                   u'AIzaSyAigLXJ9cGRoDzzgDOJIHuajEyUR0tCPXg': [u'B', u'B', u'', u'', u'', u'', u'', u'', u'', u'', u'',
                                                                u'', u'', u'', u'', u'', u'', u'', u'', u'OLA', u'OLA',
                                                                u'OLA', u'OLA', u'OLA', u'OLA', u'OLA', u'OLA', u'OLA',
                                                                u'OLA', u'OLA']}
        data = {"message": "default message"}
        expected = {'errors': {u'MissingRegistration': [u'', u'', u'', u'', u'', u'', u'', u'', u'', u'', u'', u'', u'',
                                                        u'', u'', u'', u''], u'InvalidRegistration': [u'C', u'C', u'B',
                                                                                                      u'B', u'OLA',
                                                                                                      u'OLA', u'OLA',
                                                                                                      u'OLA', u'OLA',
                                                                                                      u'OLA', u'OLA',
                                                                                                      u'OLA', u'OLA',
                                                                                                      u'OLA', u'OLA']},
                    'success': {}}
        # Act
        response_list = send_push(api_key, data)
        # Assert
        self.assertDictEqual(expected, response_list)

    def test__list_results_from_response__response_from_a_push_request__true(self):
        # Arrange
        response = {'errors': {u'InvalidRegistration': [u'C', u'C']}}
        response_list = {'errors': {}, 'success': {}}
        expected = {'errors': {u'InvalidRegistration': [u'C', u'C']}, 'success': {}}
        # Act
        response_list_updated = list_results_from_push_notification_response(response=response,
                                                                             response_list=response_list)
        # Assert
        self.assertDictEqual(expected, response_list_updated)

    def test__push_notification_exception_treatment__response_list_without_fail_field__true(self):
        response_list = {'errors': {u'InvalidRegistration': [u'C', u'C']}}

        gcm = ["invalid_gcm"]

        expect = {'errors': {u'InvalidRegistration': [u'C', u'C'], 'fail': [gcm]}}

        response_list_updated = push_notification_exception_treatment(response_list, gcm)

        self.assertDictEqual(expect, response_list_updated)

    def test__push_notification_exception_treatment__response_list_with_fail_field__true(self):
        response_list = {'errors': {'fail': ['invalid_gcm_1'], u'InvalidRegistration': [u'C', u'C']}}

        gcm = "invalid_gcm_2"

        expect = {'errors': {'fail': ['invalid_gcm_1', gcm], u'InvalidRegistration': [u'C', u'C']}}

        response_list_updated = push_notification_exception_treatment(response_list, gcm)

        self.assertDictEqual(expect, response_list_updated)
