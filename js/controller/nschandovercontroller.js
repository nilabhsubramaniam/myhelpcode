function nscHandOverCtrl($http, $scope, $state) {
    $scope.IsSipAvailable = $state.params.sip;
    $scope.dynamicStep4 = ($scope.IsSipAvailable === "true") ? "Step 4:":"Step 3:"
    $scope.init = function(){

    };
}

angular.module('finatwork').controller('nscHandOverCtrl', nscHandOverCtrl);