import ast
import json
import os
import random
import string
from datetime import timedelta, datetime

import requests

from gmm_banner.models import Banner, BannerConfiguration
from gmm_game.models import Game
from gmm_game.serializers import GameSerializer
from gmm_region.models import Country, Region
from gmm_region.serializer import RegionSerializer
from gmm_util.constants import Constants
from gmm_util.field import Field
from scripts import create_user

TOKEN = Field.TOKEN
PORT = '8000'
NAME_GAME = "CampaignCreated"
SERVICE_ID_NAME = "ServiceIdCreated"
CAMPAIGN_NAME = "CampaignCreated"
BANNER_NAME = "BannerCreated"
FORM_VALUE = '{"score": {"100": "test"}}'

FORM_TEMPLATE = '''
{
    "selected": {
        "type": "container",
        "id": "score",
        "columns": [[{
                "type": "item",
                "id": "100",
                "name": "attribute",
                "tooltip": "Value that can be linked with a feature."}]],
        "name": "feature",
        "tooltip": "Container should contain other features and attributes.",
        "desc": "Total score to participate in the campaign "
    },
    "templates": [{
        "type": "container",
        "id": 5,
        "columns": [[]],
        "name": "feature",
        "tooltip": "Container should contain other features and attributes.",
        "desc": ""
    }, {
        "type": "item",
        "id": 4,
        "name": "attribute",
        "tooltip": "Value that can be linked with a feature."
    }],
    "dropzones": {
        "root": [{
            "type": "container",
            "id": "score",
            "columns": [[{
                    "type": "item",
                    "id": "100",
                    "name": "attribute",
                    "tooltip": "Value that can be linked with a feature."
                }]],
            "name": "feature",
            "tooltip": "Container should contain other features and attributes.",
            "desc": "Total score to participate in the campaign "
        }]
    }
}'''.replace("\n", "")

URL = "https://imgnzn-a.akamaized.net/2015/08/20/20182943235768.jpg"

LIST_VALID_DATA_GAME = [{Field.NAME: "Zenny",
                         Field.PACKAGE_NAME: "br.com.asus.test.zenny",
                         Field.GAME_SERVICE_ID: "service_id_zenny",
                         Field.GAME_API_KEY: "AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE",
                         Field.GAME_IMAGE: "https://imgnzn-a.akamaized.net/2015/08/20/20182943235768.jpg",
                         Field.FORM_TEMPLATE: FORM_TEMPLATE}
                        ]


def update_progress(total_atual, grand_total):
    total_atual += 1

    os.system(['clear', 'cls'][os.name == 'nt'])
    print "%5.2f%%" % ((total_atual / float(grand_total)) * 100)

    return total_atual


def environment_header():
    return {'location_status': 'success',
            'location_as': '3',
            'location_region_name': 'Paraiba',
            'location_city': 'Campina Grande',
            'location_country': 'Brazil',
            'location_region': 'PB',
            'location_isp': 'Wikimedia Foundation',
            'location_lon': '-35.908247',
            'location_source': 'location_source',
            'location_query': '208.80.152.201',
            'location_date': '2050-09-04T19:13:40Z',
            'location_country_code': 'BR',
            'location_timezone': 'Brasilia',
            'location_lat': '-7.212775',
            'location_org': 'Wikimedia Foundation',
            'app_version': 'app_version',
            'device_language': 'portuguese',
            'location_zip': '58700-000'}


def generate_string():
    name = ""
    for i in range(random.randint(3, 10)):
        name += string.ascii_letters[
            random.randint(0, len(string.ascii_letters) - 1)]
    return name


def generate_url():
    return "http://" + generate_string() + ".com"


def generate_email():
    email = generate_string()
    end_email = ['@gmail.com', '@yahoo.com', '@msn.com.br', '@hotmail.com', "@embedded.ufcg.edu.br", "@ccc.ufcg.edu.br"]
    email += end_email[random.randint(0, len(end_email) - 1)]
    return email


def generate_color():
    return "#%06x" % random.randint(0, 0xFFFFFF)


class Authentication(object):
    @staticmethod
    def login():
        create_user.run()

        data = {"username": "admin", "password": "abc123"}
        headers = {'content-type': 'application/json'}
        url = "http://localhost:" + PORT + "/gmm/login/"

        response = requests.post(url, data=json.dumps(data), headers=headers)
        return "JWT " + ast.literal_eval(response.text)["token"]


class CreateJson(object):
    @staticmethod
    def game():
        return {Field.NAME: generate_string(),
                Field.ANALYTICS_VIEW_ID: "123456789",
                Field.PACKAGE_NAME: generate_string(),
                Field.GAME_SERVICE_ID: generate_string(),
                Field.GAME_IMAGE: generate_url(),
                Field.GAME_API_KEY: generate_string(),
                Field.FORM_TEMPLATE: FORM_TEMPLATE,
                Field.PUSH_TEMPLATES: []}

    @staticmethod
    def games():
        total_games = random.randint(1, len(LIST_VALID_DATA_GAME))
        games_list = []
        list_valid_games_aux = LIST_VALID_DATA_GAME[:]
        for i in range(total_games):
            random_game_service_id = random.choice(list_valid_games_aux)[Field.GAME_SERVICE_ID]
            game = Game.manager.get(game_service_id=random_game_service_id)
            game = GameSerializer(game).data
            games_list.append(game)
        return games_list

    @staticmethod
    def campaign(games, regions):
        campaign_data = {
            Field.NAME: generate_string(),
            Field.PARTICIPANT_LIMIT: random.randint(1, 100),
            Field.REGIONS: regions,
            Field.GMT_TIMEZONE: "America/Recife",
            Field.GAMES: games,
            Field.FORMS: [{
                Field.GAME: random.choice(games),
                Field.FORM_VALUE: FORM_VALUE
            }]
        }

        campaign_data.update(CreateJson.generate_status())
        return campaign_data

    @staticmethod
    def generate_status():
        status = random.choice([Constants.STATUS_FINISHED, Constants.STATUS_ABOUT_TO_START, Constants.STATUS_STARTED])
        current_time = datetime.now()
        timedelta_begin_date = random.randint(-12, -2)
        timedelta_end_date = random.randint(2, 12)
        timedelta_last_activated = timedelta(hours=random.randint(timedelta_begin_date, 0))

        if status == Constants.STATUS_ABOUT_TO_START:
            timedelta_begin_date = random.randint(1, 5)
            timedelta_end_date = random.randint(timedelta_begin_date + 1, 24)
            timedelta_last_activated = timedelta(hours=random.randint(timedelta_begin_date + 1, timedelta_end_date - 1))
        elif status == Constants.STATUS_FINISHED:
            timedelta_begin_date = random.randint(-24, -2)
            timedelta_end_date = random.randint(timedelta_begin_date + 2, 0)
            timedelta_last_activated = timedelta(hours=random.randint(timedelta_begin_date + 1, timedelta_end_date - 1))

        return {
            Field.ACTIVE: random.choice([False, True, True]),
            Field.END: (current_time + timedelta(hours=timedelta_end_date)).strftime('%Y-%m-%dT%H:%M:%SZ'),
            Field.BEGIN: (current_time + timedelta(hours=timedelta_begin_date)).strftime('%Y-%m-%dT%H:%M:%SZ'),
            Field.LAST_ENABLED_TIME: (current_time + timedelta_last_activated).strftime('%Y-%m-%dT%H:%M:%SZ')
        }

    @staticmethod
    def regions():
        regions_data = []
        regions_names = ["Brazil", "Argentina", "United States"]
        total_elements = random.randint(1, len(regions_names))

        for i in range(total_elements):
            region_name = regions_names.pop(random.randrange(len(regions_names)))
            region = Region.manager.get(name=region_name)
            region_data = RegionSerializer(region).data
            regions_data.append(region_data)
        return regions_data


def create_region(name="RegionCreated"):
    try:
        region = Region.manager.get(name=name)
    except Region.DoesNotExist:
        region = Region(name=name, color=generate_color())
        region.save()
    return region


def create_game(api_key="api_key", game_name="CampaignCreated", service_id="GameCreated",
                game_image=URL):
    try:
        game = Game.manager.get(game_service_id=service_id)
    except Game.DoesNotExist:
        game = Game(name=game_name, package_name=generate_string(), game_service_id=service_id,
                    game_image="https://imgnzn-a.akamaized.net/2015/08/20/20182943235768.jpg", api_key=api_key)
        game.save()
    return game


def create_opened_campaign_in_brazil(game_name="GameCreated", service_id="123a"):
    country_br = Country.manager.get(country_code="BR", country_name="Brazil")
    region = create_region()
    region.countries.add(country_br)

    game = create_game(game_name=game_name, service_id=service_id)

    return game


def create_banner_in_brazil(banner_name="BannerCreated", game_name="GameCreated", service_id="123a"):
    country_br = Country.manager.get(country_code="BR", country_name="Brazil")
    region = create_region()
    region.countries.add(country_br)

    game = create_game(game_name=game_name, service_id=service_id)

    banner_configuration = BannerConfiguration(name=banner_name)
    banner_configuration.save()
    banner_configuration.regions.add(region)
    banner_configuration.games.add(game)

    banner = Banner(image_url=URL, target_url=URL, banner_configuration=banner_configuration)
    banner.save()

    return banner_configuration, banner
