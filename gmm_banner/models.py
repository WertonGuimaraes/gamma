from audit_log.models.managers import AuditLog
from django.db import models
from django.db import transaction
from django.utils import timezone

from gmm_campaign.models import Campaign
from gmm_game.models import Game
from gmm_region.models import Region
from gmm_util.constants import Constants
from gmm_util.field import Field

'''
    BannerConfiguration
'''


class BannerConfigurationManager(models.Manager):

    @transaction.atomic
    def create(self, data):
        banners_data = data.pop(Field.BANNERS)
        regions_data = data.pop(Field.REGIONS)
        games_data = data.pop(Field.GAMES)
        campaigns_data = data.pop(Field.CAMPAIGNS)

        banner_configuration = super(BannerConfigurationManager, self).create(**data)
        self._create_relationship_with_regions(banner_configuration, regions_data)
        self._create_relationship_with_games(banner_configuration, games_data)
        self._create_relationship_with_campaign(banner_configuration, campaigns_data)
        Banner.manager.create_banners(banner_configuration, banners_data)

        return banner_configuration

    @transaction.atomic
    def edit(self, banner_configuration, data):
        banners_data = data.get(Field.BANNERS)
        regions_data = data.get(Field.REGIONS)
        games_data = data.get(Field.GAMES)
        campaigns_data = data.get(Field.CAMPAIGNS)

        self._create_relationship_with_regions(banner_configuration, regions_data)
        self._create_relationship_with_games(banner_configuration, games_data)
        self._create_relationship_with_banners(banner_configuration, banners_data)
        self._create_relationship_with_campaign(banner_configuration, campaigns_data)
        banner_configuration.__dict__.update(**data)
        banner_configuration.save()

        return banner_configuration

    @staticmethod
    def _create_relationship_with_regions(banner_configuration, regions_data):
        if regions_data is not None:
            new_regions = Region.manager.filter(id__in=[region_data[Field.ID] for region_data in regions_data])
            banner_configuration.regions = new_regions

    @staticmethod
    def _create_relationship_with_games(banner_configuration, games_data):
        if games_data is not None:
            new_games = Game.manager.filter(id__in=[game_data[Field.ID] for game_data in games_data])
            banner_configuration.games = new_games

    @staticmethod
    def _create_relationship_with_banners(banner_configuration, banners_data):
        if banners_data is not None:
            Banner.manager.edit_banners_url(banner_configuration, banners_data)

    @staticmethod
    def _create_relationship_with_campaign(banner_configuration, campaigns_data):
        if campaigns_data is not None:
            new_campaign = Campaign.manager.filter(id__in=[campaign_data[Field.ID] for campaign_data in
                                                           campaigns_data])
            banner_configuration.campaigns = new_campaign


class BannerConfiguration(models.Model):
    banner_configuration_name = models.CharField(max_length=254)
    regions = models.ManyToManyField(Region)
    games = models.ManyToManyField(Game)
    campaigns = models.ManyToManyField(Campaign, blank=True, null=True)
    active = models.BooleanField(null=False, default=True)
    modified_date = models.DateTimeField(auto_now=True, null=True)
    created_date = models.DateTimeField(auto_now_add=True, null=True)
    begin_date = models.DateTimeField(null=True)
    end_date = models.DateTimeField(null=True)
    gmt_timezone = models.CharField(max_length=254, blank=True, null=True)
    is_using_campaign_date = models.BooleanField(null=False, default=False)

    audit_log = AuditLog()
    manager = BannerConfigurationManager()

    class Meta:
        permissions = (('view_bannerconfiguration', 'Can view banner'),)

    def _is_expired(self):
        is_expired = False
        if self.end_date:
            is_expired = timezone.now() >= self.end_date
        return is_expired
    is_expired = property(_is_expired)

    def _get_status(self):
        status = Constants.STATUS_PAUSED

        if self.active:
            current_time = timezone.now()

            if self.begin_date and current_time < self.begin_date:
                status = Constants.STATUS_ABOUT_TO_START

            elif not self.end_date or current_time < self.end_date:
                status = Constants.STATUS_STARTED
            else:
                status = Constants.STATUS_FINISHED

        return status
    status = property(_get_status)


'''
    Banner
'''


class BannerManager(models.Manager):

    @transaction.atomic
    def create_banners(self, banner_configuration, banners):
        for banner in banners:
            Banner.manager.create(bannerconfiguration=banner_configuration, **banner)

    @transaction.atomic
    def edit_banners_url(self, banner_configuration, banners_url_data):
        self.delete_banners(banner_configuration)
        self.create_banners(banner_configuration, banners_url_data)

    @transaction.atomic
    def delete_banners(self, banner_configuration):
        banner_configuration.banners.all().delete()


class Banner(models.Model):
    image_url = models.URLField(max_length=254)
    target_url = models.URLField(max_length=254)
    language = models.CharField(max_length=254, choices=Constants.LANGUAGES_CHOICES, default=Field.ALL_LANGUAGES)
    name = models.CharField(max_length=254, null=False, blank=False)

    bannerconfiguration = models.ForeignKey(BannerConfiguration, null=False, related_name=Field.BANNERS)
    manager = BannerManager()
