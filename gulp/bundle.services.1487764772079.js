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

