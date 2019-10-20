from rest_framework import status
from rest_framework.response import Response


class ResponseUtils:

    def __init__(self):
        pass

    @staticmethod
    def return_data(serializer):
        return Response(serializer.data)

    @staticmethod
    def ok(data, headers=None):
        return Response(data, headers=headers)

    @staticmethod
    def created():
        return Response(status=status.HTTP_201_CREATED)

    @staticmethod
    def created_with_body(data):
        return Response(data, status=status.HTTP_201_CREATED)

    @staticmethod
    def found(data=None):
        return Response(data=data, status=status.HTTP_302_FOUND)

    @staticmethod
    def bad_request_with_errors(errors):
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def bad_request(data=None):
        return Response(data=data, status=status.HTTP_400_BAD_REQUEST)

    @staticmethod
    def unauthorized():
        return Response(status=status.HTTP_401_UNAUTHORIZED)

    @staticmethod
    def not_found():
        return Response(status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def conflicted():
        return Response(status=status.HTTP_409_CONFLICT)

    @staticmethod
    def forbidden(data=None):
        return Response(data=data, status=status.HTTP_403_FORBIDDEN)
