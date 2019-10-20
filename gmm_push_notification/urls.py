from django.conf.urls import url
from rest_framework.routers import DefaultRouter
from gmm_push_notification.views import PushViewSet, PushDetailsViewSet, PushesListViewSet

router = DefaultRouter()
router.register(r'push', PushViewSet, base_name="push")
router.register(r'pushes', PushesListViewSet, base_name="pushes")


urlpatterns = [
    url(r'^push/(?P<push_id>[0-9]+)/details', PushDetailsViewSet.as_view({'get': 'retrieve'})),
]

urlpatterns += router.urls
