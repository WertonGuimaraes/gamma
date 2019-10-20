from unittest import TestCase
from gmm_banner.serializers import BannerSerializer
from gmm_util.field import Field


class BannerSerializerTestCase(TestCase):

    def banner(self, name="default name", image_url="http://www.image1.com", target_url="http://www.target1.com",
               language="PT"):
        return {
            Field.NAME: name,
            Field.IMAGE_URL: image_url,
            Field.TARGET_URL: target_url,
            Field.LANGUAGE: language
        }

    def test__create_banner__with_invalid_language__false(self):
        # Arrange
        banner_data_invalid = self.banner(language='Invalid Language')
        banner_data_whatever = self.banner(language='EH')
        # Act
        banner_created_invalid = BannerSerializer(data=banner_data_invalid)
        banner_created_whatever = BannerSerializer(data=banner_data_whatever)
        # Assert
        self.assertFalse(banner_created_invalid.is_valid())
        self.assertFalse(banner_created_whatever.is_valid())

    def test__error_message__invalid_language__error_message(self):
        # Arrange
        banner_data_invalid = self.banner(language='Invalid Language')
        banner_data_whatever = self.banner(language='EH')
        banner_created_invalid = BannerSerializer(data=banner_data_invalid)
        banner_created_whatever = BannerSerializer(data=banner_data_whatever)
        # Act
        banner_created_whatever.is_valid()
        banner_created_invalid.is_valid()
        # Assert
        self.assertDictEqual(banner_created_whatever.errors, {'language': [u'"EH" is not a valid choice.']})
        self.assertDictEqual(banner_created_invalid.errors,
                             {'language': [u'"Invalid Language" is not a valid choice.']})

    def test__create_banner__with_valid_language__true(self):
        # Arrange
        banner_data_all_languages = self.banner(language='ALL')
        banner_data_portuguese = self.banner(language='PT')
        banner_data_english = self.banner(language='EN')
        banner_data_spanish = self.banner(language='ES')
        # Act
        banner_created_all_languages = BannerSerializer(data=banner_data_all_languages)
        banner_created_portuguese = BannerSerializer(data=banner_data_portuguese)
        banner_created_english = BannerSerializer(data=banner_data_english)
        banner_created_spanish = BannerSerializer(data=banner_data_spanish)
        # Assert
        self.assertTrue(banner_created_all_languages.is_valid())
        self.assertTrue(banner_created_portuguese.is_valid())
        self.assertTrue(banner_created_english.is_valid())
        self.assertTrue(banner_created_spanish.is_valid())
