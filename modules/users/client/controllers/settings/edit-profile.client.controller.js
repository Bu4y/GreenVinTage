'use strict';

angular.module('users').controller('EditProfileController', ['$scope', '$http', '$location', 'Users', 'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;

    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      $scope.success = $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = new Users($scope.user);

      user.$update(function (response) {
        $scope.$broadcast('show-errors-reset', 'userForm');

        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };


    // [{
    //   "firstName": "test",
    //   "lastName": "test",
    //   "displayName": "test test",
    //   "email": "test2@test2.com",
    //   "tel": "tel2",
    //   "username": "mrtest",
    //   "provider": "local",
    //   "shop": {
    //     "name": "ร้านค้าทดสอบ"
    //   }
    // }]


    $scope.executes = function (documents) {
      if (documents && documents !== undefined) {
        var i = 0;
        var Orlength = 0;
        var pushError = [];
        var users = JSON.parse(documents);
        if (users && users.length > 0) {
          Orlength = users.length;
          users.forEach(function (user) {
            $http.post('/api/users/genarate', user).then(function (res) {
              console.log(res);
              i++;
              if (i === Orlength) {
                var successLength = Orlength - pushError.length;
                alert('บันทึกข้อมูลเรียบร้อยแล้ว : ' + successLength + ' รายการ ผิดพลาด : ' + pushError.length + ' รายการ');
                i = 0;
                $scope.execute = null;
                return;
              }
            }, function (err) {
              pushError.push({
                user: user,
                error: err.data.message
              });
              i++;
              if (i === Orlength) {
                var successLength = Orlength - pushError.length;
                console.log(pushError);
                alert('บันทึกข้อมูลเรียบร้อยแล้ว : ' + successLength + ' รายการ ผิดพลาด : ' + pushError.length + ' รายการ');
                i = 0;
                $scope.execute = null;
                return;
              }
            });
          });
        }
      }
    };


  }
]);
