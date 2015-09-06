'use strict';

angular.module('app')
  .controller('EditorModalController', function($scope, $modalInstance, serviceToEdit) {

    $scope.service = serviceToEdit;

    $scope.showSave = function(){
      return true;
    };

    $scope.save = function () {
      $modalInstance.close();
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    //Init

  });
