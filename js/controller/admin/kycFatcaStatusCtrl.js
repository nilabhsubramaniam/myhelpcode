/**
 * Created by Finatwork on 28-01-2017.
 */
function kycFatcaStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.kycFatca,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        $scope.kycs = response.data;
        // $scope.fatca=response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('kycFatcaStatusCtrl', kycFatcaStatusCtrl);
/**
 * Created by Finatwork on 30-01-2017.
 */
