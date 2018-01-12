angular.module('finatwork').factory('fintaxService', function ($http, $q, broadcastService) {

    var service = {};
    var _data = {};
    var _basic = {};
    var _svcStatus = false;
    var subscriptionInitialised = false;
    var finTaxOptInitialised = false;
    var finTaxBasicInitialised = false;


    var getFinTaxOpt = function () {//TODO requried?
        $http({
            method: 'GET',
            url: window.link.fintaxopt + '/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data) {
                finTaxOptInitialised = true;
                _data = response.data;
                /*Will be used later, don't remove.*/
                //broadcastService.send('updated', _data);

            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    service.reset = function () {
        _svcStatus = false;
        _data = {};
        finTaxOptInitialised = false;
        subscriptionInitialised = false;
    };

    service.getState = function () {//TODO check if requred
        return _data.state;
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
                    if (payment.trxnid && (payment.name == "FinTax" || payment.name == "FinComprehensive") && payment.status == "Credit") {
                        _svcStatus = true;
                    }
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

    service.getBasicInfo = function (year) {
        var dfd = $q.defer();
        if (finTaxBasicInitialised) {
            dfd.resolve(_basic);
        } else {
            var url = window.link.fintaxbasic + '/' + getUserId();
            if (year) url = url + "?year=" + year;
            $http({
                method: 'GET',
                url: url,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    finTaxBasicInitialised = true;
                    _basic = response.data;
                    /*Will be used later, don't remove.*/
                    //broadcastService.send('updated', _data);
                }
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };

    service.setBasicInfo = function (data) {
        var dfd = $q.defer();
        if (data !== null) {
            data._userid = getUserId();
            data.year = currentFinancialYear();
            $http({
                method: 'POST',
                url: window.link.fintaxbasic,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                _basic = data;
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };

    service.getInfo = function (type, year) {
        var dfd = $q.defer();
        if (finTaxOptInitialised) {
            dfd.resolve(_data);
        } else {
            var url = window.link.fintaxopt + '/' + getUserId();
            if (year) url = url + "?year=" + year;
            $http({
                method: 'GET',
                url: url,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data) {
                    finTaxOptInitialised = true;
                    _data = response.data;
                    /*Will be used later, don't remove.*/
                    //broadcastService.send('updated', _data);
                }
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };

    service.setInfo = function (type, data) {
        var dfd = $q.defer();
        _data[type] = data;
        if (_data !== null) {
            _data._userid = getUserId();
            _data.year = currentFinancialYear();
            var url = window.link.fintaxopt;
            if (finTaxOptInitialised) {
                url = window.link.fintaxopt + "/" + getUserId();
            }
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

    // service.setHouseProperty = function (data) {
    //     check with Neeti if this behaviour is required. as it will over write user's initial selection
    //     if(data && _basic.houseProp == 'no'){
    //         _data.basic.houseProp = 'yes';
    //     }
    //     _data.house = data;
    //     setFinTaxOpt("house");
    // };

    service.formSubmitted = function () {
        getFinTaxOpt();//TODO check if correct
    };

    return service;
});