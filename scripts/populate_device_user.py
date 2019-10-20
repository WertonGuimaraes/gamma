import random

from gmm_game.models import Game
from gmm_push.models import DeviceUser, EnvironmentInfo
from scripts import populate_game
from scripts.util import generate_email, generate_string, environment_header, update_progress, SERVICE_ID_NAME


def run(device_users=500, total_games=5):
    total = 0
    populate_game.run(total_games)

    for i in range(device_users):
        game = Game.manager.get(game_service_id=SERVICE_ID_NAME + str(random.randint(0, total_games - 1)))

        environment_info = EnvironmentInfo(**environment_header())
        environment_info.save()

        device_user = DeviceUser(email=generate_email(), gpg_id=generate_string(), gcm_id=generate_string(),
                                 environment_info=environment_info, game_id=game)
        device_user.save()

        total = update_progress(total, device_users)
