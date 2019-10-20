from gmm_campaign.models import Location, Participation
from scripts import util
from scripts.util import generate_email, generate_string, environment_header, create_opened_campaign_in_brazil


def run(total_participants=1500):
    total = 0
    campaign, game = create_opened_campaign_in_brazil()

    for i in range(total_participants):
        location = Location(**environment_header())
        location.save()

        participation = Participation(
            email=generate_email(), gpg_id=generate_string(), location=location, campaign=campaign, game=game)
        participation.save()

        total = util.update_progress(total, total_participants)
