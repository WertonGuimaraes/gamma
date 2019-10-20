class Constants(object):

    PERMISSIONS_ARE_REQUIRED = 'Permissions are required'
    FAIL = 'fail'
    ALL_LANGUAGES = 'ALL'
    MESSAGE = 'message'
    METHOD_POST = 'POST'
    METHOD_PUT = 'PUT'
    METHOD_GET = 'GET'
    METHOD_DELETE = 'DELETE'
    METHOD_LIST = 'LIST'
    GROUP_ALREADY_EXISTS_ERROR = "That group name already exists"
    GROUP_IS_REQUIRED = 'Group is required'
    INVALID_APP_LANGUAGE_ERROR = 'Invalid app language.'

    GCM_DATA_ERROR = "Invalid Data Error"
    GCM_KEY_ERROR = 'Invalid Key Error'
    GCM_REG_ID_LIMIT = "It must contain at least 1 and at most 1000 registration tokens"
    EDIT_CONTROL = 'Only the end date can be updated'
    CAMPAIGN_FINISHED_BY_PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR = "The participant limit has been reached already." \
                                                                "The campaign can't be modified."
    STARTED_CAMPAIGN_EDIT_CONTROL_ERROR = "Just the end date, name and the game configuration can be modified."
    PARTICIPANT_LIMIT_EDIT_CONTROL_ERROR = "The participant limit can't be modified."
    BEGIN_OR_END_DATE_NULL_ERROR = "You must set correct dates or erase them"
    TIMEZONE_ERROR = 'You must set the timezone'
    DATES = 'Dates'
    BEGIN_DATE = 'Begin Date'
    END_DATE = 'End Date'
    END_DATE_LESS_THAN_CURRENT_DATE_ERROR = "End date must be greater than current date"

    REQUIRED_FIELD = 'This field is required.'
    NOT_NULL_FIELD = 'This field may not be null.'
    EMPTY_FIELD = "This field cannot be empty"
    ONLY_NUMBERS_ALLOWED = "Only numbers are allowed."
    LANGUAGES_CHOICES = [('PT', 'Portuguese'), ('ES', 'Spanish'),  ('EN', 'English'), ('ALL', 'All languages')]

    FORCE = "force"

    FORMAT_TIME = '%Y%m%d%H%M%S'

    NAME = 'name'
    PAGE = 'page'
    COUNTRY = 'country'
    CAMPAIGNS = 'campaigns'
    IMAGE_PATH_TO_TEST_UPLOAD = 'gmm_util/images_to_test_upload/zenny.jpg'

    ITEMS_PER_PAGE = 50

    QUERY_ALL = 'all'

    ASC = "asc"
    DESC = "desc"

    OPEN_CAMPAIGN = 'open_campaign'
    REGISTER = 'register'

    STATUS_PAUSED = 1
    STATUS_ABOUT_TO_START = 2
    STATUS_STARTED = 3
    STATUS_FINISHED = 4

    PAUSED = "paused"
    FINISHED = "finished"
    STARTED = "started"
    ABOUT_TO_START = "about to start"

    ALL_ELEMENTS_OF_THE_QUERYSET = 'all'

    # Don't change this value to more than 1000
    LIMIT_OF_PLAYERS_TO_SEND_PUSH = 1000
    TIME_UPDATE_PARTICIPANT_NUMBER = 60
    TIME_TO_VERIFY_PUSH_TO_SEND = 1800
    TIME_TO_REFRESH_TOKEN = 300
