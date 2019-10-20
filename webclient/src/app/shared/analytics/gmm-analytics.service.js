(function () {
  'use strict';

  angular.module('gmm')
    .service('gmmAnalyticsService', gmmAnalyticsService);

  /* @ngInject */
  function gmmAnalyticsService(moment) {

    var service = {
      authorize: authorize,
      mountAnalyticsLink: mountAnalyticsLink,
      queryExplorer: queryExplorer
    };

    return service;

    function authorize(signIn, error) {

      gapi.analytics.ready(ready);

      function ready() {

        var authorize = gapi.analytics.auth.authorize(getAuth());
        authorize.on('signIn', signIn);
        authorize.on('error', error);

        function getAuth() {
          return {
            container: 'embed-api-auth-container',
            clientid: '722982025790-15qmuc6hcju0ibnuek4k7vpm5l84gnrf.apps.googleusercontent.com'
          };
        }
      }
    }

    function queryExplorer(ids, filters, success, error) {

      gapi.analytics.ready(ready);

      function ready() {
        var report = new gapi.analytics.report.Data(getQuery());
        report.on('success', success);
        report.on('error', error);
        report.execute();
      }

      function getQuery() {
        return {
          query: {
            ids: 'ga:' + ids,
            metrics: 'ga:totalEvents',
            filters: 'ga:eventLabel=@' + filters,
            'start-date': '2016-03-27',
            'end-date': 'today'
          }
        };
      }
    }

    function mountAnalyticsLink(url, profileInfo) {
      /*jshint -W121*/
      String.prototype.replaceAll = function (s, r) {
        return this.split(s).join(r);
      };

      var linkDate = '%3F_u.date00%3D20160327%26_u.date01%3D' + moment().format('YYYYMMDD') + '%26';
      var linkAnalytics = 'https://analytics.google.com/analytics/web/#report/app-content-event-overview/a';
      var linkSegmentExplorer =
        'explorer-segmentExplorer.segmentId%3Danalytics.eventLabel%26_r.drilldown%3Danalytics.eventLabel%3A';

      var imageUrl = url.replaceAll('/', '%2F');
      imageUrl = imageUrl.replaceAll(':', '%3A');

      return linkAnalytics +
        profileInfo.accountId + 'w' +
        profileInfo.internalWebPropertyId + 'p' +
        profileInfo.profileId + '/' +
        linkDate +
        linkSegmentExplorer +
        imageUrl;
    }

  }
})();
