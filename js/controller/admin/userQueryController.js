/*Created on 29-March-2017*/
function userQuesryStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.userQuery,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        $scope.userQuery = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('userQuesryStatusCtrl', userQuesryStatusCtrl);

