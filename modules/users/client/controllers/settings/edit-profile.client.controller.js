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
      alert(documents);
      if (documents && documents !== undefined) {
        var users = JSON.parse(documents);
        if (users && users.length > 0) {
          users.forEach(function (user) {
            $http.post('/api/users/genarate', user).then(function (res) {
              console.log(res);
            }, function (err) {
              alert(users.firstName + 'genarate Failed : ' + err.data.message);
            });
          });
        }
      }
    };


  }
]);
