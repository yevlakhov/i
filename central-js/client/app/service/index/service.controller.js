angular.module('app').controller('ServiceController',
  function($scope,
           $rootScope,
           $timeout,
           $modal,
           CatalogService,
           AdminService,
           ServiceTreeService,
           $filter,
           statesRepository,
           RegionListFactory,
           LocalityListFactory
  ) {
    $scope.data = {region: null, city: null};

    function getIDPlaces() {
      return ($scope.bShowExtSearch && $scope.selectedStatus === 2 && $scope.data.region !== null) ?
        [$scope.data.region].concat($scope.data.city === null ? $scope.data.region.aCity : $scope.data.city)
          .map(function(e) { return e.sID_UA; }) : statesRepository.getIDPlaces();
    }

    var fullCatalog;

    function copyCatalog() {
      return jQuery.extend(true, {}, fullCatalog);
    }

    $scope.catalogCounts = {0: 0, 1: 0, 2: 0};
    $scope.limit = 4;
    $scope.sSearch = null;
    $scope.bAdmin = true;//AdminService.isAdmin();
    $scope.recalcCounts = true;
    $scope.bShowExtSearch = false;
    $scope.operators = [];
    $scope.selectedStatus = -1;
    $scope.operator = -1;
    $scope.spinner = true;

    $scope.regionList = new RegionListFactory();
    $scope.regionList.load(null, null);
    $scope.localityList = new LocalityListFactory();

    $scope.loadRegionList = function(search) {
      return $scope.regionList.load(null, search);
    };

    $scope.onSelectRegionList = function($item) {
      $scope.data.region = $item;
      $scope.regionList.select($item);
      $scope.data.city = null;
      $scope.localityList.reset();
      $scope.search();
      $scope.localityList.load(null, $item.nID, null).then(function(cities) {
        $scope.localityList.typeahead.defaultList = cities;
      });
    };

    $scope.loadLocalityList = function(search) {
      return $scope.localityList.load(null, $scope.data.region.nID, search);
    };

    $scope.onSelectLocalityList = function($item, $model, $label) {
      $scope.data.city = $item;
      $scope.localityList.select($item, $model, $label);
      $scope.search();
    };

    $scope.search = function() {
      $scope.spinner = true;
      $scope.catalog = [];
      return CatalogService.getModeSpecificServices(getIDPlaces(), $scope.sSearch).then(function (result) {
        fullCatalog = result;
        if ($scope.bShowExtSearch)
          $scope.filterByExtSearch();
        else
          $scope.catalog = copyCatalog();
      }).finally(function() {
        $scope.spinner = false;
      });
    };

    $scope.onExtSearchClick = function() {
      $scope.bShowExtSearch = !$scope.bShowExtSearch;
      if ($scope.operator !== -1 || $scope.selectedStatus !== -1 || $scope.data.region !== null)
          $scope.search();
    };

    $scope.filterByStatus = function(status) {
      $scope.selectedStatus = status;
      var ctlg = copyCatalog();
      angular.forEach(ctlg, function(item) {
        angular.forEach(item.aSubcategory, function(subItem) {
          subItem.aService = $filter('filter')(subItem.aService, {nStatus: status});
        });
      });

      $scope.recalcCounts = false;
      $scope.catalog = ctlg;
    };

    $scope.filterByExtSearch = function() {
      if ($scope.bShowExtSearch) {
        var filterCriteria = {};
        if ($scope.selectedStatus != -1) {
          filterCriteria.nStatus = $scope.selectedStatus;
        }
        if ($scope.operator != -1) {
          filterCriteria.sSubjectOperatorName = $scope.operator;
        }
        var ctlg = copyCatalog();
        angular.forEach(ctlg, function(item) {
          angular.forEach(item.aSubcategory, function(subItem) {
            subItem.aService = $filter('filter')(subItem.aService, filterCriteria);
          });
        });
        $scope.catalog = ctlg;
      }
    };

    $scope.$watch('catalog', function(newValue) {
      $timeout(function() {
        if ($scope.bShowExtSearch == false) {
          if ($scope.recalcCounts == true) {
            $scope.catalogCounts = {0: 0, 1: 0, 2: 0};
          }

          $scope.operators = [];
        }

        angular.forEach(newValue, function(item) {
          angular.forEach(item.aSubcategory, function(subItem) {
            angular.forEach(subItem.aService, function(aServiceItem) {
              if ($scope.bShowExtSearch == false) {
                if ($scope.recalcCounts == true) {
                  $scope.catalogCounts[aServiceItem.nStatus]++;
                }

                var found = false;
                for (var i = 0; i < $scope.operators.length; i++) {
                  if ($scope.operators[i].sSubjectOperatorName === aServiceItem.sSubjectOperatorName) {
                    found = true;
                    break;
                  }
                }
                if (!found) {
                  $scope.operators.push(aServiceItem);
                }
              }
            });
          });
          if (item.aSubcategory) {
            item.aSubcategory = jQuery.grep(item.aSubcategory, function(sc) {
              return sc.aService.length > 0;
            });

            if (item.aSubcategory.length === 0) {
              item.sName = "";
            }
          }
        });
        $scope.recalcCounts = true;
      });
    });

    $scope.$watch('selectedStatus', function(newValue, oldValue) {
      if ((newValue === 2 || oldValue === 2) && $scope.data.region !== null)
        $scope.search();
    });

    $scope.categoryEditor = (function(){

      var openModal = function (category) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/service/index/editor/editCategory.html',
          controller: 'EditorModalController',
          resolve: {
            entityToEdit: function () {
              if (category){
                return {
                  sName: category.sName,
                  nOrder: category.nOrder
                };
              }else{
                return undefined;
              }
            }
          }
        });

        modalInstance.result.then(function (editedCategory) {
          var index = $scope.catalog.indexOf(category);
          if (index !== -1) {
            category.sName = editedCategory.sName;
            category.nOrder = editedCategory.nOrder;
          }
          else{
            editedCategory.aSubcategory = [];
            $scope.catalog.push(editedCategory);
          }
          ServiceTreeService.setServicesTree(null, $scope.catalog);
        });
      };

      return {
        add: function(){
          openModal();
        },
        edit: function(category){
          openModal(category)
        },
        remove: function(categoryToRemove){
          ServiceTreeService.removeCategory(categoryToRemove)
        }
      }
    })();

    $scope.subcategoryEditor = (function(){

      var openModal = function (category, subcategory) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/service/index/editor/editSubcategory.html',
          controller: 'EditorModalController',
          resolve: {
            entityToEdit: function () {
              if (subcategory){
                return {
                  sName: subcategory.sName,
                  nOrder: subcategory.nOrder
                }
              }
              return undefined;
            }
          }
        });

        modalInstance.result.then(function (editedSubcategory) {
          var index = category.aSubcategory.indexOf(subcategory);
          if (index !== -1) {
            subcategory.sName = editedSubcategory.sName;
            subcategory.nOrder = editedSubcategory.nOrder;
          }
          else{
            editedSubcategory.aService = [];
            category.aSubcategory.push(editedSubcategory);
          }
          ServiceTreeService.setServicesTree(null, $scope.catalog);
        });
      };

      return {
        add: function(category){
          openModal(category);
        },
        edit: function(category, subcategory){
          openModal(category, subcategory)
        },
        remove: function(subcategoryToRemove){
          ServiceTreeService.removeSubcategory()
        }
      }
    })();

    $scope.serviceEditor = (function(){

      var openModal = function (subcategory, service) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/service/index/editor/editService.html',
          controller: 'EditorModalController',
          resolve: {
            entityToEdit: function () {
              return angular.copy(service);
            }
          }
        });

        modalInstance.result.then(function (editedService) {
          var index = subcategory.aService.indexOf(service);
          if (index !== -1) {
            subcategory.aService[index] = editedService;
          }
          else{
            subcategory.aService.push(editedService);
          }
          ServiceTreeService.setServicesTree(null, $scope.catalog);
        });
      };

      return {
        add: function(subcategory){
          openModal(subcategory);
        },
        edit: function(subcategory, serviceToEdit){
          openModal(subcategory, serviceToEdit)
        },
        remove: function(serviceToRemove){
          ServiceTreeService.removeService(serviceToRemove)
        }
      }
    })();





  $scope.search();
});
