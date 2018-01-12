/*** Created by Nilabh on 13-09-2017.*/
function finGpsInsurancePremiumCtrl($scope, $state, toaster, finGpsService) {
    $scope.insurancePremiumForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('insurance').then(function (response) {
            if (response != null && response.insurance !== undefined && response.insurance != undefined) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.insurancePremiumForm = response.insurance;
                $scope.generalInsuranceList = response.insurance.additionalInsurance;
            } else {
                $scope.generalInsuranceList = [
                    {
                        _id: 0,
                        addParticular: '',
                        addParticularAmt: '',
                        addParticularCycle: ''

                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.generalInsuranceList = [{
        _id: 0,
        addParticular: "",
        addParticularAmt: '',
        addParticularCycle: ''
    }];
    $scope.addGeneralInsurance = function (generalInsurance) {
        var tmp = {"_id": 0, "addParticular": '', "addParticularAmt": '', "addParticularCycle": ''};
        tmp._id = generalInsurance._id + 1;
        $scope.generalInsuranceList.push(tmp);
    };
    $scope.delGeneralInsurance = function (index) {
        $scope.generalInsuranceList.splice(index, 1)
    };
    $scope.submitGeneralInsurance = function () {
        var insuranceList = {
            additionalInsurance: $scope.generalInsuranceList,
            pureTermInsuranceAmt: $scope.insurancePremiumForm.pureTermInsuranceAmt,
            pureTermInsuranceCycle: $scope.insurancePremiumForm.pureTermInsuranceCycle,
            generalInsuranceAmt: $scope.insurancePremiumForm.generalInsuranceAmt,
            generalInsuranceCycle: $scope.insurancePremiumForm.generalInsuranceCycle
        };

        finGpsService.setInfo('insurance', insuranceList);
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#insurancePremiumForm :input").attr("disabled", true);
            $("#insurancePremiumForm :submit").attr("disabled", true);
        }
    }

}

angular.module('finatwork').controller('finGpsInsurancePremiumCtrl', finGpsInsurancePremiumCtrl);
