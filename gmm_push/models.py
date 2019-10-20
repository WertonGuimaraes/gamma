from datetime import datetime

from django.db import models, transaction
from django.utils import timezone

from gmm_game.models import Game
from gmm_util.ApiKeyUtil import ApiKeyUtil
from gmm_util.PushDetailsUtil import PushDetailsUtil
from gmm_util.field import Field
from gmm_mobile.v1.exceptions import PlayerAlreadyRegisteredError


'''
    EnvironmentInfo
'''


class EnvironmentInfoManager(models.Manager):

    @transaction.atomic
    def create(self, environment_info):
        return super(EnvironmentInfoManager, self).create(**environment_info)


class EnvironmentInfo(models.Model):
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
    app_language = models.CharField(max_length=254)

    manager = EnvironmentInfoManager()


'''
    Player
'''


class DeviceUserManager(models.Manager):
    @transaction.atomic
    def create_or_update(self, device_user_data, environment_info_data, game):
        is_new_device_user = False
        last_date_played = device_user_data.pop(Field.LAST_DATE_PLAYED, timezone.now())

        try:
            device_user = self.get_player(device_user_data, game)
            if self.exist_gpg_id(device_user, device_user_data):
                raise PlayerAlreadyRegisteredError()

            device_user.__dict__.update(last_date_played=last_date_played, **device_user_data)
            device_user.save()
        except DeviceUser.DoesNotExist:
            device_user = super(DeviceUserManager, self).create(last_date_played=last_date_played, **device_user_data)
            is_new_device_user = True

        device_user.environment_info = EnvironmentInfo.manager.create(environment_info_data)
        device_user.game = game
        device_user.save()

        return is_new_device_user

    @staticmethod
    def get_player(player_data, game):
        gcm_id_request = player_data[Field.GCM_ID]
        email = player_data[Field.EMAIL]
        device_user = DeviceUser.manager.get(email=email, gcm_id=gcm_id_request, game=game)
        return device_user

    @staticmethod
    def exist_gpg_id(player, player_data):
        return player.gpg_id == player_data[Field.GPG_ID]


class DeviceUser(models.Model, ApiKeyUtil, PushDetailsUtil):
    email = models.EmailField()
    gpg_id = models.CharField(max_length=254)
    gcm_id = models.CharField(max_length=254)
    environment_info = models.OneToOneField(EnvironmentInfo, null=True)
    game = models.ForeignKey(Game, related_name=Field.USERS, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)
    last_date_played = models.DateTimeField(null=True)

    manager = DeviceUserManager()

    class Meta:
        permissions = (('view_device_user', 'Can view device user'),)
