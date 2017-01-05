angular.module('app')
    .controller('NewSubcategoryController',
        ['$scope', '$stateParams', '$filter', '$location', '$anchorScroll', 'messageBusService', 'chosenCategory', 'EditServiceTreeFactory', 'AdminService', '$state', '$rootScope', 'TitleChangeService',
            function ($scope, $stateParams, $filter, $location, $anchorScroll, messageBusService, chosenCategory, EditServiceTreeFactory, AdminService, $state, $rootScope, TitleChangeService) {
                $scope.category = $stateParams.catID;
                $scope.subcategory = chosenCategory;
                // $scope.spinner = false;
                $scope.bAdmin = AdminService.isAdmin();

                $scope.mailInputText = '';


                $scope.sendMailRequest = function () {
                    $.post('/api/messages/sendMail',{message:$scope.mailInputText}).success(function () {
                      alert('Дякуемо. Ваш запит успішно відправлений');
                      $scope.mailInputText = '';
                        $scope.$apply()
                    })
                }

                var subscribers = [];
                var subscriberId = messageBusService.subscribe('catalog:updatePending', function () {
                    $scope.spinner = true;
                    $scope.catalog = [];
                    $scope.category = null;
                    $scope.subcategory = null;
                });
                subscribers.push(subscriberId);
                messageBusService.subscribe('catalog:update', function (data) {
                    $scope.spinner = false;
                    $scope.catalog = data;
                    if ($scope.catalog) {
                        $scope.subcategory = data;
                      try {
                        $scope.subcategory = $scope.subcategory.map(function (val) {
                          if (Array.isArray(val.aServiceTag_Child)) {
                            val.aServiceTag_Child = val.aServiceTag_Child.map(function (item) {
                              var to = item.sName_UA.indexOf(']');
                              item.sName_UA = item.sName_UA.substr(to + 1);
                              return item
                            })
                          }
                          return val
                        })
                      }catch (e){}
                    } else {
                        $scope.subcategory = null;
                    }
                    $scope.spinner = false;
                    $rootScope.rand = (Math.random() * 10).toFixed(2);
                }, false);

                subscribers.push(subscriberId);
                $scope.category = null;
                $scope.subcategory = null;
                $scope.$on('$destroy', function () {
                    subscribers.forEach(function (subscriberId) {
                        messageBusService.unsubscribe(subscriberId);
                    });
                });

                if ($scope.catalog &&
                    $scope.catalog.aService
                    && chosenCategory.oServiceTag_Root.nID === $scope.catalog.oServiceTag_Root.nID
                    || $rootScope.wasSearched) {
                    $scope.subcategory = $scope.catalog;
                    var array = [{cName:"Інші життєві ситуації",items:[]}];
                    $scope.subcategory.aServiceTag_Child.forEach(function (item) {
                        var from = item.sName_UA.indexOf('[');
                        var to = item.sName_UA.indexOf(']');
                        if(from != -1 && to!=-1) {
                            var catName = item.sName_UA.slice(from + 1, to);
                            var obj = array.find(function (element) {
                                return element.cName == catName
                            })
                            item.sName_UA = item.sName_UA.substr(to + 1);
                            if (!obj) {
                                array.push({cName: catName, items: [item]});
                            } else {
                                obj.items.push(item);
                            }
                        }else{
                            var obj = array.find(function (element) {
                                return element.cName == "Інші життєві ситуації"
                            })
                            obj.items.push(item);
                        }
                    })
                    var objAnother = array.find(function (element) {
                        return element.cName == "Інші життєві ситуації"
                    })
                    if(objAnother.items.length==0){
                        array = array.filter(function (val) {
                            return val.cName != "Інші життєві ситуації"
                        })
                    }
                    $scope.subcategory.aServiceTag_Child = array.reverse();
                    $rootScope.wasSearched = false;
                } else {
                    $scope.subcategory = chosenCategory;
                    var array = [{cName:"Інші життєві ситуації",items:[]}];
                    $scope.subcategory.aServiceTag_Child.forEach(function (item) {
                        var from = item.sName_UA.indexOf('[');
                        var to = item.sName_UA.indexOf(']');
                        if(from != -1 && to!=-1) {
                            var catName = item.sName_UA.slice(from + 1, to);
                            var obj = array.find(function (element) {
                                return element.cName == catName
                            })
                            item.sName_UA = item.sName_UA.substr(to + 1);
                            if (!obj) {
                                array.push({cName: catName, items: [item]});
                            } else {
                                obj.items.push(item);
                            }
                        }else{
                            var obj = array.find(function (element) {
                                return element.cName == "Інші життєві ситуації"
                            })
                            obj.items.push(item);
                        }
                    })
                    var objAnother = array.find(function (element) {
                        return element.cName == "Інші життєві ситуації"
                    })
                    if(objAnother.items.length==0){
                        array = array.filter(function (val) {
                            return val.cName != "Інші життєві ситуації"
                        })
                    }
                    $scope.subcategory.aServiceTag_Child = array.reverse();
                }
                $scope.stateCheck = $state.params.catID;

                $scope.$on('$stateChangeStart', function (event, toState) {
                    if (toState.resolve) {
                        $scope.spinner = true;
                    }
                });
                $scope.$on('$stateChangeError', function (event, toState) {
                    if (toState.resolve) {
                        $scope.spinner = false;
                    }
                });
                try {
                    var tag = $scope.subcategory.oServiceTag_Root.sName_UA;
                    TitleChangeService.setTitle(tag);
                } catch (e) {
                }
                $anchorScroll();
            }]);
