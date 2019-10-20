from audit_log.models.managers import AuditLog
from django.db import models
from django.db import transaction
from django.utils import timezone

import gmm_push_notification
from gmm_campaign.exceptions import CampaignIsNotOpenError
from gmm_game.models import Game
from gmm_push.models import DeviceUser
from gmm_region.models import Region
from gmm_util.ApiKeyUtil import ApiKeyUtil
from gmm_util.PushDetailsUtil import PushDetailsUtil
from gmm_util.constants import Constants
from gmm_util.field import Field

'''
   Location
'''


class LocationManager(models.Manager):

    @transaction.atomic
    def create(self, location):
        location = super(LocationManager, self).create(**location)
        return location


class Location(models.Model):
    location_status = models.CharField(max_length=254)
    location_country = models.CharField(max_length=254)
    location_country_code = models.CharField(max_length=254)
    location_region = models.CharField(max_length=254)
    location_region_name = models.CharField(max_length=254)
    location_city = models.CharField(max_length=254)
    location_zip = models.CharField(max_length=254)
    location_lat = models.CharField(max_length=254)
    location_lon = models.CharField(max_length=254)
    location_timezone = models.CharField(max_length=254)
    location_isp = models.CharField(max_length=254)
    location_org = models.CharField(max_length=254)
    location_as = models.CharField(max_length=254)
    location_query = models.CharField(max_length=254)
    location_source = models.CharField(max_length=254)
    location_date = models.DateTimeField()
    app_version = models.CharField(max_length=254)
    device_language = models.CharField(max_length=254)

    manager = LocationManager()

'''
   Campaign
'''


class CampaignManager(models.Manager):

    @transaction.atomic
    def create(self, data):
        regions_data = data.pop(Field.REGIONS)
        form_data = data.pop(Field.FORMS)
        end_date = data[Field.END]
        data[Field.EXPIRATION_DATE] = end_date

        campaign = super(CampaignManager, self).create(**data)
        self._create_relationship_with_regions(campaign, regions_data)
        self._create_relationship_with_forms(campaign, form_data)

        return campaign

    @transaction.atomic
    def edit(self, campaign, data):
        regions_data = data.get(Field.REGIONS)
        form_data = data.get(Field.FORMS)

        campaign.__dict__.update(**data)
        campaign = self.update_expiration_date(campaign, data)
        self._create_relationship_with_regions(campaign, regions_data)
        self._create_relationship_with_forms(campaign, form_data)

        campaign.save()
        return campaign

    @staticmethod
    def _create_relationship_with_regions(campaign, regions_data):
        if regions_data is not None:
            all_filtered_regions = [region_data[Field.ID] for region_data in regions_data]
            campaign.regions = Region.manager.filter(id__in=all_filtered_regions)

    @staticmethod
    def _create_relationship_with_forms(campaign, form_data):
        if form_data is not None:
            Rule.manager.edit_rule(campaign, form_data)

    @staticmethod
    def update_expiration_date(campaign, new_end_date):
        if Field.END in new_end_date.keys() and campaign.expiration_date != new_end_date[Field.END]:
            campaign.expiration_date = new_end_date[Field.END]
        return campaign

    @transaction.atomic
    def filter_activated_campaigns(self, country_code):
        activated_campaigns = Campaign.manager.filter(active=True, regions__countries__country_code=country_code)

        if not activated_campaigns:
            raise Campaign.DoesNotExist
        return activated_campaigns


class Campaign(models.Model):
    name = models.CharField(max_length=50)
    active = models.BooleanField(default=False, blank=False, null=False)
    begin_date = models.DateTimeField(null=False)
    end_date = models.DateTimeField(null=False)
    gmt_timezone = models.CharField(max_length=254)
    participant_limit = models.IntegerField()
    regions = models.ManyToManyField(Region)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    modified_date = models.DateTimeField(auto_now=True, null=True)
    expiration_date = models.DateTimeField(null=False)
    partial_enabled_time = models.IntegerField(default=0, null=False)
    last_enabled_time = models.DateTimeField(null=True)

    audit_log = AuditLog()

    class Meta:
        permissions = (('view_campaign', 'Can view campaign'),)

    def _get_opened(self):
        is_current = self.begin_date <= timezone.now() <= self.end_date
        is_active = self.active
        is_limit = self.participations.count() < self.participant_limit

        return is_current and is_active and is_limit
    opened = property(_get_opened)

    def _get_countries_codes(self):
        campaign_counties = []
        for region in self.regions.all():
            campaign_counties += region.countries.values_list(Field.COUNTRY_CODE, flat=True)
        return campaign_counties
    countries_codes = property(_get_countries_codes)

    def _get_total_registered_participants(self):
        return self.participations.count()
    total_registered_participants = property(_get_total_registered_participants)

    def _get_total_registered_percentage(self):
        return float(self.participations.count()) / self.participant_limit
    total_registered_percentage = property(_get_total_registered_percentage)

    def _get_status(self):
        status = Constants.STATUS_PAUSED

        if self.active:
            current_time = timezone.now()

            if current_time < self.begin_date:
                status = Constants.STATUS_ABOUT_TO_START
            elif current_time < self.end_date and self.participant_limit > self.participations.count():
                status = Constants.STATUS_STARTED
            else:
                status = Constants.STATUS_FINISHED

        return status
    status = property(_get_status)

    manager = CampaignManager()

    def __eq__(self, other):
        return isinstance(other, self.__class__) \
            and self._get_id_val() == other._get_id_val() \
            and self.active == other.active \
            and self.begin_date == other.begin_date \
            and self.end_date == other.end_date \
            and self.participant_limit == other.participant_limit


'''
FORM
'''


class RuleManager(models.Manager):
    def create_rule(self, campaign, forms):
        for form_data in forms:
            push_rule_data = form_data.pop(Field.FORM_PUSH_VALUES) if Field.FORM_PUSH_VALUES in form_data else []

            game_data = form_data.pop('game', None)
            game_data.pop('push_templates', None)

            game = Game.manager.get(id=game_data[Field.ID])

            rule = Rule(campaign=campaign, game=game, **form_data)
            rule.save()

            self._create_relationship_between_rule_and_push_rules(rule, push_rule_data)

    def edit_rule(self, campaign, forms):
        self.delete_all_rules(campaign)
        self.create_rule(campaign, forms)

    def delete_all_rules(self, campaign):
        for forms in campaign.forms.all():
            forms.form_push_values.all().delete()
        campaign.forms.all().delete()

    @staticmethod
    def _create_relationship_between_rule_and_push_rules(rule, push_rule_data):
        if push_rule_data is not None:
            gmm_push_notification.models.Push.manager.edit_push_rule(rule, push_rule_data)


class Rule(models.Model):
    campaign = models.ForeignKey(Campaign, related_name="forms")
    game = models.ForeignKey(Game, related_name="forms")
    form_value = models.TextField()
    modified_date = models.DateTimeField(auto_now=True, null=True)

    audit_log = AuditLog()
    manager = RuleManager()

'''
    Participation
'''


class ParticipationManager(models.Manager):
    @transaction.atomic
    def register_player_in_campaign(self, data):
        location = Location.manager.create(data.pop(Field.LOCATION))
        campaign = data.pop(Field.CAMPAIGN)
        campaign = Campaign.manager.get(id=campaign)

        if not self._is_opened(campaign, location.location_country_code):
            raise CampaignIsNotOpenError

        participant = Participation(campaign=campaign, location=location, player=data[Field.PLAYER])
        participant.save()

        if self.is_the_last_participant(campaign):
            self.save_expiration_date(campaign, participant.registered_at)

        return participant

    def is_the_last_participant(self, campaign):
        return campaign.participations.count() == campaign.participant_limit

    def save_expiration_date(self, campaign, last_participant_date):
        campaign.expiration_date = last_participant_date
        campaign.save()

    def verify_participant_resgistered_in_campaign_by_id(self, email, campaign_id, service_id, country_code):
        game = Game.manager.get(game_service_id=service_id)
        campaign = Campaign.manager.get(id=campaign_id, forms__game__game_service_id=service_id)

        try:
            participation = self.get(player__email=email, campaign__id=campaign_id, player__game=game)
            registration = participation.registration
        except Participation.DoesNotExist:
            registration = None

        return {Constants.OPEN_CAMPAIGN: self._is_opened(campaign, country_code),
                Constants.REGISTER: registration}

    def _is_opened(self, campaign, country_code):
        return campaign.opened and country_code in campaign.countries_codes


class Participation(models.Model, ApiKeyUtil, PushDetailsUtil):
    player = models.ForeignKey(DeviceUser, related_name='player', null=False, blank=False)
    info = models.TextField(null=True, blank=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    location = models.OneToOneField(Location)
    campaign = models.ForeignKey(Campaign, related_name='participations')

    manager = ParticipationManager()

    class Meta:
        permissions = (('view_participation', 'Can view participation'),)

    def _get_registration(self):
        return {Field.EMAIL: self.player.email,
                Field.GPG_ID: self.player.gpg_id,
                Field.REGISTERED_AT: self.registered_at,
                Field.INFO: self.info
                }
    registration = property(_get_registration)

    def extract_api_key_from_devices(self, participants):
        api_key = {}
        if participants:
            for dev in participants:
                if dev.player.game.api_key not in api_key:
                    api_key[dev.player.game.api_key] = []
                api_key[dev.player.game.api_key].append(dev.player.gcm_id)
        return api_key

    def save_push_details(self, devices_users, response_push, push, push_details_instance):
        push_detail = None
        for dev in devices_users:
            status = dev.player.gcm_id in response_push[Field.SUCCESS]
            push_detail = push_details_instance(push=push, game=dev.player.game, email=dev.player.email, status=status,
                                                gcm_id=dev.player.gcm_id, gpg_id=dev.player.gpg_id)
            push_detail.save()
        return push_detail
