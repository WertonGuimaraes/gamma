from pytz import timezone
from datetime import datetime
from gmm_campaign.models import Campaign


class DataToTestEditCampaignControl(object):
    validate_data = {u'forms': [{u'game': {u'modified_date': u'2016-02-25T17:44:16Z', u'name': u'game test fail',
                                           u'package_name': u'2',
                                           u'form_template': {u'type': u'Object', u'name': u'root', u'children': [{
                                               u'type': u'Text', u'name': u'few', u'parent': u'root', u'children': []}
                                           ]}, u'game_image':
                                               u'https://gamma-test.s3.amazonaws.com/game/game_icon_1456422253430.jpg',
                                           u'game_service_id': u'2', u'id': 2,
                                           u'api_key': u'AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE'},
                                 u'form_value': {u'few': u'ewwe'}}],
                     u'begin_date': datetime(2016, 2, 24, 13, 59, tzinfo=timezone("UTC")), u'name': u'teste 3',
                     u'end_date': datetime(2016, 3, 19, 13, 59, tzinfo=timezone("UTC")),
                     u'regions': [{u'color': u'', u'id': 3, u'modified_date': None, u'name': u'Albania',
                                   u'countries': [{u'country_name': u'Albania', u'id': 3, u'country_code': u'AL'}]},
                                  {u'color': u'', u'id': 5, u'modified_date': None, u'name': u'American Samoa',
                                   u'countries': [{u'country_name': u'American Samoa', u'id': 5,
                                                   u'country_code': u'AS'}]}], u'gmt_timezone': u'America/Recife',
                     u'active': True, u'participant_limit': 30}

    instance = Campaign(**{'modified_date': datetime(2016, 3, 2, 13, 37, 4, tzinfo=timezone("UTC")),
                           'begin_date': datetime(2016, 2, 24, 13, 59, tzinfo=timezone("UTC")), 'name': u'teste 3',
                           'end_date': datetime(2016, 3, 19, 13, 59, tzinfo=timezone("UTC")),
                           'expiration_date': datetime(2016, 3, 19, 13, 59, tzinfo=timezone("UTC")),
                           'gmt_timezone': u'America/Recife', 'active': True, 'participant_limit': 30, 'id': 1L})

    form_data = [{u'game': {u'modified_date': u'2016-02-25T17:44:16Z',
                            u'name': u'game test fail',
                            u'package_name': u'2',
                            u'game_image': u'https://gamma-test.s3.amazonaws.com/game/game_icon_1456422253430.jpg',
                            u'game_service_id': u'2', u'id': 2, u'api_key': u'AIzaSyB0Tld-TleZQ6ThfsKaxHFnmhLpg5RcFiE',
                            u'form_template': {u'type': u'Object', u'name': u'root',
                                               u'children': [{u'type': u'Text', u'name': u'few',
                                                              u'parent': u'root',
                                                              u'children': []}]}},
                  u'form_value': {u'few': u'ewwe'}}]

    rule_dict = {'modified_date': datetime(2016, 3, 2, 17, 57, 20, tzinfo=timezone("UTC")), 'campaign_id': 1L,
                 'form_value': {"few": "ewwe"}, 'game_id': 2L, 'id': 266L}

    new_region = [{u'color': u'', u'id': 3, u'modified_date': None, u'name': u'Albania',
                   u'countries': [{u'country_name': u'Albania', u'id': 3, u'country_code': u'AL'}]}]

    old_region = {'color': u'', 'modified_date': None, 'id': 3L, 'name': u'Albania'}

    list_1_to_compare_dict_lists = [{'game': 2L, 'form_value': {'lol': '234'},
                                     'form_template': {'type': 'Object', 'name': 'root',
                                                       'children': [{'type': 'Text', 'name': 'lol', 'parent': 'root',
                                                                     'children': []}]}},
                                    {'game': 1L, 'form_value': {'lol2': '123'},
                                     'form_template': {'type': 'Object', 'name': 'root', 'children': [{'type': 'Text',
                                                                                                       'name': 'lol2',
                                                                                                       'parent': 'root',
                                                                                                       'children': []}]}
                                     }]

    list_2_to_compare_dict_lists = [{'game': 2, 'form_value': {u'lol': u'234'},
                                     'form_template': {u'type': u'Object', u'name': u'root',
                                                       u'children': [{u'type': u'Text', u'name': u'lol',
                                                                      u'parent': u'root', u'children': []}]}}]
