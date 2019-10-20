from django.utils import timezone

from gmm_banner.models import BannerConfiguration
from gmm_campaign.models import Campaign, Participation, Location, Rule
from gmm_game.models import Game
from gmm_push.models import DeviceUser, EnvironmentInfo

valid_gcm_id = 'ciF1ZbHwCCk:APA91bEvRxWZzPSYp6rkrPnDBzBq_K8waoBw52s1ClT3LaVovIZfDjQV1JbwXCeP5fiKXvnuyJdtLviupP4uoKL' \
                 'DUowKZAcx6doQATI_8F8Y-gvVrYR2TK6vU8t3P6YfoWgRJ4jOpONS'


def create_location(model=Location, location_country_code="BR"):
    location = model(location_country_code=location_country_code, location_status="status", location_zip="zip",
                     location_country="Brazil", location_region="region", location_region_name="region_name",
                     location_city="city", location_lat="lat", location_lon="log", location_timezone="timezone",
                     location_isp="isp", location_org="org", location_as="as", location_query="query",
                     location_source="source", location_date="2016-02-16 17:53", app_version="app_version",
                     device_language="language")
    location.save()
    return location


def create_game(name='Zenny Worldz', analytics_view_id=00000, package_name='zenny.asus.test',
                game_service_id='S3rv1c3_1D_zenny', api_key='AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE', **fields):
    game = Game(name=name, analytics_view_id=analytics_view_id, package_name=package_name, game_service_id=game_service_id,
                api_key=api_key, **fields)
    game.save()
    return game


def create_campaign(name="CampaignName", begin_date="2016-02-16 17:53", end_date="2060-02-16 17:53",
                    participant_limit=10, active=True):
    campaign = Campaign(name=name, begin_date=begin_date, end_date=end_date, participant_limit=participant_limit,
                        expiration_date=end_date, active=active)
    campaign.save()
    return campaign


def create_banner(banner_configuration_name="PromotionalBanner", begin_date=None, end_date=None, games=(), regions=(), campaigns=(),
                  active=True):
    banner = BannerConfiguration(banner_configuration_name=banner_configuration_name, begin_date=begin_date, end_date=end_date, active=active)
    banner.save()
    banner.games = games
    banner.regions = regions
    banner.campaigns = campaigns
    banner.save()
    return banner


def create_forms(campaign, game, **fields):
    rule = Rule(campaign=campaign, game=game, **fields)
    rule.save()
    return rule


def create_participation(campaign, player, country_code="BR"):
    location = create_location(location_country_code=country_code)
    participant = Participation(campaign=campaign, location=location, player=player)
    participant.save()
    return participant


def create_device_user(country_code="BR", last_date_played=None, gcm_id=valid_gcm_id, **fields):
    last_date_played = last_date_played if last_date_played else timezone.now()
    environment_info = create_location(model=EnvironmentInfo, location_country_code=country_code)
    device_user = DeviceUser(last_date_played=last_date_played, environment_info=environment_info, gcm_id=gcm_id,
                             **fields)
    device_user.save()
    return device_user
