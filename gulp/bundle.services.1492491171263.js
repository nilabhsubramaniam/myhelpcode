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


angular.module('finatwork').factory('fintaxService', function ($http, $q) {

    var service = {};
    var _data = {};
    var _svcStatus = false;
    var subscriptionInitialised = false;
    var finTaxOptInitialised = false;

    var getSubscriptionStatus = function () {
        console.log("FinTaxSvc getSubscriptionStatus");
        $http({
            method: 'GET',
            url: window.link.pg + '/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            subscriptionInitialised = true;
            response.data.forEach(function (payment) {
                if (payment.trxnid && payment.name == "FinTax" && payment.status == "Credit") {
                    _svcStatus = true;
                    return _svcStatus;
                }
            });
        }, function errorCallback(response) {
            console.log("response.error")
        });
    };

    var getFinTaxOpt = function () {
        console.log("FinTaxSvc getFinTaxOpt");
        $http({
            method: 'GET',
            url: window.link.fintaxopt + '/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            finTaxOptInitialised = true;
            if (response.data) {
                _data = response.data
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };


    function setFinTaxOpt(category) {
        var dfd = $q.defer();
        if (_data !== null) {
            _data._userid = getUserId();
            var url = window.link.fintaxopt;
            if (category !== "basic") {
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
    }

    service.initialiseSubscription = function () {
        console.log("fintaxsvc initialiseSubscription");
        if(!subscriptionInitialised) getSubscriptionStatus()
    };

    service.initialiseFinTaxOpt = function () {
        console.log("fintaxsvc initialiseFinTaxOpt");
        if(!finTaxOptInitialised) getFinTaxOpt();
    };

    service.reset = function(){
        console.log("fintaxsvc reset");
        _svcStatus = false;
        _data = {};
        finTaxOptInitialised = false;
        subscriptionInitialised = false;
    };

    service.isFinTaxOptInitialised = function () {
        return finTaxOptInitialised;
    };

    service.isSubscriptionInitialised = function () {
        return subscriptionInitialised;
    };

    service.getSubscriptionStatus = function () {
        return _svcStatus;
    };

    service.getBasicInfo = function () {
        return _data.basic;
    };
    service.setBasicInfo = function (data) {
        _data.basic = data;
        setFinTaxOpt("basic");
    };
    service.getHouseProperty = function () {
        return _data.house;
    };
    service.setHouseProperty = function (data) {
        _data.house = data;
        setFinTaxOpt("house");
    };
    service.getRentInfo = function () {
        return _data.rent;
    };
    service.setRentInfo = function (data) {
        _data.rent = data;
        setFinTaxOpt("rent");
    };
    service.getInvestmentInfo = function () {
        return _data.investments;
    };
    service.setInvestmentInfo = function (data) {
        _data.investments = data;
        setFinTaxOpt("investments");
    };
    service.getHealthInsuranceInfo = function () {
        return _data.healthInsurance;
    };
    service.setHealthInsuranceInfo = function (data) {
        _data.healthInsurance = data;
        setFinTaxOpt("healthInsurance");
    };
    service.getOtherInfo = function () {
        return _data.other;
    };
    service.setOtherInfo = function (data) {
        _data.other = data;
        setFinTaxOpt("other");
    };

    return service;
})
;