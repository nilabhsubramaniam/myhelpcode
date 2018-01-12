function userDashboard($scope, $state, $http, $window, $q) {
    $scope.userStatus = [];
    $scope.userDefaultStatus = {};
    $scope.init = function () {
        getDefaultUserStatus();
    };

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var sortStatus = [];
                var userStatus = response.data.registration;
                for(var i in $scope.userDefaultStatus){
                    sortStatus.push({
                        status: i,
                        display: $scope.userDefaultStatus[i],
                        date: '',
                        isactive: false
                    });
                }
                userStatus.forEach(function (userElem) {
                    sortStatus.forEach(function (sortElem) {
                        if (sortElem.status === userElem.status) {
                            sortElem.isactive = true;
                            sortElem.date = moment(userElem.notes[0].date).format('DD-MMM-YYYY');
                        }
                    });
                });
                $scope.userStatus = sortStatus;
            } catch (e) {

            }
        }, function errorCallback(response) {

        });
    }

    function getDefaultUserStatus() {
        $http({
            method: 'GET',
            url: window.StorageURL.userstatus,
        }).then(function successCallback(response) {
            $scope.userDefaultStatus = response.data;
            formStatus();
        }, function errorCallback(response) {

        });
    }
}
angular.module('finatwork').controller('userDashboard', userDashboard);