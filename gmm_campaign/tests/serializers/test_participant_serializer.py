from django.test.testcases import TestCase
from gmm_util.util_test import JsonObjects, PLAYER
from gmm_campaign.serializers import ParticipationSerializer


class ParticipantSerializerTestCase(TestCase):
    environment1 = JsonObjects.environment_info_1()
    participant = JsonObjects.participant_without_location(location=environment1, player=PLAYER)
    participant_serializer = ParticipationSerializer(data=participant)
    participant_invalid = JsonObjects.participant_without_location()
    participant_serializer_invalid = ParticipationSerializer(data=participant_invalid)

    def test_json_participant_is_valid(self):
        is_valid = self.participant_serializer.is_valid(raise_exception=True)
        self.assertTrue(is_valid)

    def test_json_participant_is_not_valid(self):
        is_valid = self.participant_serializer_invalid.is_valid(
            raise_exception=False)
        self.assertFalse(is_valid)
