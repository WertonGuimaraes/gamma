from django.http.request import QueryDict
from rest_framework import serializers

from gmm_settings.models import Settings
from gmm_util.field import Field


class SettingsSerializer(serializers.ModelSerializer):

    class Meta:
        model = Settings
        fields = (Field.ID, Field.UPDATE_TIME_PUSH, Field.UPDATE_TIME_PARTICIPANT_NUMBER,
                  Field.UPDATE_TIME_REFRESH_TOKEN, Field.UPDATE_ANALYTICS_CLIENT_ID, )

    def update(self, game, data):
        if isinstance(data, QueryDict):
            data = data.dict()

        return Settings.manager.update(game, data)
