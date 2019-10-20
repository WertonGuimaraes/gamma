from rest_framework import serializers
from django.utils import timezone
from gmm_campaign.exceptions import EmptyFieldError, TypeFieldGameError
from gmm_campaign.models import Campaign, Rule
from gmm_campaign.models import Location
from gmm_campaign.models import Participation
from gmm_game.serializers import GameSerializer
from gmm_push.serializers import PlayerSerializer
from gmm_push_notification.serializers import PushSerializer
from gmm_region.models import Region
from gmm_region.serializer import RegionSerializer
from gmm_util.constants import Constants
from gmm_util.field import Field
from gmm_util.util import ValidateRegionsUtil, CountryUtil


class RuleSerializer(serializers.ModelSerializer):
    game = GameSerializer(many=False)
    form_push_values = PushSerializer(many=True, required=False)

    class Meta:
        model = Rule
        fields = (Field.GAME, Field.FORM_VALUE, Field.FORM_PUSH_VALUES)


class CampaignSerializer(serializers.ModelSerializer):
    regions = RegionSerializer(many=True)
    forms = RuleSerializer(many=True)
    opened = serializers.BooleanField(read_only=True)
    total_registered_participants = serializers.IntegerField(read_only=True)
    active = serializers.BooleanField(default=False)

    class Meta:
        model = Campaign
        fields = (Field.MODIFIED_DATE, Field.EXPIRATION_DATE, Field.ID, Field.CAMPAIGN_NAME, Field.ACTIVE,
                  Field.BEGIN, Field.END, Field.PARTICIPANT_LIMIT, Field.REGIONS, Field.OPENED,
                  Field.TOTAL_REGISTERED_PARTICIPANTS, Field.GMT_TIMEZONE, Field.FORMS, Field.STATUS,
                  Field.LAST_ENABLED_TIME, Field.PARTIAL_ENABLED_TIME)

        read_only_fields = (Field.EXPIRATION_DATE,)

    def validate_regions(self, data):
        try:
            return ValidateRegionsUtil.validate_regions(self.initial_data, data)
        except AttributeError:
            return data

    def validate_forms(self, data):
        try:
            if Field.FORMS in self.initial_data:
                if not data:
                    raise EmptyFieldError(Field.FORMS)
                return self.initial_data[Field.FORMS]
            else:
                return None
        except AttributeError:
            return data

    def create(self, validated_data):
        return Campaign.manager.create(validated_data)

    def update(self, instance, validated_data):
        if instance.active == validated_data[Field.ACTIVE]:
            if validated_data[Field.ACTIVE] and instance.end_date < validated_data[Field.END]:
                instance.partial_enabled_time += (instance.end_date - instance.last_enabled_time).total_seconds()
                instance.last_enabled_time = timezone.now()
            regions_data = validated_data.get(Field.REGIONS)
            form_data = validated_data.get(Field.FORMS)
            return self.update_campaign_according_rules(instance, validated_data, regions_data, form_data)
        else:
            if validated_data[Field.ACTIVE]:
                instance = Campaign.manager.edit(instance, validated_data)
                self.update_info_when_active_campaign(instance)
            else:
                instance = self.update_info_when_deactivate_campaign(instance)
                Campaign.manager.edit(instance, validated_data)

        return instance

    @staticmethod
    def update_info_when_active_campaign(instance):
        if instance.status == Constants.STATUS_FINISHED:
            if instance.participant_limit == instance.participations.count():
                instance.last_enabled_time = instance.expiration_date
            else:
                instance.last_enabled_time = instance.end_date
        elif instance.status == Constants.STATUS_STARTED:
            instance.last_enabled_time = timezone.now()
        elif instance.status == Constants.STATUS_ABOUT_TO_START:
            instance.last_enabled_time = instance.begin_date

        instance.save()
        return instance

    @staticmethod
    def update_info_when_deactivate_campaign(instance):
        if instance.status == Constants.STATUS_FINISHED:
            if instance.participant_limit == instance.participations.count():
                instance.partial_enabled_time += (instance.expiration_date - instance.last_enabled_time).total_seconds()
                instance.last_enabled_time = instance.expiration_date
            else:
                instance.partial_enabled_time += (instance.end_date - instance.last_enabled_time).total_seconds()
                instance.last_enabled_time = instance.end_date
        elif instance.status == Constants.STATUS_STARTED:
            instance.partial_enabled_time += (timezone.now() - instance.last_enabled_time).total_seconds()

        instance.save()
        return instance

    def campaign_has_been_started(self, instance):
        return instance.begin_date <= timezone.now()

    def update_campaign_according_rules(self, instance, validated_data, regions_data, form_data):
        if not self.is_campaign_finished_by_participant_limit(instance):
            if self.campaign_has_been_started(instance):
                return self.update_started_campaign(instance, validated_data, regions_data, form_data)
            return self.update_not_started_campaign(instance, validated_data)
        else:
            if not self.was_campaign_modified(instance, validated_data, form_data, regions_data):
                return instance
        raise serializers.ValidationError(Constants.CAMPAIGN_FINISHED_BY_PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR)

    def update_started_campaign(self, instance, validated_data, regions_data, form_data):
        if self.started_campaign_can_be_updated(instance, validated_data, regions_data, form_data):
            return Campaign.manager.edit(instance, validated_data)
        raise serializers.ValidationError(Constants.STARTED_CAMPAIGN_EDIT_CONTROL_ERROR)

    def update_not_started_campaign(self, instance, validated_data):
        if self.not_started_campaign_can_be_updated(instance, validated_data):
            return Campaign.manager.edit(instance, validated_data)
        raise serializers.ValidationError(Constants.PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR)

    def started_campaign_can_be_updated(self, instance, validated_data, regions_data, form_data):
        return (instance.begin_date == validated_data[Field.BEGIN] and
                instance.participant_limit == validated_data[Field.PARTICIPANT_LIMIT] and
                instance.gmt_timezone == validated_data[Field.GMT_TIMEZONE] and
                not self.was_game_modified(form_data, instance.forms.all()) and
                not self.was_regions_modified(instance.regions.all(), validated_data[Field.REGIONS])) or \
               not self.was_campaign_modified(instance, validated_data, form_data, regions_data)

    def is_campaign_finished_by_participant_limit(self, instance):
        return instance.participations.count() >= instance.participant_limit

    def not_started_campaign_can_be_updated(self, instance, validated_data):
        return instance.participant_limit == validated_data[Field.PARTICIPANT_LIMIT]

    def was_campaign_modified(self, instance, validated_data, form_data, regions_data):
        return instance.end_date != validated_data[Field.END] or \
               instance.begin_date != validated_data[Field.BEGIN] or \
               instance.name != validated_data[Field.NAME] or \
               instance.participant_limit != validated_data[Field.PARTICIPANT_LIMIT] or \
               self.was_game_modified(form_data, Rule.manager.filter(campaign=instance.id)) or \
               self.was_regions_modified(Region.manager.filter(campaign=instance.id), regions_data)

    def was_game_modified(self, form_data, rule):
        old_rule = []
        new_rule = []
        for r in form_data:
            received_rule = dict()
            received_rule[Field.GAME] = r[Field.GAME][Field.ID]
            new_rule.append(received_rule)

        for f in rule:
            rule_to_be_updated = dict()
            rule_to_be_updated[Field.GAME] = f.game_id
            old_rule.append(rule_to_be_updated)

        return self.compare_dict_lists(new_rule, old_rule)

    def was_regions_modified(self, old_region, new_region):
        old_regions = []
        new_regions = []
        for v in old_region:
            received_region = dict()
            received_region[Field.NAME] = v.name
            received_region[Field.ID] = v.id
            old_regions.append(received_region)

        for v in new_region:
            region_to_be_updated = dict()
            region_to_be_updated[Field.NAME] = v[Field.NAME]
            region_to_be_updated[Field.ID] = v[Field.ID]
            new_regions.append(region_to_be_updated)

        return self.compare_dict_lists(new_regions, old_regions)

    def compare_dict_lists(self, list_1, list_2):
        if len(list_1) != len(list_2):
            return True
        else:
            for element in list_1:
                if element not in list_2:
                    return True
        return False

    def validate(self, data):
        begin = data.get(Field.BEGIN)
        end = data.get(Field.END)
        if self.instance:
            begin = data.get(Field.BEGIN, self.instance.begin_date)
            end = data.get(Field.END, self.instance.end_date)
        if end <= begin:
            raise serializers.ValidationError(Field.END + " must be greater than " + Field.BEGIN)
        return data


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = (
            Field.LOCATION_STATUS, Field.LOCATION_COUNTRY, Field.LOCATION_COUNTRY_CODE, Field.LOCATION_REGION,
            Field.LOCATION_REGION_NAME, Field.LOCATION_CITY, Field.ZIP_CODE, Field.LAT, Field.LON,
            Field.TIMEZONE, Field.ISP, Field.ORG, Field.AS_NUMBER, Field.LOCATION_QUERY,
            Field.DEVICE_LANGUAGE, Field.LOCATION_SOURCE, Field.LOCATION_DATE, Field.APP_VERSION
        )

    def validate(self, data):
        CountryUtil.validate_country_code_matching_with_name(country_name=data[Field.LOCATION_COUNTRY],
                                                             country_code=data[Field.LOCATION_COUNTRY_CODE])
        return data


class ParticipationSerializer(serializers.ModelSerializer):
    location = LocationSerializer(many=False, read_only=True)
    campaign = CampaignSerializer(many=False, read_only=True)
    player = PlayerSerializer(many=False, required=True)

    class Meta:
        model = Participation
        fields = (Field.ID, Field.REGISTERED_AT, Field.LOCATION, Field.INFO, Field.CAMPAIGN, Field.PLAYER)
        read_only_fields = (Field.REGISTERED_AT,)
