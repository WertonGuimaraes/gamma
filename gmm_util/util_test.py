from rest_framework_jwt import utils
from gmm_util.field import Field

BANNERS = [["default name", "http://www.image1.com", "http://www.target1.com", "PT"], ["dafault name", "http://www.image2.com",
                                                                       "http://www.targe2.com", "PT"]]

COUNTRIES = [["Argentina", "AR"], ["United States", "US"]]

PUSH_TEMPLATES = []

FORM_TEMPLATE = """
{
    "selected": {
        "type": "container",
        "id": "lol",
        "columns": [
            [{
                "type": "item",
                "id": "va",
                "name": "attribute"
            }]
        ],
        "name": "feature"
    },
    "templates": [{
        "type": "item",
        "id": 3,
        "name": "attribute"
    }, {
        "type": "container",
        "id": 2,
        "columns": [
            []
        ],
        "name": "feature"
    }],
    "dropzones": {
        "root": [{
            "type": "container",
            "id": "lol",
            "columns": [
                [{
                    "type": "item",
                    "id": "va",
                    "name": "attribute"
                }]
            ],
            "name": "feature"
        }]
    }
}
"""

FORM_PUSH_VALUES = []

GAMES = [
    {
        "id": 1,
        "name": "zennyworldz",
        "analytics_view_id": 00000,
        "package_name": "br.com.asus.app.zennyworldz",
        "game_service_id": 1,
        "game_image": "https://gamma-test.s3.amazonaws.com/game/game_icon_1460643319494.jpg",
        "api_key": "lr4cE2jGYJj46H8Gw0esY6k8Ll98Ej6D",
        "form_template": FORM_TEMPLATE,
        "push_templates": PUSH_TEMPLATES
    }
]

FORMS = [
    {
        "game": GAMES[0],
        "form_value": "form_value",
        "form_push_values": FORM_PUSH_VALUES
    }
]

REGIONS = [
    {
        "id": 1,
        "name": "South America",
        "countries": [
            {"id": 1, "country_name": "Brazil", "country_code": "BR"},
            {"id": 2, "country_name": "Argentina", "country_code": "AR"}
        ],
        "color": "#000000"
    }
]

CAMPAIGNS = [
    {
        "forms":["lol"],
        "modified_date": "2016-03-22T13:59:54Z",
        "expiration_date": "2016-03-22T21:23:00Z",
        "id": 1,
        "name": "Campaign Test",
        "active": False,
        "begin_date": "2016-03-21T21:23:00Z",
        "end_date": "2016-03-22T21:23:00Z",
        "participant_limit": 123,
        "regions": [
            {
                "id": 32,
                "name": "Brazil",
                "color": "",
                "countries": [
                    {
                        "country_name": "Brazil",
                        "country_code": "BR",
                        "id": 32
                    }
                ],
                "modified_date": ''
            }
        ],
        "opened": False,
        "total_registered_participants": 0,
        "gmt_timezone": "America/Recife",
    }]

PLAYER = {
    "email": "ccjoao@gmail.com",
    "gpg_id": "1236",
    "gcm_id": "1236",
    "environment_info": {
        "location_status": "success",
        "location_country": "Brazil",
        "location_country_code": "BR",
        "location_region": "PB",
        "location_region_name": "Paraiba",
        "location_city": "Campina Grande",
        "location_zip": "58700-000",
        "location_lat": "-7.212775",
        "location_lon": "-35.908247",
        "location_timezone": "Brasilia",
        "location_isp": "Wikimedia Foundation",
        "location_org": "Wikimedia Foundation",
        "location_as": "3",
        "location_query": "208.80.152.201",
        "device_language": "portuguese",
        "location_source": "location_source",
        "location_date": "2050-09-04T19:13:40Z",
        "app_version": "app_version"
    },
    "game": {
        "id": 1,
        "modified_date": "2016-04-14T14:15:21Z",
        "name": "Game",
        "analytics_view_id": "0123456789",
        "package_name": "1",
        "game_service_id": "1",
        "game_image": "https://gamma-test.s3.amazonaws.com/game/game_icon_1460643319494.jpg",
        "api_key": "1",
        "form_template": "{\"selected\":{\"type\":\"container\",\"id\":\"lol\",\"columns\":[[{\"type\":\"item\",\"id\":\"va\",\"name\":\"attribute\"}]],\"name\":\"feature\"},\"templates\":[{\"type\":\"item\",\"id\":3,\"name\":\"attribute\"},{\"type\":\"container\",\"id\":2,\"columns\":[[]],\"name\":\"feature\"}],\"dropzones\":{\"root\":[{\"type\":\"container\",\"id\":\"lol\",\"columns\":[[{\"type\":\"item\",\"id\":\"va\",\"name\":\"attribute\"}]],\"name\":\"feature\"}]}}",
        "push_templates": []
    },
    "date": "2016-04-14T14:16:57Z"
}


def _create_country_field(countries):
    if countries:
        return [{Field.COUNTRY_NAME: country[0], Field.COUNTRY_CODE: country[1]} for country in countries]
    return countries


def _create_banner_field(banner_urls):
    if banner_urls:
        return [{Field.NAME: banner[0], Field.IMAGE_URL: banner[1], Field.TARGET_URL: banner[2]} for banner in banner_urls]
    return banner_urls


def remove_field(key, json):
    copy_dictionary = json.copy()
    copy_dictionary.pop(key)
    return copy_dictionary


def create_user(email, gpg_id, gcm_id):
    return {
        Field.EMAIL: email,
        Field.GPG_ID: gpg_id,
        Field.GCM_ID: gcm_id,
    }


class JsonObjects(object):
    @staticmethod
    def campaign(name="brazil-campaign", expiration_date="2051-09-04T19:13:40Z", active=False, participant_limit=100000,
                 forms=FORMS, begin_date="2050-09-04T19:13:40Z", end_date="2051-09-04T19:13:40Z", regions=REGIONS):
        return {
            Field.CAMPAIGN_NAME: name,
            Field.EXPIRATION_DATE: expiration_date,
            Field.ACTIVE: active,
            Field.PARTICIPANT_LIMIT: participant_limit,
            Field.FORMS: forms,
            Field.BEGIN: begin_date,
            Field.END: end_date,
            Field.REGIONS: regions

        }

    @staticmethod
    def environment_info_1():
        return {
            Field.LOCATION_STATUS: "success",
            Field.LOCATION_COUNTRY: "United States",
            Field.LOCATION_COUNTRY_CODE: "US",
            Field.APP_LANGUAGE: "PT",
            Field.LOCATION_REGION: "CA",
            Field.LOCATION_REGION_NAME: "California",
            Field.LOCATION_CITY: "San Francisco",
            Field.ZIP_CODE: "94105",
            Field.LAT: "37.7898",
            Field.LON: "-122.3942",
            Field.TIMEZONE: "America/Los_Angeles",
            Field.ISP: "Wikimedia Foundation",
            Field.ORG: "Wikimedia Foundation",
            Field.AS_NUMBER: "AS14907 Wikimedia US network",
            Field.LOCATION_QUERY: "208.80.152.201",
            Field.LOCATION_SOURCE: "source",
            Field.LOCATION_DATE: "2016-03-02T09:14:00Z",
            Field.APP_VERSION: "version_alpha",
            Field.DEVICE_LANGUAGE: "English"
        }

    @staticmethod
    def game(name="zennyworld", package_name="br.com.asus.app.zennyworld", game_service_id=1, form_template="template",
             game_image="http://www.com.br", api_key="lr4cE2jGYJj46H8Gw0esY6k8Ll98Ej6D", push_templates=PUSH_TEMPLATES,
             analytics_view_id="123456789"):
        return {
            Field.GAME_NAME: name,
            Field.PACKAGE_NAME: package_name,
            Field.GAME_SERVICE_ID: game_service_id,
            Field.FORM_TEMPLATE: form_template,
            Field.GAME_IMAGE: game_image,
            Field.GAME_API_KEY: api_key,
            Field.PUSH_TEMPLATES: push_templates,
            Field.ANALYTICS_VIEW_ID: analytics_view_id
        }

    @staticmethod
    def user():
        return {"username": "admin", "password": "abc123"}

    @staticmethod
    def banner(banner_configuration_name="Name Banner", regions=REGIONS, games=GAMES, banners_urls=BANNERS, campaigns=CAMPAIGNS,
               begin_date="2050-09-04T19:13:40Z", end_date="2051-09-04T19:13:40Z", gmt_timezone="America/Recife"):
        return {
            Field.BANNER_CONFIGURATION_NAME: banner_configuration_name,
            Field.BANNERS: _create_banner_field(banners_urls),
            Field.REGIONS: regions,
            Field.GAMES: games,
            Field.CAMPAIGNS: campaigns,
            Field.BEGIN: begin_date,
            Field.END: end_date,
            Field.GMT_TIMEZONE: gmt_timezone
        }

    @staticmethod
    def region(name="South America", countries=COUNTRIES, color="#000000"):
        return {
            Field.NAME: name,
            Field.COLOR: color,
            Field.COUNTRIES: _create_country_field(countries)
        }

    @staticmethod
    def image(image, folder):
        return {
            Field.FOLDER: folder,
            Field.IMAGE: image
        }

    @staticmethod
    def mobile_user(email="xpto@gmail.com", gpg_id="gpg_1D", gcm_id="gcm_1D"):
        return {
            Field.EMAIL: email,
            Field.GPG_ID: gpg_id,
            Field.GCM_ID: gcm_id,
        }

    @staticmethod
    def participant_without_location(player=1, location=None):
        return {
            Field.PLAYER: player,
            Field.LOCATION: location
        }


class AuthenticationUtil(object):
    JWT = "JWT"

    @staticmethod
    def login(user):
        payload = utils.jwt_payload_handler(user)
        token = utils.jwt_encode_handler(payload)
        return '{0} {1}'.format(AuthenticationUtil.JWT, token)
