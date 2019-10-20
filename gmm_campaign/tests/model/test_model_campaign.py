from unittest import TestCase

from gmm_campaign.models import Campaign, CampaignManager
from gmm_util.field import Field
from gmm_util.util_test import JsonObjects


class CampaignTestView(TestCase):

    def test__update_expiration_date__campaign__campaign_to_update__campaign_expiration_date_updated(self):
        # Arrange
        campaign = Campaign(
            name="brazil-campaign", expiration_date="2051-09-04T19:13:40Z", active=False, regions=[
                {
                    "id": 1,
                    "name": "South America",
                    "countries": [
                        {"id": 1, "country_name": "Brazil", "country_code": "BR"},
                        {"id": 2, "country_name": "Argentina", "country_code": "AR"}
                    ],
                    "color": "#000000"
                }
            ],
            begin_date="2050-09-04T19:13:40Z", end_date="2051-09-04T19:13:40Z", participant_limit=10000,
            forms=[{'game': 1, 'form_template': "form_template", 'form_value': "form_value"}])
        # Act
        CampaignManager().update_expiration_date(campaign,  JsonObjects.campaign(end_date="2055-09-04T19:13:40Z"))
        # Assert
        self.asserEquals(campaign.expiration_date, JsonObjects.campaign()[Field.END])
