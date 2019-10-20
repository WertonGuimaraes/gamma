from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter

from gmm_auth.views import UserViewSet, GroupUserViewSet

LOGIN = 'login'
REFRESH_TOKEN = 'refresh_token'
router = DefaultRouter()
router.register(r'user', UserViewSet, base_name='user')
router.register(r'group', GroupUserViewSet, base_name='group')

urlpatterns = [
    url(r'^login/', 'rest_framework_jwt.views.obtain_jwt_token', name=LOGIN),
    url(r'^refresh-token/', 'rest_framework_jwt.views.refresh_jwt_token', name=REFRESH_TOKEN),
    url(r'^', include(router.urls)),

]

urlpatterns += router.urls
