import ast

from gmm_mobile.v1.exceptions import HeaderInvalidEnvironment, HeaderSyntaxErrorEnvironment
from gmm_util.field import Field


class Header:

    @staticmethod
    def _exist_api_key(request):
        return Field.API_KEY in request.META

    @staticmethod
    def _is_token_valid(request):
        return request.META[Field.API_KEY] == Field.TOKEN

    @staticmethod
    def valid_token(request):
        is_valid = Header._exist_api_key(request) and Header._is_token_valid(request)
        return is_valid

    @staticmethod
    def get_environment_info(request):
        if Field.ENVIRONMENT_INFO_KEY not in request.META.keys():
            raise HeaderInvalidEnvironment()
        environment_info = Header._environment_info_to_dict(request)

        return environment_info

    @staticmethod
    def _environment_info_to_dict(request):
        environment_info = request.META[Field.ENVIRONMENT_INFO_KEY]

        if type(environment_info) != dict:
            try:
                environment_info = ast.literal_eval(environment_info)
            except SyntaxError:
                raise HeaderSyntaxErrorEnvironment()

        return environment_info
