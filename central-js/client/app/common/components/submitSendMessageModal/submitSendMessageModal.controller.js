'use strict';

angular.module('app')
  .controller('submitSendMessageModalController', function($scope, $modalInstance, title, message) {

    $scope.title = title;
    $scope.message = message.message;
    var recapcha;

    setTimeout(function () {
      var verifyCallback = function (response) {
        recapcha = response;
      };
      grecaptcha.render($('#g_recaptcha')[0], {
        'sitekey': '6LcsfxIUAAAAAOTLDTgZUaW9dj99_BjOFG8bpaGl',
        callback: verifyCallback
      });
    },100);

    $scope.close = $modalInstance.close;

    $scope.send = function () {

      $.ajax({
        url:'/api/messages/sendMail',
        type:"POST",
        body:{
          message:message.mailInputText
        },
        headers: {
          "g-recapcha-response": recapcha
        }
      }).success(function () {
        $modalInstance.close();
      })
    }
  });
