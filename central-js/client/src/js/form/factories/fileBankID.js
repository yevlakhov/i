define('filebankid/factory', ['angularAMD'], function(angularAMD) {
  angularAMD.factory('FileBankIDFactory', function(ActivitiService) {
    var FileBankID = function() {
      this.value = null;
    };

    FileBankID.prototype.get = function() {
      return this.value;
    };

    FileBankID.prototype.upload = function(scan, oServiceData){
      var url = ActivitiService.getUploadFileURL(oServiceData);
      return null;
    }

    return FileBankID;
  });
});