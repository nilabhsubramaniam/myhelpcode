/*** Created by Nilabh on 11-09-2017.*/
function finGpsGeneralInsuranceCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.generalInsuranceForm = {
        pvtHealthInsurance: 'no',
        criticalIllnessPolicy: 'no',
        personalAccidentPolicy: 'no'
    };
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('generalInsurance').then(function (response) {
            if (response != null && response.generalInsurance !== undefined && response.generalInsurance != undefined) {
                if (!IsAdmin())formStatus(response.state);
                $scope.generalInsuranceForm.generalInsurance = response.generalInsurance;
                if ($scope.generalInsuranceForm.generalInsurance) {
                    if (response.generalInsurance.pvtAmt) {
                        $scope.generalInsuranceForm.pvtHealthInsurance = 'yes';
                        $scope.generalInsuranceForm.pvtAmt = response.generalInsurance.pvtAmt;
                    }
                    if (response.generalInsurance.pvtSpouseAmt) {
                        $scope.generalInsuranceForm.pvtHealthInsurance = 'yes';
                        $scope.generalInsuranceForm.pvtSpouseAmt = response.generalInsurance.pvtSpouseAmt;
                    }
                    if (response.generalInsurance.pvtParentsAmt) {
                        $scope.generalInsuranceForm.pvtHealthInsurance = 'yes';
                        $scope.generalInsuranceForm.pvtParentsAmt = response.generalInsurance.pvtParentsAmt;
                    }
                    if (response.generalInsurance.criticalAmt) {
                        $scope.generalInsuranceForm.criticalIllnessPolicy = 'yes';
                        $scope.generalInsuranceForm.criticalAmt = response.generalInsurance.criticalAmt;
                    }
                    if (response.generalInsurance.criticalSpouseAmt) {
                        $scope.generalInsuranceForm.criticalIllnessPolicy = 'yes';
                        $scope.generalInsuranceForm.criticalSpouseAmt = response.generalInsurance.criticalSpouseAmt;
                    }
                    if (response.generalInsurance.criticalParentsAmt) {
                        $scope.generalInsuranceForm.criticalIllnessPolicy = 'yes';
                        $scope.generalInsuranceForm.criticalParentsAmt = response.generalInsurance.criticalParentsAmt;
                    }
                    if (response.generalInsurance.personalAmt) {
                        $scope.generalInsuranceForm.personalAccidentPolicy = 'yes';
                        $scope.generalInsuranceForm.personalAmt = response.generalInsurance.personalAmt;
                    }
                    if (response.generalInsurance.personalSpouseAmt) {
                        $scope.generalInsuranceForm.personalAccidentPolicy = 'yes';
                        $scope.generalInsuranceForm.personalSpouseAmt = response.generalInsurance.personalSpouseAmt;
                    }
                    if (response.generalInsurance.personalParentsAmt) {
                        $scope.generalInsuranceForm.personalAccidentPolicy = 'yes';
                        $scope.generalInsuranceForm.personalParentsAmt = response.generalInsurance.personalParentsAmt;
                    }
                    if(response.generalInsurance.comment){
                        $scope.generalInsuranceForm.comment =response.generalInsurance.comment;
                    }
                }
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.submitGeneralInsurance = function(){
        var generalInsuranceInfo = {};
        if ($scope.generalInsuranceForm.pvtHealthInsurance == 'yes') {
            generalInsuranceInfo.pvtAmt = $scope.generalInsuranceForm.pvtAmt;
            generalInsuranceInfo.pvtSpouseAmt = $scope.generalInsuranceForm.pvtSpouseAmt;
            generalInsuranceInfo.pvtParentsAmt = $scope.generalInsuranceForm.pvtParentsAmt;
        }
        if ($scope.generalInsuranceForm.criticalIllnessPolicy == 'yes') {
            generalInsuranceInfo.criticalAmt = $scope.generalInsuranceForm.criticalAmt;
            generalInsuranceInfo.criticalSpouseAmt = $scope.generalInsuranceForm.criticalSpouseAmt;
            generalInsuranceInfo.criticalParentsAmt = $scope.generalInsuranceForm.criticalParentsAmt;
        }
        if ($scope.generalInsuranceForm.personalAccidentPolicy == 'yes') {
            generalInsuranceInfo.personalAmt = $scope.generalInsuranceForm.personalAmt;
            generalInsuranceInfo.personalSpouseAmt = $scope.generalInsuranceForm.personalSpouseAmt;
            generalInsuranceInfo.personalParentsAmt = $scope.generalInsuranceForm.personalParentsAmt;
        }
        generalInsuranceInfo.comment =$scope.generalInsuranceForm.comment;
        finGpsService.setInfo("generalInsurance", generalInsuranceInfo);
         $state.go("forms.finGps.finGpsDoc_upload");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#lifeInsuranceRelated :input").attr("disabled", true);
            $("#lifeInsuranceRelated :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsGeneralInsuranceCtrl', finGpsGeneralInsuranceCtrl);
