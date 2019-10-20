from django.conf.urls import url, patterns
from .views import ImageUploadView

IMAGE = 'image'

urlpatterns = patterns(
    '',
    url(r'^image/?$', ImageUploadView.as_view(), name=IMAGE),
    )
