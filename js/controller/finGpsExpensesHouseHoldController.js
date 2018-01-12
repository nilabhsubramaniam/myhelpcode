/*** Created by Nilabh on 13-09-2017.*/
function finGpsExpensesHouseHoldCtrl($scope, $state, toaster,  finGpsService) {
    $scope.householdUtilitiesForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('household').then(function (response) {
            if (response != null && response.household !== undefined && response.household != undefined) {
                if (!IsAdmin())formStatus(response.state);
                $scope.householdUtilitiesForm = response.household;
                $scope.additionalParticularList = response.household.additionalHousehold;
            } else {
                $scope.incomeList = [
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
    $scope.additionalParticularList = [{
        _id: 0,
        addParticular: "",
        addParticularAmt: '',
        addParticularCycle: ''
    }];
    $scope.addParticularExpenses = function (particular) {
        var tmp = {"_id": 0, "addParticular": '', "addParticularAmt": '', "addParticularCycle": ''};
        tmp._id = particular._id + 1;
        $scope.additionalParticularList.push(tmp);
    };
    $scope.delParticularExpenses = function (index) {
        $scope.additionalParticularList.splice(index, 1)
    };
    $scope.submitHouseHoldUtilities = function () {
        var houseHoldList = {
                additionalHousehold: $scope.additionalParticularList,
                groceryAmt: $scope.householdUtilitiesForm.groceryAmt,
                groceryCycle: $scope.householdUtilitiesForm.groceryCycle,
                utilityPaymentAmt: $scope.householdUtilitiesForm.utilityPaymentAmt,
                utilityPaymentsCycle: $scope.householdUtilitiesForm.utilityPaymentsCycle,
                houseRentAmt: $scope.householdUtilitiesForm.houseRentAmt,
                houseRentCycle: $scope.householdUtilitiesForm.houseRentCycle,
                medicalAmt: $scope.householdUtilitiesForm.medicalAmt,
                medicalCycle: $scope.householdUtilitiesForm.medicalCycle,
                fuelAmt: $scope.householdUtilitiesForm.fuelAmt,
                fuelCycle: $scope.householdUtilitiesForm.fuelCycle,
                repairMaintenanceAmt: $scope.householdUtilitiesForm.repairMaintenanceAmt,
                repairMaintenanceCycle: $scope.householdUtilitiesForm.repairMaintenanceCycle

            };

        finGpsService.setInfo('household', houseHoldList);
        toaster.success("Saved successfully");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#householdUtilitiesForm :input").attr("disabled", true);
            $("#householdUtilitiesForm :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('finGpsExpensesHouseHoldCtrl', finGpsExpensesHouseHoldCtrl);
