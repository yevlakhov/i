var url = require('url')
  , request = require('request')
  , FormData = require('form-data')
  , activiti = require('../../components/activiti')
  , config = require('../../config/environment');

var apiURLS = {
  upload: '/object/file/upload_file_to_redis',
  download: '/object/file/download_file_from_redis_bytes'
};

module.exports.getAPIEndpoints = function () {
  return apiURLS;
};

module.exports.upload = function (contentToUpload, callback, sHost) {
  activiti.upload(apiURLS.upload, {}, contentToUpload, function (error, response, body) {
//code = "SYSTEM_ERR"
//message = "Could not parse multipart servlet request; nested exception is org.apache.commons.fileupload.FileUploadBase$IOFileUploadException: Processing of multipart/form-data request failed. Stream ended unexpectedly"
    callback(error, response, body);
  }, sHost);
};

module.exports.prepareDownload = function(fileID, sHost, session){
  return activiti.buildGET(apiURLS.download, {key: fileID}, sHost, session);
};

module.exports.download = function (fileID, callback, sHost, session) {
  activiti.get(apiURLS.download, {key: fileID}, callback, sHost, session);
};

module.exports.uploadHTMLForm = function (fullUploadURL, formToUpload, headers, callback) {
  var form = new FormData();
  form.append('file', formToUpload, {
    contentType: 'text/html'
  });

  var requestOptionsForUploadContent = {
    url: fullUploadURL,
    headers: _.merge(headers, form.getHeaders()),
    formData: {
      file: formToUpload
    },
    json: true
  };

  request.post(requestOptionsForUploadContent, function (error, response, body) {
    if (!body)
      callback('Unable to sign a file. bankid.privatbank.ua return an empty response', null);
    else if (error || (error = body.error)) {
      callback(error, null);
    } else {
      callback(null, body);
    }
  });

};
