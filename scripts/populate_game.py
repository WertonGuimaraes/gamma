import json
from distutils.util import strtobool

import requests

from scripts import util
from scripts.util import CreateJson, Authentication, LIST_VALID_DATA_GAME


def generate_payload(i, create_valid_game):
    payload = CreateJson.game()
    if i < len(LIST_VALID_DATA_GAME) and strtobool(create_valid_game):
        payload.update(LIST_VALID_DATA_GAME[i])
    return payload


def run(total_games=len(LIST_VALID_DATA_GAME), arg_create_valid_game="True"):
    token = Authentication.login()

    for i in range(int(total_games)):
        payload = generate_payload(i, arg_create_valid_game)
        headers = {'content-type': 'application/json', 'Authorization': token}
        url = "http://localhost:" + util.PORT + "/gmm/game/"

        response = requests.post(url, data=json.dumps(payload), headers=headers)

        print "response game", response

