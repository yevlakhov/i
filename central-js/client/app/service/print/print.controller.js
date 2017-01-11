angular.module('app').controller('SituationControllerPrint', function ($scope, AdminService, ServiceService, chosenCategory, messageBusService, statesRepository, $rootScope, $sce, $anchorScroll, TitleChangeService, $location) {
    $scope.bShowSpinner = false;
    $scope.situation = chosenCategory.aServiceTag_Child[0]
    $('link').remove();
    $scope.trustAsHtml = function (string) {
        if (statesRepository.isKyivCity()) {
            return $sce.trustAsHtml(string.replace(new RegExp('igov.org.ua', 'g'), 'es.kievcity.gov.ua').replace(new RegExp('iGov.org.ua', 'g'), 'es.kievcity.gov.ua').replace(new RegExp('iGOV.org.ua', 'g'), 'es.kievcity.gov.ua').replace(/\b[Ii][Gg][Oo][Vv]\b/g, 'KievCity')/*.replace(new RegExp('es\.kievcity\.gov\.ua\/wf\/', 'g'), 'igov.org.ua/wf/')*/);
        } else {
            return $sce.trustAsHtml(string);
        }
    };
    // $scope.$on('$stateChangeError', function(event, toState) {
    //   if (toState.resolve) {
    //     $scope.spinner = false;
    //   }
    // });
});