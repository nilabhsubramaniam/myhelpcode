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