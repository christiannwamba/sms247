angular.module('starter.controllers', ['ionic-datepicker'])
    .value("myConfig", {
        url: "http://www.smslive247.com/http/index.aspx?"
    })
    .constant('$ionicLoadingConfig', {
        template: '<ion-spinner icon="spiral" class="spinner-stable"></ion-spinner>'
    })
    .controller('LoginCtrl', function ($scope, $http, myConfig, LoginService, $ionicPopup, $state, $ionicLoading, $localstorage) {
        $scope.user = {};
        $scope.login = function () {
            $ionicLoading.show();
            LoginService.loginUser($scope.user.subacc, $scope.user.subaccpass).success(function (data) {
                $localstorage.set('token', data)
                $ionicLoading.hide();
                $state.go('tab.dash');
            }).error(function (data) {
                console.log(data);
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Please check your email, username and password!'
                });
            });
        }
    })

.controller('DashCtrl', function ($scope, $localstorage, Message) {
    if (typeof $localstorage.get('token') === 'undefined') {
        $location.path('login');
    }
    $scope.token = $localstorage.get('token').slice(4);
    var token = $localstorage.get('token').slice(4);
    Message.bal(token).success(function (res) {
        $scope.bal = sliceText(4, res);
    });
    Message.sent(token).success(function (res) {
        $scope.msg = res;
    });
})

.controller('ChatsCtrl', function ($scope, Message, $ionicLoading, $localstorage, $cordovaCamera, $rootScope, $ionicPlatform, $ionicPopup) {
    if (typeof $localstorage.get('token') === 'undefined') {
        $location.path('login');
    }
    if (typeof String.prototype.startsWith != 'function') {
        String.prototype.startsWith = function (str) {
            return this.indexOf(str) === 0;
        };
    }
    $scope.message = {};
    var token = $localstorage.get('token').slice(4);
    $scope.send = function () {
        if (typeof $scope.message.to === 'undefined') {
            var alertPopup = $ionicPopup.alert({
                title: 'Error!!!',
                template: 'Please add a phone number'
            });
            return;
        }
        if (typeof $scope.message.as === 'undefined') {
            var alertPopup = $ionicPopup.alert({
                title: 'Error!!!',
                template: 'Please add an alias'
            });
            return;
        }
        if (typeof $scope.message.msg === 'undefined') {
            var alertPopup = $ionicPopup.alert({
                title: 'Error!!!',
                template: 'Please enter a message'
            });
            return;
        }
        $ionicLoading.show();

        Message.send(token, $scope.message.msg, $scope.message.as, $scope.message.to).success(function (data) {
            if (data.startsWith('OK')) {
                Message.querymsgbal(token, sliceText(4, data)).success(function (msgbal) {
                    Message.bal(token).success(function (bal) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Successful!!',
                            template: 'Your message was sent successful <p>Your sms was charged ' + sliceText(4, msgbal) + ' and balance is ' + sliceText(4, bal) + '</p>'
                        });
                    });
                });
            } else {

                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: 'Failed!!',
                    template: sliceText(9, data)
                });
            }
        })
    }
})

.controller('ChatDetailCtrl', function ($scope, $stateParams, Message, $localstorage, $ionicLoading, $ionicPopup) {
    $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function ($scope, Message, $localstorage, $ionicLoading, $ionicPopup, $location) {
    if (typeof $localstorage.get('token') === 'undefined') {
        $location.path('login');
    }
    var token = $localstorage.get('token').slice(4);
    $scope.settings = {
        enableFriends: true
    };
    $scope.logout = function () {
        $localstorage.set('token', '');
        $location.path('login');
    };
    $scope.recharge = function (code) {
        $ionicLoading.show();
        Message.recharge(token, code).success(function (data) {
            $ionicLoading.hide();
            if (data.startsWith('OK')) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Success!!',
                    template: sliceText(4, data)
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Failed!!',
                    template: sliceText(9, data)
                });
            }
        });
    }
});

function sliceText(index, text) {
    return text.slice(index);
}