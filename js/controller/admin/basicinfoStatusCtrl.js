/**
 * Created by Finatwork on 28-01-2017.
 */
function basicinfoStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.basics,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (basic) {
            basic.dob = moment(basic.dob).format('YYYY-MM-DD');
        });
        $scope.basics = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('basicinfoStatusCtrl', basicinfoStatusCtrl);

