from rest_framework.views import APIView
from django.http.multipartparser import MultiPartParser
from rest_framework.parsers import FormParser
from gmm import settings
from gmm_util.field import Field
from gmm_util.response import ResponseUtils
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from gmm_campaign.exceptions import UploadFailedError


class ImageUploadView(APIView):

    permission_classes = (IsAuthenticated,)
    authentication_classes = (JSONWebTokenAuthentication,)

    def post(self, request):
        try:
            parser_classes = (MultiPartParser, FormParser,)
            file_image = request.data[Field.IMAGE]
            folder = request.data[Field.FOLDER]

            if file_image and folder:
                path = default_storage.save(str(folder), ContentFile(file_image.read()))
                response = settings.STATIC_URL_S3 + path.replace(" ", "%20")
            else:
                raise UploadFailedError('The upload failed')

            return ResponseUtils.created_with_body(response)
        except:
            return ResponseUtils.bad_request_with_errors("it wasn't possible up the file")
