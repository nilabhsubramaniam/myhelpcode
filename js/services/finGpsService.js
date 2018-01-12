/**
 * Created by Suraj Kumar on 07-Sep-17.
 */

angular.module('finatwork').factory('finGpsService', function ($http, $q) {
    var service = {};
    var _data = {};
    var _basic = {};
    var _work ={};
    var _personal ={};
    var _svcStatus = false;
    var subscriptionInitialised = false;
    var finGpsInitialised = false;
    var basicInitialised = false;
    var workInitialised = false;
    var personalInitialised = false;

    service.reset = function () {
        _data = {};
        finGpsInitialised = false;
        basicInitialised = false;
        workInitialised = false;
        personalInitialised =false;
    };

    //Basic info
    service.getBasicInfo = function () {
        var dfd = $q.defer();
        if (basicInitialised) {
            dfd.resolve(_basic);
        } else {
            $http({
                method: 'GET',
                url: window.link.basics + '/' + getUserId(),
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    basicInitialised = true;
                    _basic = response.data;
                }
                dfd.resolve(_basic);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data);
            });
        }
        return dfd.promise;
    };
    service.getSubscriptionStatus = function () {
        var dfd = $q.defer();
        if (subscriptionInitialised) {
            dfd.resolve(_svcStatus);
        } else {
            $http({
                method: 'GET',
                url: window.link.pg + '/' + getUserId(),
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                subscriptionInitialised = true;
                response.data.forEach(function (payment) {
                    if (payment.trxnid && (payment.name == "FinGPS" || payment.name == "FinComprehensive") && payment.status == "Credit") {
                        _svcStatus = true;
                    }
                });
                dfd.resolve(_svcStatus);
            }, function errorCallback(response) {
                console.log("response.error");
                dfd.reject(response.data);
            });
        }
        return dfd.promise;
    };
    service.getInfo = function (type, year) {
        var dfd = $q.defer();
        if (finGpsInitialised) {
            dfd.resolve(_data);
        } else {
            $http({
                method: 'GET',
                url: window.link.finGps + '/' + getUserId(),
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    finGpsInitialised = true;
                    _data = response.data;
                }
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data);
            });
        }
        return dfd.promise;
    };

    service.setInfo = function (type, data) {
        var dfd = $q.defer();
        _data[type] = data;
        if (_data !== null) {
            _data._userid = getUserId();
            var url = window.link.finGps;
            if (finGpsInitialised == true) url = window.link.finGps + '/' + getUserId();
            $http({
                method: 'POST',
                url: url,
                data: _data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };

    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    return service;
});