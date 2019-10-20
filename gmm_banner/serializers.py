from operator import xor
from rest_framework import serializers
from gmm_banner.models import Banner, BannerConfiguration
from gmm_campaign.serializers import CampaignSerializer
from gmm_game.serializers import GameSerializer
from gmm_region.serializer import RegionSerializer
from gmm_util.constants import Constants
from gmm_util.field import Field
from gmm_util.util import ValidateRegionsUtil


class BannerSerializer(serializers.ModelSerializer):
    language = serializers.ChoiceField(choices=Constants.LANGUAGES_CHOICES, default=Field.ENGLISH)

    class Meta:
        model = Banner
        fields = (Field.IMAGE_URL, Field.TARGET_URL, Field.LANGUAGE, Field.NAME)


class BannerConfigurationSerializer(serializers.ModelSerializer):
    banners = BannerSerializer(many=True)
    regions = RegionSerializer(many=True)
    games = GameSerializer(many=True)
    campaigns = CampaignSerializer(many=True)

    class Meta:
        model = BannerConfiguration
        related_fields = (Field.BANNERS, Field.REGIONS, Field.GAMES)

        fields = (Field.ID, Field.MODIFIED_DATE, Field.BANNER_CONFIGURATION_NAME, Field.ACTIVE, Field.CAMPAIGNS,
                  Field.BEGIN, Field.END, Field.GMT_TIMEZONE, Field.IS_EXPIRED,
                  Field.IS_USING_CAMPAIGN_DATE) + related_fields

    def validate(self, data):
        begin = None
        end = None
        if {Field.END, Field.BEGIN, Field.GMT_TIMEZONE}.issubset(set(data.keys())):
            is_begin_or_end_date_null = xor(data[Field.END] is None, data[Field.BEGIN] is None)

            if (data[Field.GMT_TIMEZONE] or not data[Field.GMT_TIMEZONE]) and is_begin_or_end_date_null:
                raise serializers.ValidationError({Constants.DATES: Constants.BEGIN_OR_END_DATE_NULL_ERROR})
            elif data[Field.BEGIN] and data[Field.END] and not data[Field.GMT_TIMEZONE]:
                raise serializers.ValidationError({Field.GMT_TIMEZONE: Constants.TIMEZONE_ERROR})

            if data[Field.END] and data[Field.BEGIN]:
                if self.instance:
                    begin = data.get(Field.BEGIN, self.instance.begin_date)
                    end = data.get(Field.END, self.instance.end_date)
                else:
                    begin = data.get(Field.BEGIN)
                    end = data.get(Field.END)
                if end <= begin:
                    raise serializers.ValidationError(
                        Constants.END_DATE + " must be greater than " + Constants.BEGIN_DATE)
        return data

    def validate_banners(self, data):
        if not data:
            raise serializers.ValidationError({Field.BANNERS: Constants.EMPTY_FIELD})
        return self.initial_data[Field.BANNERS]

    def validate_games(self, data):
        if not data:
            raise serializers.ValidationError({Field.GAMES: Constants.EMPTY_FIELD})
        return self.initial_data[Field.GAMES]

    def validate_regions(self, data):
        return ValidateRegionsUtil.validate_regions(self.initial_data, data)

    def validate_campaigns(self, data):
        return self.initial_data[Field.CAMPAIGNS]

    def create(self, validated_data):
        return BannerConfiguration.manager.create(validated_data)

    def update(self, instance, validated_data):
        return BannerConfiguration.manager.edit(instance, validated_data)
