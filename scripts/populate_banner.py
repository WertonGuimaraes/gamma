from scripts.util import create_banner_in_brazil, BANNER_NAME
from scripts import util, populate_game


def run(total_banners=500, total_games=5):
    populate_game.run(total_games)

    total = 0
    for i in range(total_banners):
        create_banner_in_brazil(banner_name=BANNER_NAME + str(i))

        total = util.update_progress(total, total_banners)
