from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_banner.views import BannerViewSet

BANNER = "banner"
SEARCH = "banner_search"

router = DefaultRouter()
router.register(r'banner', BannerViewSet, base_name=BANNER)

urlpatterns = [
    url(r'^', include(router.urls)),
]
