import json

import requests

from scripts import populate_game
from scripts import util
from scripts.util import LIST_VALID_DATA_GAME, Authentication, CreateJson


def generate_payload(i):
    regions = CreateJson.regions()
    games = CreateJson.games()

    return CreateJson.campaign(games, regions)


def run(total_campaigns=10):
    token = Authentication.login()
    populate_game.run(len(LIST_VALID_DATA_GAME))

    for i in range(int(total_campaigns)):
        payload = generate_payload(i)
        headers = {'content-type': 'application/json', 'Authorization': token}
        url = "http://localhost:" + util.PORT + "/gmm/campaign/"

        response = requests.post(url, data=json.dumps(payload), headers=headers)

        print response

