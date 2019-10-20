from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_settings.views import SettingsViewSet

SETTINGS = 'settings'
router = DefaultRouter()
router.register(r'settings', SettingsViewSet, base_name=SETTINGS)

urlpatterns = [
    url(r'^', include(router.urls)),
]
