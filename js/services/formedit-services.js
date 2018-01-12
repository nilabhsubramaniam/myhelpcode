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