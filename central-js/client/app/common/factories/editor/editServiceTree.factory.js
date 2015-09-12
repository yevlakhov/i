angular.module('app')
  .factory('EditServiceTreeService', function($http, $modal, CatalogService) {

    var catalog;
    CatalogService.getServices()
      .then(function(result){
        catalog = result;
      }
    );

    var categoryEditor = (function(){
      var openModal = function (category) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/common/factories/editor/editCategory.html',
          controller: 'EditorModalController',
          resolve: {
            entityToEdit: function () {
              if (category){
                return {
                  nID: category.nID,
                  sID: category.sID,
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
          //var catalogToSent = [ editedCategory ];
          //CatalogService.setServicesTree(catalogToSent)
          CatalogService.setServicesTree(editedCategory)
            .then(function(result){
              catalog = result;
            });
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
          CatalogService.removeCategory(categoryToRemove)
        }
      }
    })();

    var subcategoryEditor = (function(){

      var openModal = function (category, subcategory) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/common/factories/editor/editSubcategory.html',
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
          CatalogService.setServicesTree(catalog)
            .then(function(result){
              catalog = result;
            });
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
          CatalogService.removeSubcategory()
        }
      }
    })();

    var serviceEditor = (function(){
      var openModal = function (subcategory, service) {
        var modalInstance = $modal.open({
          animation: true,
          templateUrl: 'app/common/factories/editor/editService.html',
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
          CatalogService.setServicesTree(catalog)
            .then(function(result){
              catalog = result;
            });
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
          CatalogService.removeService(serviceToRemove)
        }
      }
    })();

    return {
      category: categoryEditor,
      subcategory: subcategoryEditor,
      service: serviceEditor
    };
});
