from time import timezone

from rest_framework import serializers

from gmm_game.serializers import GameSerializer
from gmm_push.models import DeviceUser, EnvironmentInfo
from gmm_util.field import Field
from gmm_util.util import CountryUtil


class EnvironmentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentInfo
        fields = (
            Field.LOCATION_STATUS, Field.LOCATION_COUNTRY, Field.LOCATION_COUNTRY_CODE, Field.LOCATION_REGION,
            Field.LOCATION_REGION_NAME, Field.LOCATION_CITY, Field.ZIP_CODE, Field.LAT, Field.LON,
            Field.TIMEZONE, Field.ISP, Field.ORG, Field.AS_NUMBER, Field.LOCATION_QUERY,
            Field.DEVICE_LANGUAGE, Field.LOCATION_SOURCE, Field.LOCATION_DATE,
            Field.APP_VERSION
        )

    def validate(self, data):
        CountryUtil.validate_country_code_matching_with_name(country_name=data[Field.LOCATION_COUNTRY],
                                                             country_code=data[Field.LOCATION_COUNTRY_CODE])
        return data


class PlayerSerializer(serializers.ModelSerializer):
    environment_info = EnvironmentInfoSerializer(many=False, read_only=True)
    game = GameSerializer(many=False)

    class Meta:
        model = DeviceUser
        fields = (Field.EMAIL, Field.LAST_DATE_PLAYED, Field.GPG_ID, Field.GCM_ID, Field.ENVIRONMENT_INFO, Field.GAME,
                  Field.REGISTERED_AT)
        read_only_fields = (Field.ENVIRONMENT_INFO, Field.DATE, Field.LAST_DATE_PLAYED)
