from django.conf.urls import patterns, include, url

urlpatterns = patterns(
    '',
    url(r'v1/', include('gmm_mobile.v1.urls')),
)
