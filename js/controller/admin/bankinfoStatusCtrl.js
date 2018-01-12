/**
 * Created by Finatwork on 28-01-2017.
 */
function bankinfoStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.bank,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {

        $scope.bank = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('bankinfoStatusCtrl', bankinfoStatusCtrl);
