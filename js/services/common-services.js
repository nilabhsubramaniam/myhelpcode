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