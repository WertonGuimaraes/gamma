import re
from audit_log.models.managers import AuditLog
from django.core.validators import RegexValidator
from django.db import models
from django.db import transaction
from django.core.validators import MaxLengthValidator, MinLengthValidator

from gmm_campaign.exceptions import UniqueFieldGameError
from gmm_util.constants import Constants
from gmm_util.field import Field

'''
    Game
'''


class GameManager(models.Manager):
    @transaction.atomic
    def create(self, game_data):
        self.validate_fields(None, game_data)
        push_templates = game_data.pop(Field.PUSH_TEMPLATES)
        game = super(GameManager, self).create(**game_data)
        self._create_relationship_with_push_template(game, push_templates)
        return game

    @transaction.atomic
    def edit(self, game, game_data):
        self.validate_fields(game, game_data)
        game.__dict__.update(**game_data)
        self._create_relationship_with_push_template(game, game_data.get(Field.PUSH_TEMPLATES))
        game.save()
        return game

    @staticmethod
    def _create_relationship_with_push_template(game, push_template):
        if push_template is not None:
            PushTemplate.manager.edit_push_templates(game, push_template)

    def validate_fields(self, game, game_data):
        self._validate_unique(game, package_name=game_data[Field.PACKAGE_NAME])
        self._validate_unique(game, game_service_id=game_data[Field.GAME_SERVICE_ID])
        self._validate_unique(game, api_key=game_data[Field.GAME_API_KEY])

    def _validate_unique(self, game, **field):
        try:
            game_found = Game.manager.get(**field)
            if game != game_found:
                raise UniqueFieldGameError(field.keys()[0])
        except Game.DoesNotExist:
            pass
        return game


class Game(models.Model):
    name = models.CharField(max_length=254, null=False, blank=False)
    analytics_view_id = models.CharField(null=True, blank=True, max_length=254,
                                         validators=[
                                             MinLengthValidator(9),
                                             RegexValidator(re.compile(r'^[0-9]*$'), Constants.ONLY_NUMBERS_ALLOWED)])
    package_name = models.CharField(max_length=254, null=False, blank=False)
    game_service_id = models.CharField(max_length=254, null=False, blank=False)
    game_image = models.URLField(max_length=254)
    api_key = models.CharField(max_length=254, null=False, blank=False)
    modified_date = models.DateTimeField(auto_now=True, null=True)
    form_template = models.TextField()

    audit_log = AuditLog()
    manager = GameManager()

    class Meta:
        permissions = (('view_game', 'Can view game'),)

    def __str__(self):
        return str(self.name) + "|" + str(self.package_name) + "|" + str(self.game_service_id)


class PushTemplateManager(models.Manager):
    @transaction.atomic
    def create_push_templates(self, game, push_templates_data):
        for push_template_data in push_templates_data:
            PushTemplate.manager.create(game=game, **push_template_data)

    @transaction.atomic
    def edit_push_templates(self, game, push_templates_data):
        self.delete_push_templates(game)
        self.create_push_templates(game, push_templates_data)

    @transaction.atomic
    def delete_push_templates(self, game):
        game.push_templates.all().delete()


class PushTemplate(models.Model):
    push_template = models.TextField()
    game = models.ForeignKey(Game, null=False, related_name=Field.PUSH_TEMPLATES)
    created_date = models.DateTimeField(auto_now_add=True)
    modified_date = models.DateTimeField(auto_now=True)

    manager = PushTemplateManager()
