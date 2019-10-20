from audit_log.models.managers import AuditLog
from django.db import models
from django.db import transaction
from django.http import QueryDict

from gmm_campaign.exceptions import GcmJsonError
from gmm_campaign.filters import ParticipationFilter
from gmm_campaign.models import Participation, Rule
from gmm_game.models import Game
from gmm_mobile.v1.exceptions import NoPlayersOrParticipants
from gmm_push.filters import DeviceUserFilter
from gmm_push.models import DeviceUser
from gmm_util.constants import Constants
from gmm_util.field import Field
from gmm_util.push_notification import send_push
import ast


class PushManager(models.Manager):
    @transaction.atomic
    def create(self, data, query, info_schedule):
        push = super(PushManager, self).create(data=data, query=query, **info_schedule)
        if not push.is_schedule_push:
            devices_users = self.get_devices(query)
            self.send_push(push, devices_users)

        return push

    def send_push(self, push, devices_users):
        api_key_dict = self.extract_api_key_from_devices(devices_users)
        response_push = None
        try:
            data = ast.literal_eval(push.data) if isinstance(push.data, (str, unicode)) else push.data
            response_push = send_push(api_key_dict, self._update_data_to_send(data))
        except ValueError:
            raise GcmJsonError(Constants.GCM_DATA_ERROR)

        if response_push[Field.ERRORS]:
            push.status_error = True
            push.save()

        self.save_push_details(devices_users, response_push, push, PushDetails)

        push.success_count = len(response_push[Field.SUCCESS])
        push.can_send_push = False
        push.save()

    def get_devices(self, query):
        query = self.dict_to_querydict(query)

        _model = DeviceUser
        _model_filter = DeviceUserFilter
        if Field.CAMPAIGNS in query:
            _model = Participation
            _model_filter = ParticipationFilter

        return _model_filter(_model_filter.create_query_for_all_fields(query), queryset=_model.manager.all())

    def extract_api_key_from_devices(self, devices):
        api_key = None
        try:
            device_instance = devices[0]
            if devices:
                api_key = device_instance.extract_api_key_from_devices(devices)
            else:
                raise NoPlayersOrParticipants
        except IndexError:
            api_key = []
        return api_key

    def save_push_details(self, devices_users, response_push, push, push_details_instance):
        push_details = None
        try:
            device_instance = devices_users[0]
            push_details = device_instance.save_push_details(devices_users, response_push, push, push_details_instance)
        except IndexError:
            push_details = []

        return push_details

    def dict_to_querydict(self, query):
        if isinstance(query, dict):
            querydict = QueryDict('', mutable=True)
            query_value = ast.literal_eval(query) if isinstance(query, (str, unicode)) else query
            querydict.update(query_value)
            return querydict
        return query

    def _update_data_to_send(self, data):
        if Constants.MESSAGE not in data:
            return {Constants.MESSAGE: data}
        return data

    def create_push_rule(self, rule, forms_push_rule):
        for form_push_data in forms_push_rule:
            form = Push(rule=rule, **form_push_data)
            form.save()

    def edit_push_rule(self, rule, forms_push_rule):
        self.delete_all_pushes_rules(rule)
        self.create_push_rule(rule, forms_push_rule)

    def delete_all_pushes_rules(self, rule):
        rule.form_push_values.all().delete()


class Push(models.Model):
    date = models.DateTimeField(auto_now_add=True)
    data = models.CharField(max_length=254)
    query = models.CharField(max_length=254)
    modified_date = models.DateTimeField(auto_now=True, null=True)
    status_error = models.BooleanField(default=False)
    success_count = models.IntegerField(null=True)
    push_begin_date = models.DateTimeField(null=True)
    push_end_date = models.DateTimeField(null=True)
    push_timezone = models.CharField(max_length=254, null=True)
    can_send_push = models.BooleanField(default=True)
    form_push_template = models.TextField()
    rule = models.ForeignKey(Rule, null=True, related_name=Field.FORM_PUSH_VALUES)

    def _is_schedule_push(self):
        return self.push_begin_date is not None or self.push_end_date is not None
    is_schedule_push = property(_is_schedule_push)

    audit_log = AuditLog()
    manager = PushManager()


class PushesListManager(models.Manager):
    @transaction.atomic
    def create(self, pushes_data):
        for push_data in pushes_data['pushes']:
            push_data = dict(push_data)
            data = push_data.pop(Field.DATA)
            query = push_data.pop(Field.QUERY)
            info_schedule = push_data

            Push.manager.create(data=data, query=query, info_schedule=info_schedule)
        return pushes_data


class PushesList(models.Model):
    pushes = models.ForeignKey(Push, null=False, related_name=Field.PUSHES)

    manager = PushesListManager()


class PushDetails(models.Model):
    push = models.ForeignKey(Push)
    game = models.ForeignKey(Game)
    email = models.EmailField()
    gcm_id = models.CharField(max_length=254)
    gpg_id = models.CharField(max_length=254)
    status = models.BooleanField(default=False)
    date = models.DateTimeField(auto_now_add=True)

    manager = models.Manager()

    class Meta:
        permissions = (('view_push', 'Can view push'),)
