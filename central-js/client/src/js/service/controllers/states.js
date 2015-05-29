define('state/service/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceController', ['$state', '$rootScope', '$scope', 'service', function ($state, $rootScope, $scope, service) {
		$scope.service = service;
        //debugger;
        //for (var i = 0; i < catalog.length; i++) {
        //    var category = catalog[i];
        //    for (var j = 0; j < category.aSubcategory.length; j++) {
        //        var subCategory = category.aSubcategory[j];
        //        for (var k = 0; k < subCategory.aService.length; k++) {
        //            var curService = subCategory.aService[k];
        //            if (curService.nID === $stateParams.id) {
        //                $scope.subcategory = subCategory;
        //                return;
        //            }
        //        }
        //    }
        //}
	}]);
});

define('state/service/general/controller', ['angularAMD'], function (angularAMD) {
	angularAMD.controller('ServiceGeneralController', ['$state', '$rootScope', '$scope', 'service', function ($state, $rootScope, $scope, service) {
		$scope.service = service;
		
		var aServiceData = service.aServiceData;
		
		var isCity = false;
		angular.forEach(aServiceData, function(value, key) {
			if(value.hasOwnProperty('nID_City')) {
				isCity = true;
			}
		});
		if(isCity) {
			return $state.go('service.general.city', {id: service.nID}, { location: false });
		}
		
		var isRegion = false;
		angular.forEach(aServiceData, function(value, key) {
			if(value.hasOwnProperty('nID_Region')) {
				isRegion = true;
			}
		});
		if(isRegion) {
			return $state.go('service.general.region', {id: service.nID}, { location: false });
		}
		
		return $state.go('service.general.country', {id: service.nID}, { location: false });
    }]);
});