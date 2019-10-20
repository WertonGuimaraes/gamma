from gmm_push.environment_configuration import EnvironmentConfiguration


class Field(object):

    GROUPS__NAME = 'groups__name'
    LAST_NAME = 'last_name'
    FIRST_NAME = 'first_name'
    PERMISSIONS = 'permissions'
    GROUPS = 'groups'
    USER_PERMISSIONS = 'user_permissions'
    CODENAME = 'codename'
    IS_SUPERUSER = 'is_superuser'
    IS_ACTIVE = 'is_active'

    REGISTERED_AT = 'registered_at'
    UPDATE_ANALYTICS_CLIENT_ID = 'update_analytics_client_id'
    UPDATE_TIME_PARTICIPANT_NUMBER = 'update_time_participant_number'
    UPDATE_TIME_PUSH = "update_time_push"
    LAST_ENABLED_TIME = "last_enabled_time"
    PARTIAL_ENABLED_TIME = "partial_enabled_time"

    BANNER_CONFIGURATION_NAME = 'banner_configuration_name'
    BANNER_CONFIGURATION_ACTIVE = 'bannerconfiguration__active'
    BANNER_CONFIGURATION_GAMES_GAME_SERVICE_ID = 'bannerconfiguration__games__game_service_id'
    CAN_SEND_PUSH = "can_send_push"
    PUSH_TIMEZONE = "push_timezone"
    PUSH_END_DATE = "push_end_date"
    PUSH_BEGIN_DATE = "push_begin_date"
    PUSHES = "pushes"
    INCLUDE_PUSHES_NOT_SENT = "include_pushes_not_sent"
    PLAYER__LAST_DATE_PLAYED = 'player__last_date_played'
    IS_EXPIRED = 'is_expired'
    IS_USING_CAMPAIGN_DATE = 'is_using_campaign_date'
    IS_BANNER_EXISTS = 'is_banner_exists'
    LANGUAGE = 'language'
    ENGLISH = 'EN'
    ALL_LANGUAGES = 'ALL'

    LAST_DATE_PLAYED = 'last_date_played'
    GAME_ID = 'game_id'
    ID = 'id'
    EXPIRATION_DATE = "expiration_date"
    ERRORS = 'errors'
    SUCCESS = 'success'
    STATUS = 'status'
    STATUS_ERROR = 'status_error'
    SUCCESS_COUNT = 'success_count'
    PUSH = 'push'
    DATA = 'data'
    PLAYER = 'player'

    PLAYER__GAME__NAME = 'player__game__name'
    PLAYER__EMAIL = 'player__email'
    PLAYER__GPG_ID = 'player__gpg_id'
    GPG_ID = 'gpg_id'
    GCM_ID = 'gcm_id'
    EMAIL = 'email'
    LOCATION = 'location'
    DEVICE_LANGUAGE = 'device_language'
    APP_LANGUAGE = 'app_language'
    LOCATION_STATUS = "location_status"
    LOCATION_COUNTRY = "location_country"
    LOCATION_COUNTRY_CODE = 'location_country_code'
    LOCATION_REGION = "location_region"
    LOCATION_REGION_NAME = "location_region_name"
    LOCATION_CITY = "location_city"
    ZIP_CODE = "location_zip"
    LAT = "location_lat"
    LON = "location_lon"
    TIMEZONE = "location_timezone"
    ISP = "location_isp"
    ORG = "location_org"
    AS_NUMBER = "location_as"
    LOCATION_QUERY = "location_query"
    INCLUDE_COUNTRIES = 'include_countries'
    COUNTRY_CODE = 'country_code'
    COUNTRY = "country"
    QUERY = "query"
    BANNER_LANGUAGE = "banner_language"

    CAMPAIGN = 'campaign'
    CAMPAIGNS = 'campaigns'
    ACTIVE = 'active'
    SCORE = 'score'
    PERIOD = 'period'
    NAME = 'name'
    BEGIN = 'begin_date'
    END = 'end_date'
    CAMPAIGN_NAME = 'name'
    PARTICIPANT_LIMIT = 'participant_limit'
    REGIONS = "regions"
    FORM_TEMPLATE = 'form_template'
    FORM_VALUE = 'form_value'
    FORMS = "forms"
    INFO = 'info'
    RULE = 'rule'
    RULES = 'rules'

    GAME = 'game'
    GAME_IMAGE = 'game_image'
    GAMES = 'games'
    GAME_NAME = 'name'
    ANALYTICS_VIEW_ID = 'analytics_view_id'
    GAME_SERVICE_ID = 'game_service_id'
    PACKAGE_NAME = 'package_name'
    IMAGE = 'image'
    IMAGE_LINK = 'image_link'
    COLOR = "color"
    GAME_API_KEY = 'api_key'

    FOLDER = 'folder'

    API_KEY = "HTTP_X_TOKEN"
    LOCATION_KEY = "HTTP_X_LOCATION"
    TOKEN = EnvironmentConfiguration().get_token(is_prod=False)

    USERNAME = "username"
    PASSWORD = "password"

    CREATED_BY_ID = "created_by_id"
    MODIFIED_BY_ID = "modified_by_id"
    MODIFIED_DATE = "modified_date"
    CREATED_DATE = 'created_date'

    PLAYER_EMAIL = "player.email"
    PLAYER_GPG_ID = "player.gpg_id"
    CAMPAIGN_ID = "campaign.id"
    DATE = "date"

    BANNER_CONFIGURATION = "banner_configuration"
    IMAGE_URL = "image_url"
    TARGET_URL = "target_url"
    COUNTRIES = "countries"
    COUNTRY_NAME = "country_name"
    BANNERS = "banners"
    BANNER = "banner"
    PAGE = 'page'

    ENVIRONMENT_INFO = "environment_info"
    ENVIRONMENT_INFO_KEY = "HTTP_X_ENV"
    LOCATION_SOURCE = "location_source"
    LOCATION_DATE = "location_date"
    APP_VERSION = "app_version"
    OPENED = "opened"
    USERS = "users"
    COUNTRY_CODES = "country_codes"
    LOCATION_COUNTRY_CODES = "location_country_codes"

    TOTAL_REGISTERED_PARTICIPANTS = "total_registered_participants"
    TOTAL_REGISTERED_PERCENTAGE = "total_registered_percentage"

    GMT_TIMEZONE = 'gmt_timezone'
    PUSH_TEMPLATES = "push_templates"
    PUSH_TEMPLATE = "push_template"
    FORM_PUSH_VALUE = "form_push_value"
    FORM_PUSH_VALUES = "form_push_values"
    FORM_PUSH_TEMPLATE = "form_push_template"

    GAMES__GAME_SERVICE_ID = "games__game_service_id"
    FORMS__GAME__GAME_SERVICE_ID = "forms__game__game_service_id"
    GAME__NAME = "game__name"
    CAMPAIGN__NAME = "campaign__name"
    LOCATION__LOCATION_COUNTRY = "location__location_country"
    ENVIRONMENT_INFO__COUNTRY = "environment_info__location_country"
    CAMPAIGN_STARTED = "The campaign was started"
    UPDATE_TIME_REFRESH_TOKEN = 'update_time_refresh_token'
