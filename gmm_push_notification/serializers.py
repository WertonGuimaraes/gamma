import ast

from rest_framework import serializers

from gmm_campaign.exceptions import TypeFieldGameError
from gmm_game.serializers import GameSerializer
from gmm_push_notification.models import Push, PushDetails, PushesList
from gmm_util.field import Field


class PushSerializer(serializers.ModelSerializer):

    class Meta:
        model = Push
        fields = (Field.ID, Field.MODIFIED_DATE, Field.DATE, Field.STATUS_ERROR, Field.SUCCESS_COUNT, Field.DATA,
                  Field.QUERY, Field.PUSH_BEGIN_DATE, Field.PUSH_END_DATE, Field.PUSH_TIMEZONE, Field.CAN_SEND_PUSH)
        read_only_fields = (Field.STATUS_ERROR, Field.SUCCESS_COUNT,)

    def validate_data(self, data):
        try:
            if isinstance(data, (str, unicode)):
                ast.literal_eval(data)
        except:
            raise TypeFieldGameError()
        return data

    def create(self, push_data):
        query = push_data.pop(Field.QUERY)
        data = push_data.pop(Field.DATA)
        data = ast.literal_eval(data) if isinstance(data, (str, unicode)) else data

        return Push.manager.create(data, query, push_data)


class PushesListSerializer(serializers.ModelSerializer):
    pushes = PushSerializer(many=True)

    class Meta:
        model = PushesList
        fields = (Field.PUSHES, )

    def create(self, push_data):
        return PushesList.manager.create(push_data)


class PushDetailsSerializer(serializers.ModelSerializer):
    game = GameSerializer(many=False)

    class Meta:
        model = PushDetails
        fields = (Field.ID, Field.EMAIL, Field.DATE, Field.STATUS, Field.GAME, Field.GCM_ID, Field.GPG_ID)
