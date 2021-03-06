angular.module('bgmarsApp')
.controller('loginController', function($rootScope, $scope, $state, authService) {

    if (localStorage.accessToken && localStorage.tokenType) {
        $state.go('root');
    }

    $scope.messages = [];
    $scope.credentials = {
        colonistID: '',
        password: ''
    };
    $scope.emailIsValid = false;

    $scope.validateEmail = function(email) {
        $scope.emailIsValid = /^[a-zA-Z0-9]{2,8}@[0-9]{4}.[a-z]{2}$/.test(email);
    }

    $scope.login = function() {
        authService.login($scope.credentials.colonistID, $scope.credentials.password)
        .then(function(response) {
            localStorage.accessToken = response.data.token.accessToken;
            localStorage.tokenType = response.data.token.tokenType;
            $state.go('root');
        })
        .catch(function(response) {
            $scope.messages = [];
            if (response.data.code === 401) {
                $scope.messages.push(response.data.message);
            } else if (response.data.code === 400) {
                response.data.errors.forEach(function(error) {
                    $scope.messages.push(...error.messages);
                });
            }
        });
    };

});