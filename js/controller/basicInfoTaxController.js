/**
 * Created by Finatwork on 03-04-2017.
 */
function basicInfoTaxCtrl($scope, $state, fintaxService) {
    $scope.init = function () {
        fintaxService.getBasicInfo('finTax').then(function (response) {
            if(response != null){
                $scope.basicInfoTaxFormData = response;
            } else {
                console.log('basicInfo empty');
            }
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.finTaxBasicInfo = function () {
        fintaxService.setBasicInfo($scope.basicInfoTaxFormData);
        $state.go('dashboards.fintax');
    };
}
angular.module('finatwork').controller('basicInfoTaxCtrl', basicInfoTaxCtrl);
