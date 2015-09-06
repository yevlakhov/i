angular.module('app')
  .service('ServiceTreeService', function($http, $q) {

    function simpleHttpPromise(req, callback) {
      var cb = callback || angular.noop;
      var deferred = $q.defer();

      $http(req).then(
        function(response) {
          //var json = angular.fromJson(data);
          //deferred.resolve(json);
          deferred.resolve(response.data);
          return cb();
        },
        function(response) {
          deferred.reject(response);
          return cb(response);
        }.bind(this));
      return deferred.promise;
    }

    this.setServicesTree = function(nID_Subject, data, callback){
      var request = {
        method: 'POST',
        url: '/api/services',
        data: data,
        params: {
          nID_Subject: nID_Subject
        }
      };

      return simpleHttpPromise(request, callback);
    };

    var del = function(path, nID, bRecursive, nID_Subject, callback){
      var request = {
        method: 'DELETE',
        url: path,
        params: {
          nID: nID,
          bRecursive: bRecursive,
          nID_Subject: nID_Subject
        }
      };

      return simpleHttpPromise(request, callback);
    };

    this.removeService = function(nID, bRecursive, nID_Subject, callback){
      return del('/api/services/service', nID, bRecursive, nID_Subject, callback);
    };

    this.removeServiceData = function(nID, bRecursive, nID_Subject, callback){
      return del('/api/services/serviceData', nID, bRecursive, nID_Subject, callback);
    };

    this.removeSubcategory = function(nID, bRecursive, nID_Subject, callback){
      return del('/api/services/subcategory', nID, bRecursive, nID_Subject, callback);
    };

    this.removeCategory = function(nID, bRecursive, nID_Subject, callback){
      return del('/api/services/category', nID, bRecursive, nID_Subject, callback);
    };

    this.removeServicesTree = function(nID_Subject, callback){
      return del('/api/services/servicesTree', undefined, undefined, nID_Subject, callback);
    };

});
