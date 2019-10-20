from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework.views import APIView

from gmm_banner.filters import BannerFilter
from gmm_banner.models import Banner
from gmm_banner.serializers import BannerSerializer
from gmm_campaign.filters import CampaignFilter
from gmm_campaign.models import Campaign, Rule
from gmm_campaign.models import Participation
from gmm_game.models import Game
from gmm_mobile.v1.exceptions import GameDoesNotExist, GameOrCampaignDoesNotExist, PlayerDoesNotExit, PlayerRequired, \
    PlayerAlreadyRegisteredError
from gmm_mobile.v1.serializers import \
    RegisterParticipationSerializer, OpenedCampaignMobileSerializer, EnvironmentInfoSerializer, \
    PlayerRegisterSerializer, PlayerSerializerLastPlayed
from gmm_push.models import DeviceUser
from gmm_util.field import Field
from gmm_util.header import Header
from gmm_util.permissions import MobileTokenAuthentication
from gmm_util.permissions import MobileTokenPermission
from gmm_util.response import ResponseUtils


class BannerViewMobile(APIView):
    permission_classes = (MobileTokenPermission,)
    authentication_classes = (MobileTokenAuthentication,)

    def get(self, request, service_id=None):
        try:
            get_object_or_404(Game.manager.all(), game_service_id=service_id)

            environment_info = Header.get_environment_info(request)
            location_serializer = EnvironmentInfoSerializer(data=environment_info)
            location_serializer.is_valid(raise_exception=True)
            location = location_serializer.data

            data = request.data.copy()
            data[Field.BANNER_CONFIGURATION_GAMES_GAME_SERVICE_ID] = service_id
            data[Field.BANNER_CONFIGURATION_ACTIVE] = True
            data[Field.COUNTRY_CODE] = location[Field.LOCATION_COUNTRY_CODE]
            data[Field.LANGUAGE] = location[Field.APP_LANGUAGE]
            data[Field.IS_BANNER_EXISTS] = timezone.now()

            filterset = BannerFilter(data, queryset=Banner.manager.all())
            serializer = BannerSerializer(filterset, many=True)
            return ResponseUtils.ok(serializer.data)
        except Http404:
            raise GameDoesNotExist()
        except ValueError:
            return ResponseUtils.bad_request()


class ParticipantViewMobile(APIView):
    permission_classes = (MobileTokenPermission, )
    authentication_classes = (MobileTokenAuthentication, )

    def post(self, request, service_id, campaign_id):
        environment_info = Header.get_environment_info(request)
        environment_info_serializer = EnvironmentInfoSerializer(data=environment_info)
        environment_info_serializer.is_valid(raise_exception=True)

        try:
            get_object_or_404(Rule.manager.all(), campaign=campaign_id,
                              game__game_service_id=service_id)
        except Http404:
            raise GameOrCampaignDoesNotExist()

        try:
            if request.data[Field.PLAYER]:
                player = get_object_or_404(DeviceUser.manager.all(), gpg_id=request.data[Field.PLAYER][Field.GPG_ID],
                                           email=request.data[Field.PLAYER][Field.EMAIL],
                                           gcm_id=request.data[Field.PLAYER][Field.GCM_ID],
                                           game__game_service_id=service_id)
        except Http404:
            raise PlayerDoesNotExit()
        except KeyError:
            raise PlayerRequired()

        request.data[Field.PLAYER] = player.id
        request.data[Field.GAME_SERVICE_ID] = service_id
        request.data[Field.CAMPAIGN] = campaign_id
        request.data[Field.LOCATION] = environment_info

        try:
            participation_serializer = RegisterParticipationSerializer(data=request.data)
            participation_serializer.is_valid(raise_exception=True)
            participation_serializer.save()

            return ResponseUtils.created()
        except Http404:
            raise GameOrCampaignDoesNotExist()


class OpenedCampaignsViewMobile(APIView):
    permission_classes = (MobileTokenPermission, )
    authentication_classes = (MobileTokenAuthentication, )

    def get(self, request, service_id=None):
        try:
            get_object_or_404(Game.manager.all(), game_service_id=service_id)
        except Http404:
            raise GameDoesNotExist()

        environment_info = Header.get_environment_info(request)
        location_serializer = EnvironmentInfoSerializer(data=environment_info)
        location_serializer.is_valid(raise_exception=True)
        location = location_serializer.data

        data = request.data.copy()
        data[Field.FORMS__GAME__GAME_SERVICE_ID] = service_id
        data[Field.OPENED] = True
        data[Field.COUNTRY_CODE] = location[Field.LOCATION_COUNTRY_CODE]

        filterset = CampaignFilter(data, queryset=Campaign.manager.all())
        serializer = OpenedCampaignMobileSerializer(filterset, many=True)

        return ResponseUtils.ok(serializer.data)


class ConsultParticipantMobile(APIView):
    permission_classes = (MobileTokenPermission, )
    authentication_classes = (MobileTokenAuthentication, )

    def get(self, request, campaign_id, service_id, email):
        try:
            environment_info = Header.get_environment_info(request)
            location_serializer = EnvironmentInfoSerializer(data=environment_info)
            location_serializer.is_valid(raise_exception=True)
            country_code = environment_info[Field.LOCATION_COUNTRY_CODE]

            json = Participation.manager.verify_participant_resgistered_in_campaign_by_id(
                email, campaign_id, service_id, country_code)

            return ResponseUtils.ok(json)
        except (Game.DoesNotExist, Campaign.DoesNotExist):
            raise GameOrCampaignDoesNotExist()


class PlayerViewMobile(APIView):
    permission_classes = (MobileTokenPermission, )
    authentication_classes = (MobileTokenAuthentication, )

    def post(self, request, game_service_id):
        try:
            environment_info = Header.get_environment_info(request)
            environment_info_serializer = EnvironmentInfoSerializer(data=environment_info)
            environment_info_serializer.is_valid(raise_exception=True)

            serializer = PlayerRegisterSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            game = Game.manager.get(game_service_id=game_service_id)

            is_new_player = serializer.create_or_update(request.data, environment_info, game)

            if is_new_player:
                return ResponseUtils.created_with_body(serializer.data)
            return ResponseUtils().ok(serializer.data)

        except Game.DoesNotExist:
            raise GameDoesNotExist()
        except PlayerAlreadyRegisteredError:
            device_user = DeviceUser.manager.get(game=game, **request.data)
            device_user.last_date_played = request.data.pop(Field.LAST_DATE_PLAYED, timezone.now())
            device_user.save()
            raise PlayerAlreadyRegisteredError()
        except ValueError:
            return ResponseUtils.bad_request_with_errors(serializer.errors)

    def patch(self, request, game_service_id):
        game = get_object_or_404(Game.manager.all(), game_service_id=game_service_id)
        request.data[Field.GAME] = game.pk
        serializer = PlayerSerializerLastPlayed(data=request.data)
        serializer.is_valid(raise_exception=True)
        PlayerSerializerLastPlayed().update(validated_data=request.data)

        return ResponseUtils.created()
