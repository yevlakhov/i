define('filebankid/factory', ['angularAMD'], function(angularAMD) {
  angularAMD.factory('FileBankIDFactory', function(ActivitiService) {
    var FileBankID = function() {
      this.value = null;
    };

    FileBankID.prototype.get = function() {
      return this.value;
    };

    FileBankID.prototype.uploadAndSetValue = function(oServiceData, scan){
      var setValueCallback = function(data){
        this.value = data;
      }
      ActivitiService.uploadFileFromScan(oServiceData, scan, setValueCallback);
    };

    return FileBankID;
  });
});