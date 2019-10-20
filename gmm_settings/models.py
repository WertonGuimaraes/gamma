import datetime

from audit_log.models.managers import AuditLog
from django.conf import settings
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db import transaction


class SettingsManager(models.Manager):
    @transaction.atomic
    def update(self, game, data):
        game.__dict__.update(**data)
        game.save()
        self.update_time_to_refresh_token(game.update_time_refresh_token)
        return game

    @staticmethod
    def update_time_to_refresh_token(time_token):
        jwt_auth = getattr(settings, 'JWT_AUTH', {})
        jwt_auth.update({'JWT_EXPIRATION_DELTA': datetime.timedelta(0, time_token)})
        setattr(settings, 'JWT_AUTH', jwt_auth)

        from rest_framework_jwt import settings as settings_jwt
        settings_jwt.api_settings.JWT_EXPIRATION_DELTA = datetime.timedelta(0, time_token)


class Settings(models.Model):
    update_time_push = models.IntegerField(validators=[MinValueValidator(300), MaxValueValidator(86400)])
    update_time_participant_number = models.IntegerField(validators=[MinValueValidator(10), MaxValueValidator(21600)])
    update_time_refresh_token = models.IntegerField(validators=[MinValueValidator(30), MaxValueValidator(21600)])
    update_analytics_client_id = models.CharField(max_length=254, blank=True)

    audit_log = AuditLog()

    manager = SettingsManager()

    class Meta:
        permissions = (('view_settings', 'Can view settings'),)
