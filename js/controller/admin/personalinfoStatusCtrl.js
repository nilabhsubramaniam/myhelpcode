/**
 * Created by Finatwork on 28-01-2017.
 */
function personalinfoStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.personal,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (personal) {
            personal.dob = moment(personal.dob).format('YYYY-MM-DD');
        });
        $scope.personals = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('personalinfoStatusCtrl', personalinfoStatusCtrl);
