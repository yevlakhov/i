angular.module('404', []).config(function ($stateProvider, $urlRouterProvider) {
    // console.log($stateProvider, $urlRouterProvider);
    $urlRouterProvider.otherwise('/404');
    $stateProvider
        .state('404', {
            url: '/404',
            views: {
                '': {
                    templateUrl: 'app/404/404.html'
                }
            }
        })
}).controller('fourCtr',function ($scope,stateStorageService) {
    console.log($scope);
    console.log(stateStorageService);
    $scope.sSearch = '';
    var state = {
        sSearch: '',
        operator: -1,
        selectedStatus: -1,
        bShowExtSearch: false,
        data: {
            region: null,
            city: null
        }
    };


    $scope.$watch('sSearch', function () {
        state.sSearch = $scope.sSearch;
        if(state.sSearch.length >=3){
            stateStorageService.setState('igovSearch', state);
            window.state.go('index');
        }

    });
});
