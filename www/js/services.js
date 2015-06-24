angular.module('starter.services', [])
    .value("myConfig", {
        url: "http://www.smslive247.com/http/index.aspx?"
    })
    .service('LoginService', function ($q, myConfig, $http) {
        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;
                $http.get(myConfig.url + 'cmd=login&owneremail=nwambachristian@gmail.com&subacct=' + name + ' &subacctpwd=' + pw).success(function (res) {
                    if (res === 'ERR: 402: Invalid password.Invalid Username or Password.') {
                        deferred.reject('Wrong credentials');
                    } else {
                        deferred.resolve(res);
                    }
                });
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    })

.factory('Message', function ($http, myConfig) {
    var msg = {};
    msg.send = function (token, msg, sender, sendto) {
        var url = myConfig.url + 'cmd=sendmsg&sessionid=' + token + '&message=' + msg + ' &sender=' + sender + '&sendto=' + sendto + '&msgtype=0';

        return $http.get(url);
    };
    msg.bal = function (token) {
        var url = myConfig.url + 'cmd=querybalance&sessionid=' + token;
        return $http.get(url);
    };
    msg.querymsgbal = function (token, msgid) {
        var url = myConfig.url + 'cmd=querymsgcharge&sessionid=' + token + '&messageid=' + msgid;
        return $http.get(url);
    };
    msg.status = function (token, msgid) {
        var url = myConfig.url + 'cmd=querybalance&sessionid=' + token + '&messageid=' + msgid;
        return $http.get(url);
    };
    msg.recharge = function (token, code) {
        var url = myConfig.url + 'cmd=recharge&sessionid=' + token + '&rcode=' + code;
        return $http.get(url);
    }
    msg.sent = function (token) {
        var url = myConfig.url + 'cmd=getsentmsgs&sessionid=' + token + '&pagesize=50&pagenumber=1&begindate=' + getdate() +
            '&enddate=' + getdate(10);
        console.log(url);
        return $http.get(url);
    };
    return msg;
})

.factory('$localstorage', ['$window', function ($window) {
    return {
        set: function (key, value) {
            $window.localStorage[key] = value;
        },
        get: function (key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function (key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function (key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);

function getdate(back) {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (back) {
        dd - 5;
    }

    //    if (dd < 10) {
    //        dd = '0' + dd
    //    }
    //
    //    if (mm < 10) {
    //        mm = '0' + mm
    //    }

    today = dd + '/' + mm + '/' + yyyy;
    return today;
}