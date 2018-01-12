/**
 * Created by Asad on 21/04/17.
 */
angular.module('finatwork').factory('fintaxFilingService', function ($http, $q) {

    var service = {};
    var _data = {};
    var _bank = [];
    var _personal = {};
    var _investment = {};
    var personalEditable = false;
    var bankEditable = false;
    var finTaxFilingInitialised = false;
    var personalInitialised = false;
    var bankInitialised = false;

    service.reset = function () {
        _data = {};
        finTaxFilingInitialised = false;
        personalInitialised = false;
        bankInitialised = false;
    };
    //personal
    service.getPersonalInfo = function (year) {
        var dfd = $q.defer();
        if (personalInitialised) {
            dfd.resolve(_personal);
        } else {
            var url = window.link.fintaxpersonal + '/' + getUserId();
            if (year) url = url + "?year=" + year;
            $http({
                method: 'GET',
                url: url,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    personalInitialised = true;
                    personalEditable = true;//TODO check if required
                    _personal = response.data;
                }
                dfd.resolve(_personal);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };
    service.setPersonalInfo = function (data) {
        var dfd = $q.defer();
        _personal = data;
        if (data !== null) {
            _personal._userid = getUserId();
            _personal.year = prevFinancialYear();
            var url = window.link.fintaxpersonal;
            if (personalEditable) url = window.link.fintaxpersonal + '/' + getUserId();
            $http({
                method: 'POST',
                url: url,
                data: _personal,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };
    //Bank info
    service.getBankInfo = function (year) {
        var dfd = $q.defer();
        if (bankInitialised) {
            dfd.resolve(_bank);
        } else {
            var url = window.link.fintaxbank + '/' + getUserId();
            if (year) url = url + "?year=" + year;
            $http({
                method: 'GET',
                url: url,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    bankInitialised = true;
                    bankEditable = true;//TODO check if reqd
                    _bank = response.data.bank;
                }
                dfd.resolve(_bank);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data);
            });
        }
        return dfd.promise;
    };
    service.setBankInfo = function (data) {
        var dfd = $q.defer();
        _bank = data;
        if (_bank !== null) {
            var data = {
                _userid: getUserId(),
                year: prevFinancialYear(),
                bank: data
            };
            var url = window.link.fintaxbank;
            if (bankEditable) url = window.link.fintaxbank + '/' + getUserId();
            $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };
    //generic
    service.getInfo = function (type, year, forceget) {
        var dfd = $q.defer();
        if (finTaxFilingInitialised && forceget  === undefined) {
            dfd.resolve(_data);
        } else {
            var url = window.link.fintaxfiling + '/' + getUserId();
            if (year) url = url + "?year=" + year;
            $http({
                method: 'GET',
                url: url,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    _data = response.data;
                    finTaxFilingInitialised = true;
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
            _data.year = prevFinancialYear();
            var url = window.link.fintaxfiling;
            if (finTaxFilingInitialised == true) url = window.link.fintaxfiling + '/' + getUserId();
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

//TODO
//basic as different collection/router
//how to call post and post:/id
//show copy only when optimization values available