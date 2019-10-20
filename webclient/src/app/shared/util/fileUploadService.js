(function () {
  'use strict';

  angular.module('gmm').service('fileUploadService', fileUpload);

  /* @ngInject */
  function fileUpload($http, Upload) {

    var service = {
      uploadFileToUrl: uploadFileToUrl
    };

    return service;

    function uploadFileToUrl(folder, imageLink, file, uploadUrl, sucess, error,  progress) {

      var fd = new FormData();
      fd.append('image', file);
      fd.append('image_link', imageLink);
      fd.append('folder', folder);

      file.upload = Upload.http({
        url: uploadUrl,
        method: 'POST',
        data: fd,
        transformRequest: angular.identity,
        headers: {
          'Content-Type': undefined
        }
      });

      file.upload.then(sucess, error);
      file.upload.progress(progress);
    }
  }

})();
