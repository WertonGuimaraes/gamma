import os
import shutil
import time
from gmm import settings
from gmm_upload_files.urls import IMAGE
from django.core.files.storage import FileSystemStorage
from django.core.urlresolvers import reverse
import mock
from rest_framework import status
from os.path import realpath
from gmm_util.util_test import JsonObjects, remove_field
from django.contrib.auth.models import User
from gmm_util.util_test import AuthenticationUtil
from rest_framework.test import APITestCase
from gmm_util.constants import Constants


class ImageUploadPostTestCase(APITestCase):

    FILE = realpath(Constants.IMAGE_PATH_TO_TEST_UPLOAD)
    path_mock = realpath('game')
    folder = "%s/game_icon_%s.jpg" % (settings.GAME_IMAGE_FOLDER, time.time())
    url = reverse(IMAGE)
    image_file = open(FILE, 'rb')
    data = JsonObjects.image(image=image_file, folder=folder)

    @classmethod
    def setUpClass(self):
        super(ImageUploadPostTestCase, self).setUpClass()
        self.user = User.objects.create_user(**JsonObjects.user())

    @classmethod
    def tearDownClass(self):
        super(ImageUploadPostTestCase, self).tearDownClass()
        self.user.delete()
        if os.path.exists(self.path_mock):
            shutil.rmtree(self.path_mock)

    def login(self):
        return AuthenticationUtil.login(self.user)

    def post_with_auth(self, url, body):
        return self.client.post(url, body, format="multipart", HTTP_AUTHORIZATION=self.token)

    def post_without_auth(self, url, body):
        return self.client.post(url, body, format="multipart")

    def setUp(self):
        self.token = self.login()

    @mock.patch('storages.backends.s3boto.S3BotoStorage', FileSystemStorage)
    def test_upload_image__status201(self):
        # act
        response = self.post_with_auth(self.url, self.data)
        # assert
        self.assertEquals(response.status_code, status.HTTP_201_CREATED)

    @mock.patch('storages.backends.s3boto.S3BotoStorage', FileSystemStorage)
    def test_upload_image__without_token__status401(self):
        # act
        response = self.post_without_auth(self.url, self.data)
        # assert
        self.assertEquals(response.status_code, status.HTTP_401_UNAUTHORIZED)

    @mock.patch('storages.backends.s3boto.S3BotoStorage', FileSystemStorage)
    def test_upload_image__without_image__status400(self):
        # arrange
        image_without_image = remove_field('image', self.data)
        # act
        response = self.post_with_auth(self.url, image_without_image)
        # assert
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)

    @mock.patch('storages.backends.s3boto.S3BotoStorage', FileSystemStorage)
    def test_upload_image__without_folder__status400(self):
        # arrange
        image_without_folder = remove_field('folder', self.data)
        # act
        response = self.post_with_auth(self.url, image_without_folder)
        # assert
        self.assertEquals(response.status_code, status.HTTP_400_BAD_REQUEST)
