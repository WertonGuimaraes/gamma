import json

from pycountry import languages
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from rest_framework.generics import get_object_or_404
from gmm_campaign.models import Participation, Campaign, Rule
from gmm_campaign.serializers import LocationSerializer, RuleSerializer
from gmm_game.models import Game
from gmm_game.serializers import GameSerializer
from gmm_mobile.v1.exceptions import PlayerAlreadyRegisteredError, InvalidAppLanguageError
from gmm_push.models import DeviceUser, EnvironmentInfo
from gmm_util.constants import Constants
from gmm_util.field import Field
from gmm_util.util import CountryUtil


class OpenedCampaignMobileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Campaign
        fields = (Field.ID, Field.CAMPAIGN_NAME, Field.BEGIN, Field.END)

    def to_representation(self, instance):
        return {
            Field.ID: instance.id,
            Field.CAMPAIGN_NAME: instance.name,
            Field.BEGIN: instance.begin_date,
            Field.END: instance.end_date,
            Field.RULE: json.loads(instance.forms.all()[0].form_value)
        }


class CampaignSerializer(serializers.ModelSerializer):
    games = GameSerializer(many=True, read_only=True)
    opened = serializers.BooleanField(read_only=True)

    class Meta:
        model = Campaign
        fields = (
            Field.ID, Field.CAMPAIGN_NAME, Field.ACTIVE, Field.BEGIN, Field.END,
            Field.REGIONS, Field.GAMES, Field.PARTICIPANT_LIMIT, Field.OPENED
        )


class ParticipationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False, read_only=True)
    campaign = CampaignSerializer(many=False, read_only=True)
    game = GameSerializer(many=False, read_only=True)

    class Meta:
        model = Participation
        fields = (Field.ID, Field.EMAIL, Field.GPG_ID, Field.REGISTERED_AT, Field.LOCATION, Field.INFO, Field.CAMPAIGN,
                  Field.GAME, Field.GCM_ID)
        read_only_fields = (Field.GCM_ID, Field.INFO)


class RegisterParticipationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False)
    campaign = serializers.IntegerField()
    game_service_id = serializers.CharField(max_length=254)
    player = serializers.IntegerField()

    class Meta:
        model = Participation
        fields = (Field.ID, Field.REGISTERED_AT, Field.LOCATION, Field.INFO, Field.CAMPAIGN,
                  Field.GAME_SERVICE_ID, Field.PLAYER)

    def validate(self, data):
        data[Field.PLAYER] = get_object_or_404(DeviceUser.manager.all(), id=data[Field.PLAYER])
        rule = get_object_or_404(Rule.manager.all(), campaign=data[Field.CAMPAIGN],
                                 game__game_service_id=data[Field.GAME_SERVICE_ID], game=data[Field.PLAYER].game)
        data.pop(Field.GAME_SERVICE_ID, None)

        participants_by_game_and_campaign = Participation.manager.filter(campaign=data[Field.CAMPAIGN],
                                                                         player__game=data[Field.PLAYER].game)
        composite_key_by_email = participants_by_game_and_campaign.filter(player__email=data[Field.PLAYER].email)
        composite_key_by_gpg = participants_by_game_and_campaign.filter(player__gpg_id=data[Field.PLAYER].gpg_id)

        if (composite_key_by_email | composite_key_by_gpg).exists():
            raise PlayerAlreadyRegisteredError()
        return data

    def create(self, validated_data):
        return Participation.manager.register_player_in_campaign(validated_data)


class EnvironmentInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EnvironmentInfo
        fields = (
            Field.LOCATION_STATUS, Field.LOCATION_COUNTRY, Field.LOCATION_COUNTRY_CODE, Field.LOCATION_REGION,
            Field.LOCATION_REGION_NAME, Field.LOCATION_CITY, Field.ZIP_CODE, Field.LAT, Field.LON,
            Field.TIMEZONE, Field.ISP, Field.ORG, Field.AS_NUMBER, Field.LOCATION_QUERY,
            Field.DEVICE_LANGUAGE, Field.APP_LANGUAGE, Field.LOCATION_SOURCE, Field.LOCATION_DATE,
            Field.APP_VERSION
        )

    def validate_app_language(self, data):
        try:
            languages.get(iso639_1_code=data.lower())
        except KeyError:
            raise InvalidAppLanguageError()
        return data

    def validate_location_country_code(self, data):
        CountryUtil.valid_country_code(data)
        return data

    def validate(self, data):
        CountryUtil.validate_country_code_matching_with_name(country_name=data[Field.LOCATION_COUNTRY],
                                                             country_code=data[Field.LOCATION_COUNTRY_CODE])
        return data


class PlayerRegisterSerializer(serializers.ModelSerializer):
    environment_info = EnvironmentInfoSerializer(many=False, read_only=True)

    class Meta:
        model = DeviceUser
        fields = (Field.EMAIL, Field.GPG_ID, Field.GCM_ID, Field.ENVIRONMENT_INFO)
        read_only_fields = (Field.ENVIRONMENT_INFO,)

    @staticmethod
    def create_or_update(player_data, environment_info_data, game):
        return DeviceUser.manager.create_or_update(player_data, environment_info_data, game)


class PlayerSerializerLastPlayed(serializers.ModelSerializer):
    game = serializers.IntegerField()
    last_date_played = serializers.DateTimeField()

    class Meta:
        model = DeviceUser
        fields = (Field.EMAIL, Field.GAME, Field.LAST_DATE_PLAYED)

    def update(self, validated_data):
        game = Game.manager.get(pk=validated_data[Field.GAME])
        player = get_object_or_404(DeviceUser.manager.all(), game=game, email=validated_data[Field.EMAIL])
        player.last_date_played = validated_data[Field.LAST_DATE_PLAYED]
        player.save()
        return player
