angular.module('unavailable', [])
  .config(['$httpProvider', '$stateProvider', unavailableConfig]);

function unavailableConfig($httpProvider, $stateProvider) {
  $stateProvider
    .state('unavailable', {
      url: '/unavailable',
      template: ''
      + '<div class="i-nav"><div class="container"><span class="navbar-brand">iGov</span></div></div>'
      + '<h2 class="text-center"><div class="container">Не хвилюйтеся, проводяться регламентні роботи. Скоро все буде добре, навіть краще, ніж раніше :)</div></h2>'
    });

  $httpProvider.interceptors.push(function ($q, $injector) {
    return {
      responseError: function (rejection) {
        if (rejection.status === 502) {
          $injector.get('$state').go('unavailable');
        }
        return $q.reject(rejection);
      }
    };
  });
}