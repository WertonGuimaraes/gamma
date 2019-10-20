from django.http.request import QueryDict
from rest_framework import serializers
from gmm_game.models import Game, PushTemplate
from gmm_util.field import Field


class PushTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = PushTemplate
        fields = (Field.PUSH_TEMPLATE,)


class GameSerializer(serializers.ModelSerializer):
    push_templates = PushTemplateSerializer(many=True)

    class Meta:
        model = Game
        fields = (Field.ID, Field.MODIFIED_DATE, Field.GAME_NAME, Field.ANALYTICS_VIEW_ID, Field.GAME_SERVICE_ID,
                  Field.PACKAGE_NAME, Field.GAME_IMAGE, Field.GAME_API_KEY, Field.FORM_TEMPLATE, Field.PUSH_TEMPLATES)

    def create(self, game_data):
        if isinstance(game_data, QueryDict):
            game_data = game_data.dict()

        return Game.manager.create(game_data)

    def update(self, game, game_data):
        if isinstance(game_data, QueryDict):
            game_data = game_data.dict()

        return Game.manager.edit(game, game_data)
