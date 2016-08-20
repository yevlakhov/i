angular.module('app')
  .controller(
    'senderController',
    [
      '$scope',
      '$location',
      'UserService',
      'md5',
      function($scope, $location, UserService, md5) {

        UserService.isLoggedIn().then(function (result) {
          UserService.fio().then(function (res) {
            var userPIP = capitalize(res.firstName)
              + ' ' +
              capitalize(res.middleName)
              + ' ' +
              capitalize(res.lastName);
              console.log('session data' + JSON.stringify(res))
              var jsonData = {
                name: userPIP,
                id: '' + res.subjectID,
                data: [
                  {
                    title: res.subjectID,
                    key: 'nID',
                    value: res.subjectID,
                    show: false
                  },
                  {
                    title: res.phone,
                    key: 'phone',
                    value: res.phone,
                    show: true
                  },
                  {
                    title: res.email,
                    key: 'email',
                    value: res.email,
                    show: true
                  }
                ],
              };
            console.log('data for sender' + JSON.stringify(jsonData))
              var time = Math.floor(new Date().getTime() / 1000);
              var secret = 'eyJpZCI6IjEyMyIsIm5';  // TODO: move to config

              function utf8_to_b64(str) {
                return btoa(
                  encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
                      function(match, p1) {
                        return String.fromCharCode('0x' + p1);
                      }
                  )
                );
              }
              var userBase64 = utf8_to_b64(JSON.stringify(jsonData));
              var sign = md5.createHash(secret + userBase64 + time);

              var auth = userBase64 + '_' + time + '_' + sign;

              if(typeof SenderWidget !== 'undefined') {
                SenderWidget.init({
                  auth: auth,
                  companyId: 'i5472912406',  // TODO: move to config
                  lang: 'uk',
                  location: $location.absUrl(),
                });
              }

          });
        }, function () {
          // Init anonymous sender when user is not logged in
          if(typeof SenderWidget !== 'undefined') {
            SenderWidget.init({
              companyId: 'i5472912406',
              lang: 'uk',
              location: $location.absUrl(),
            });
          }
        });

        function capitalize(string) {
          return string !== null &&
                 string !== undefined ?
                 string.charAt(0).toUpperCase() +
                 string.slice(1).toLowerCase() : '';
        }

      }
    ]
  );
