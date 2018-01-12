/*** Created by Nilabh on 26-07-2017.*/

function finGps($scope, $state, $uibModal,finGpsService) {
    $scope.finGpsInfo = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/finGpsGeneralInfoModal.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    $scope.initiateGpsTransaction = function () {
        $state.go("forms.subscription.serviceCart", {service: "FinGPS"});

        //$state.go("dashboards.fintax");
    };
}


angular.module('finatwork')
    .controller('finGps', finGps);

