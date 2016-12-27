(function () {
  'use strict';

  angular.module('app')
    .directive('buttonCreateCookie', buttonCreateCookie);

  function buttonCreateCookie() {
    return {
      restrict: 'EA',
      scope: {},
      templateUrl: 'app/common/components/buttonCreateCookie/buttonCreateCookie.directive.html',
      controller: ButtonCreateCookieController,
      controllerAs: 'vm',
      bindToController: true
    };
  }

  function ButtonCreateCookieController($scope) {
    var vm = this;
    var cookieName = 'authMock';

    vm.onChange = onChange;

    vm.enable = typeof window.cookiesFunc.get(cookieName) !== 'undefined';

    function onChange() {
      console.log(vm.enable);
      vm.enable = !vm.enable;
      if (vm.enable) {
        window.cookiesFunc.set(cookieName, 'MockUser', {
          path: "/",
          expires: 180
        });
      } else if (!vm.enable) {
        window.cookiesFunc.delete(cookieName, 'MockUser');
      }
    }

    vm.isVisible = function () {
      if ($scope.$root.profile.isKyivCity && getCookie('bServerTest') !== 'true') return false;
      return window.cookiesFunc.get('bServerTest') === 'true';
    };
  }
})();
