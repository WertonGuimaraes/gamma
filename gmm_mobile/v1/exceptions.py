from rest_framework import status
from rest_framework.exceptions import APIException


class FieldError(object):
    GAME_DOES_NOT_EXIST = "Game not found."
    GAME_OR_CAMPAIGN_DOES_NOT_EXIST = "Game or Campaign not found."
    LOCATION_WAS_NOT_PROVIDED = "Location not provided."
    LOCATION_WITH_SYNTAX_ERROR = "The Location contains syntax error."
    PLAYER_ALREADY_REGISTERED = "Player already registered."
    INVALID_COUNTRY_CODE = "Invalid country code."
    INVALID_APP_LANGUAGE = "Invalid app language."
    PLAYER_DOES_NOT_EXIST = "Player not found."



class GameDoesNotExist(APIException):
    def __init__(self):
        super(GameDoesNotExist, self).__init__(FieldError.GAME_DOES_NOT_EXIST)
        self.status_code = status.HTTP_404_NOT_FOUND


class PlayerDoesNotExit(APIException):
    def __init__(self):
        super(PlayerDoesNotExit, self).__init__(FieldError.PLAYER_DOES_NOT_EXIST)
        self.status_code = status.HTTP_404_NOT_FOUND


class PlayerRequired(APIException):
    def __init__(self):
        super(PlayerRequired, self).__init__("Player is required")
        self.status_code = status.HTTP_400_BAD_REQUEST


class NoPlayersOrParticipants(APIException):
    def __init__(self):
        super(NoPlayersOrParticipants, self).__init__("None players was found")
        self.status_code = status.HTTP_404_NOT_FOUND


class GameOrCampaignDoesNotExist(APIException):
    def __init__(self):
        super(GameOrCampaignDoesNotExist, self).__init__(FieldError.GAME_OR_CAMPAIGN_DOES_NOT_EXIST)
        self.status_code = status.HTTP_404_NOT_FOUND


class HeaderInvalidEnvironment(APIException):
    def __init__(self):
        super(HeaderInvalidEnvironment, self).__init__(FieldError.LOCATION_WAS_NOT_PROVIDED)
        self.status_code = status.HTTP_400_BAD_REQUEST


class HeaderSyntaxErrorEnvironment(APIException):
    def __init__(self):
        super(HeaderSyntaxErrorEnvironment, self).__init__(FieldError.LOCATION_WITH_SYNTAX_ERROR)
        self.status_code = status.HTTP_400_BAD_REQUEST


class InvalidCountryCodeError(APIException):
    def __init__(self):
        super(InvalidCountryCodeError, self).__init__(FieldError.INVALID_COUNTRY_CODE)
        self.status_code = status.HTTP_400_BAD_REQUEST


class PlayerAlreadyRegisteredError(APIException):
    def __init__(self):
        super(PlayerAlreadyRegisteredError, self).__init__(FieldError.PLAYER_ALREADY_REGISTERED)
        self.status_code = status.HTTP_409_CONFLICT


class InvalidAppLanguageError(APIException):
    def __init__(self):
        super(InvalidAppLanguageError, self).__init__(FieldError.INVALID_APP_LANGUAGE)
        self.status_code = status.HTTP_400_BAD_REQUEST
