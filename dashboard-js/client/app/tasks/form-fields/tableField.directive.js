'use strict';
angular.module('dashboardJsApp')
  .directive('tableField', function() {
    return {
      restrict: 'E',
      controller: ['$scope', function TableFieldController( $scope ) {
        
        $scope.broadcast = function(eventName, obj) { 

           $rootScope.$broadcast(eventName, obj); 

           return true;
        }; 
        
      }], 
      templateUrl: 'app/tasks/form-fields/tableField.html'
    };
});
