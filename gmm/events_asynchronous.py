import os
import threading
from ConfigParser import RawConfigParser
from datetime import timedelta

from django.utils import timezone

from gmm_push_notification.models import Push
from gmm_settings.models import Settings
from gmm_util.constants import Constants
from gmm_util.field import Field


class AsyncAlertsStartedCampaign(object):
    empty_push_data = ['{}', {}]

    def get_query_to_campaign_push(self, push):
        campaign = push.rule.campaign
        game = push.rule.game
        regions = ",".join(campaign.countries_codes)
        return {Field.GAMES: str(game.id), Field.REGIONS: regions}

    def _push_valid_to_send(self, push, current_time):
        in_time = self.verify_time(push, current_time)
        return push.can_send_push and in_time and push.data not in self.empty_push_data

    @staticmethod
    def _send_push(push):
        devices_users = Push.manager.get_devices(push.query)
        Push.manager.send_push(push, devices_users)

    @staticmethod
    def verify_time(push, current_time):
        begin_time = push.push_begin_date if push.push_begin_date else (current_time + timedelta(seconds=-60))
        end_time = push.push_end_date if push.push_end_date else (current_time + timedelta(seconds=60))
        return begin_time <= current_time < end_time

    def _update_query_in_push(self, push):
        query = self.get_query_to_campaign_push(push)
        push.__dict__.update(query=query)
        push.save()

    def _get_push_and_send(self, current_time):
        pushes = Push.manager.filter(can_send_push=True)
        for push in pushes:
            if self._push_valid_to_send(push, current_time):
                if not push.rule:
                    self._send_push(push)
                else:
                    if push.rule.campaign.status == Constants.STATUS_STARTED:
                        self._update_query_in_push(push)
                        self._send_push(push)

    def alerts_started_campaign(self):
        time_frame = Settings.manager.first().update_time_push
        current_time = timezone.now()

        self._get_push_and_send(current_time)
        threading.Timer(time_frame, self.alerts_started_campaign).start()
