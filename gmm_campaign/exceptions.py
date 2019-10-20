from rest_framework.serializers import ValidationError
from rest_framework.exceptions import APIException
from rest_framework import status


class GcmJsonError(APIException):
    def __init__(self, errors):
        super(GcmJsonError, self).__init__(errors)
        self.status_code = status.HTTP_400_BAD_REQUEST


class RegionsWithTheSameCountryForThisEntityError(APIException):
    def __init__(self):
        detail = "One or more regions contain the same country for this entity."
        super(RegionsWithTheSameCountryForThisEntityError, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST


class UploadFailedError(APIException):
    def __init__(self, errors):
        super(UploadFailedError, self).__init__(errors)
        self.status_code = status.HTTP_400_BAD_REQUEST


class RegionAlreadyExistsError(APIException):
    def __init__(self, region_name):
        detail = "The region \"" + region_name + "\" already exists."
        super(RegionAlreadyExistsError, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST


class CountryDoesNotExistError(APIException):
    def __init__(self, country_name, country_code):
        detail = "The country \"%s (%s)\" does not exist." % (country_name, country_code)
        super(CountryDoesNotExistError, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST


class CountryNameDoesNotMatchWithCountryCode(APIException):
    def __init__(self, country_name, country_code):
        detail = "The country \"%s\" does not match with the country code \"%s\"." % (country_name, country_code)
        super(CountryNameDoesNotMatchWithCountryCode, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST


class InvalidCountryDataError(APIException):
    def __init__(self, error):
        super(InvalidCountryDataError, self).__init__(error)
        self.status_code = status.HTTP_400_BAD_REQUEST


class CampaignIsNotOpenError(APIException):
    def __init__(self):
        detail = "The campaign is not open."
        super(CampaignIsNotOpenError, self).__init__(detail)
        self.status_code = status.HTTP_403_FORBIDDEN


class UniqueFieldGameError(APIException):
    def __init__(self, name):
        detail = "The field " + name + " requires be UNIQUE"
        super(UniqueFieldGameError, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST


class TypeFieldGameError(APIException):
    def __init__(self):
        detail = "Data doesn't type dict."
        super(TypeFieldGameError, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST


class EmptyFieldError(ValidationError):
    def __init__(self, field=""):
        detail = "This field cannot be empty"
        if field:
            detail = "The field %s cannot be empty" % field

        super(EmptyFieldError, self).__init__(detail)
        self.status_code = status.HTTP_400_BAD_REQUEST
