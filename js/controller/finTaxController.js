/**
 * Created by Nilabh on 11-03-2017.
 */

function filingModalController($scope, close) {
    $scope.close = function (result) {
        close(result, 500);
    };
}
function finTax($scope, $state, $uibModal, $http, fintaxService,ModalService) {
    $scope.finTaxOptimize = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/fintaxOptimizeFaq.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    $scope.finTaxFiling = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/taxReturnFilingFaq.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    //this code is not working (image click)
    $scope.taxOptimisation = function () {
        $state.go("forms.fintax.houseProperty");
    };
    $scope.currentFinancialYear = currentFinancialYear();
    $scope.prevFinancialYear = prevFinancialYear();

    $scope.taxFiling = function (fiscalYear) {
        if(fiscalYear == $scope.prevFinancialYear){
            $state.go("forms.returnFiling.filingPersonalInfo");
        }else{
            ModalService.showModal({
                templateUrl: "views/filingYear.html",
                controller: "filingModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {
                            console.log(result);
                    } else {
                        console.log(result);
                    }
                });
            });
        }

    };




    $scope.initiateTranscation = function () {
        $state.go("forms.subscription.serviceCart", {service: "FinTax"});

        //$state.go("dashboards.fintax");
    };
    $scope.initiateTrxnFinsure = function () {
        $state.go("forms.subscription.serviceCart", {service: "FinSure"});

        //$state.go("dashboards.fintax");
    };
    $scope.initiateTrxnFinEstate = function (){
        $state.go("forms.subscription.serviceCart", {service: "FinEstate"});
    }
    $scope.initiateTrxnFinGps = function (){
        $state.go("forms.subscription.serviceCart", {service: "FinGPS"});
    }
}


angular.module('finatwork')
    .controller('finTax', finTax)
    .controller('filingModalController', filingModalController);

