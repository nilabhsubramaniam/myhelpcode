angular.module('finatwork').service('thousandSeparator', function SeparatorCtrl() {
  this.thousandSeparator = function (value){
    var res = value;
    if(value > 0) {
      value = value.toString();
      var lastThree = value.substring(value.length - 3);
      var otherNumbers = value.substring(0, value.length - 3);
      if (otherNumbers != '')
        lastThree = ',' + lastThree;
      res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    }
    return res;
  };
});
angular.module('finatwork').service('convertDigitsIntoWords', function SeparatorCtrl() {
    this.inWords = function (num){
        if(num) {
            var a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
            var b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
            if ((num = num.toString()).length > 11) return 'overflow';
            n = ('0000000000' + num).substr(-11).match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!n) return;
            var str = '';
            str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Arab ' : '';
            str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Crore ' : '';
            str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Lakh ' : '';
            str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Thousand ' : '';
            str += (n[5] != 0) ? (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'Hundred ' : '';
            str += (n[6] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[6])] || b[n[6][0]] + ' ' + a[n[6][1]]) + 'only ' : '';
            return str;
        }
    };
});
angular.module('finatwork').factory('commonServices', function(){
  var service = {};
  var _data = false;

  service.setIsEditable = function(data){
    _data = data;
  };
  service.getIsEditable = function(){
    return _data;
  };
  return service;
});
angular.module('finatwork').factory('formEditService', function(){
  var service = {};
  var _data = {personal: false,
  bank: false,
  nominee: false,
  kyc: false,
  docs: false,
  service: false,
  account: false};

  service.setIsEditable = function(data){
    _data = data;
  };
  service.getIsEditable = function(){
    return _data;
  };
  return service;
});
angular.module('finatwork').factory('Scopes', function ($rootScope) {
  var mem = {};

  return {
    store: function (key, value) {
      $rootScope.$emit('scope.stored', key);
      mem[key] = value;
    },
    get: function (key) {
      return mem[key];
    }
  };
});


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

    service.reset = function(){
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
            dfd.resolve(subscriptionInitialised);
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
                });
                dfd.resolve(subscriptionInitialised);
            }, function errorCallback(response) {
                console.log("response.error");
                dfd.reject(response.data);
            });
        }
        return dfd.promise;
    };

    service.getBasicInfo = function () {
        var dfd = $q.defer();
        if (finTaxBasicInitialised) {
            dfd.resolve(_basic);
        } else {
            $http({
                method: 'GET',
                url: window.link.fintaxbasic + '/' + getUserId(),
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

    service.getInfo = function (type) {
        var dfd = $q.defer();
        if (finTaxOptInitialised) {
            dfd.resolve(_data);
        } else {
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
                dfd.resolve(response.data);
            }, function errorCallback(response) {
                console.log(response);
                dfd.reject(response.data)
            });
        }
        return dfd.promise;
    };

    service.setInfo = function(type, data){
        var dfd = $q.defer();
        _data[type] = data;
        if (_data !== null) {
            _data._userid = getUserId();
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
/**
 * Created by Asad on 10/05/17.
 */

angular.module('finatwork').factory('broadcastService', function($rootScope) {
    return {
        send: function(msg, data) {
            $rootScope.$broadcast(msg, data);
        }
    }
});

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

    function setFinTaxBankInfo(banks) {
        var dfd = $q.defer();
        if (banks !== null) {
            var data = {
                _userid: getUserId(),
                bank: banks
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
    }

    function setFinTaxPersonalInfo(data) {
        var dfd = $q.defer();
        if (data !== null) {
            _personal._userid = getUserId();
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
    }

    var getFinTaxFiling = function () {
        $http({
            method: 'GET',
            url: window.link.fintaxfiling + '/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data) {
                _data = response.data
                finTaxFilingInitialised = true;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    function setFinTaxFiling(category) {
        var dfd = $q.defer();
        if (_data !== null) {
            _data._userid = getUserId();
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
    }

    service.reset = function () {
        _data = {};
        finTaxFilingInitialised = false;
        personalInitialised = false;
        bankInitialised = false;
    };

    service.getPersonalInfo = function () {
        var dfd = $q.defer();
        if (personalInitialised) {
            dfd.resolve(_personal);
        } else {
            $http({
                method: 'GET',
                url: window.link.fintaxpersonal + '/' + getUserId(),
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
        _personal = data;
        setFinTaxPersonalInfo(_personal);
    };
    //Bank info
    service.getBankInfo = function () {
        var dfd = $q.defer();
        if (bankInitialised) {
            dfd.resolve(_bank);
        } else {
            $http({
                method: 'GET',
                url: window.link.fintaxbank + '/' + getUserId(),
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
        _bank = data;
        setFinTaxBankInfo(_bank);
    };

    service.getInfo = function (type) {
        var dfd = $q.defer();
        if (finTaxFilingInitialised) {
            dfd.resolve(_data);
        } else {
            $http({
                method: 'GET',
                url: window.link.fintaxfiling + '/' + getUserId(),
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
    service.getSalaryIncome = function () {
        return _data.salary;
    };
    service.setSalaryIncome = function (data) {
        _data.salary = data;
        setFinTaxFiling("salary");
    };
    service.getHouseProperty = function () {
        return _data.house;
    };
    service.setHouseProperty = function (data) {
        _data.house = data;
        setFinTaxFiling("house");
    };
    service.getCapitalGainsInfo = function () {
        return _data.capGain;
    };
    service.setCapitalGainsInfo = function (data) {
        _data.capGain = data;
        setFinTaxFiling("capGain");
    };
    service.getOtherSrcInfo = function () {
        return _data.otherSource;
    };
    service.setOtherSrcInfo = function (data) {
        _data.otherSource = data;
        setFinTaxFiling("otherSource");
    };
    service.getEmploymentInfo = function () {
        return _data.employment;
    };
    service.setEmploymentInfo = function (data) {
        _data.employment = data;
        setFinTaxFiling("employment");
    };
    service.getOtherIncome = function () {
        return _data.otherIncome;
    };
    service.setOtherIncome = function (data) {
        _data.otherIncome = data;
        setFinTaxFiling("otherIncome");
    };
    service.getInvestmentInfo = function () {
        return _data.investments;
    };
    service.setInvestmentInfo = function (data) {
        _data.investments = data;
        setFinTaxFiling("investments");
    };
    service.getHealthInsuranceInfo = function () {
        return _data.healthInsurance;
    };
    service.setHealthInsuranceInfo = function (data) {
        _data.healthInsurance = data;
        setFinTaxFiling("healthInsurance");
    };
    function isEmpty(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }

    return service;
})
;

//TODO
//basic as different collection/router
//how to call post and post:/id
//show copy only when optimization values available