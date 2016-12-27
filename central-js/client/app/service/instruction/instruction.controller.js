angular.module('app').controller('ServiceInstructionController', function ($state, $rootScope, $scope, service, AdminService, ServiceService,PlacesService,statesRepository) {
    $scope.bAdmin = AdminService.isAdmin();
    $scope.bShowSpinner = false;

    if(statesRepository.isKyivCity()){
        $rootScope.serviceNotFound = service.aServiceData.some(function (val) {
            return val.nID_Region && val.nID_Region.sID_UA == "8000000000" && val.nID_Region.sName == "Київ"
        });
        $rootScope.serviceNotFound = !$rootScope.serviceNotFound;
    }

    // $rootScope.serviceNotFound = !(PlacesService.getServiceStateForPlace()=='index.service.instruction');


    function reInit(info) {
        $scope.sInstruction = info;
        $scope.bShowInstruction = $scope.sInstruction.trim() !== '';

        $scope.bEditMode = false;
        $scope.sEditedInstruction = angular.copy($scope.sInstruction);
    }

    reInit(service.sInfo);

    $scope.edit = function () {
        $scope.bEditMode = true;
    };

    $scope.apply = function () {
        var serviceToSet = angular.copy(service);
        serviceToSet.sInfo = $scope.sEditedInstruction;
        $scope.bShowSpinner = true;
        ServiceService.set(serviceToSet)
            .then(function (updatedService) {
                reInit(updatedService.sInfo);
                $scope.bShowSpinner = false;
            });
        $scope.bEditMode = false;
    };

    $scope.cancel = function () {
        $scope.bEditMode = false;
    };


    $("body").on('click', '#accordion .card .card-header a', function (e) {
        e.preventDefault();
        var target = $(this).attr('href');
        $(target).collapse('toggle');
    })
});
