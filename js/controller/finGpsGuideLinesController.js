/*** Created by Nilabh on 08-09-2017.*/
function finGpsModalController($scope, close) {
    $scope.close = function (result) {
        close(result, 500);
    };
}
function finGpsGuideLinesCtrl($scope, $state, $http,ModalService,finGpsService){
    $scope.termsConditionSelected = false;
    $scope.finGpsTermsConditions = function () {
        ModalService.showModal({
            templateUrl: "views/finGpsTermsConditions.html",
            controller: "finGpsModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $scope.termsConditionSelected = true;
                } else {

                }
            });
        });
    };
    $scope.confirmTermsAgreement= function(){
        $state.go('forms.finGps.personal&Work.personal');
    };

}
angular
    .module('finatwork')
    .controller('finGpsModalController', finGpsModalController)
    .controller('finGpsGuideLinesCtrl', finGpsGuideLinesCtrl);
