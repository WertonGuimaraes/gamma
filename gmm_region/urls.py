from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_region.views import RegionViewSet

REGION = 'region'
SEARCH = 'region_search'

router = DefaultRouter()
router.register(r'region', RegionViewSet, base_name=REGION)

urlpatterns = [
    url(r'^', include(router.urls)),
]
