'use strict';
angular.module('dashboardJsApp')
  .directive('tableField', function() {
    return {
      restrict: 'E',
      controller: ['$scope', '$rootScope', function TableFieldController( $scope, $rootScope ) {
        
        $scope.broadcast = function(eventName, obj) { 

           $rootScope.$broadcast(eventName, obj); 

           return true;
        }; 
        
      }], 
      templateUrl: 'app/tasks/form-fields/tableField.html'
    };
});
