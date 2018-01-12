/*** Created by Nilabh on 13-09-2017.*/
function finGpsLifeStyleExpensesCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.lifeStyleExpensesForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('lifestyle').then(function (response) {
            if (response != null && response.lifestyle !== undefined && response.lifestyle != undefined) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.lifeStyleExpensesForm = response.lifestyle;
                $scope.lifeStyleList = response.lifestyle.additionallifestyle;
            } else {
                $scope.lifeStyleList = [
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
    $scope.lifeStyleList = [{
        _id: 0,
        addParticular: "",
        addParticularAmt: '',
        addParticularCycle: ''
    }];
    $scope.addLifeStyleExpenses = function (lifeStyle) {
        var tmp = {"_id": 0, "addParticular": '', "addParticularAmt": '', "addParticularCycle": ''};
        tmp._id = lifeStyle._id + 1;
        $scope.lifeStyleList.push(tmp);
    };
    $scope.delLifeStyleExpenses = function (index) {
        $scope.lifeStyleList.splice(index, 1)
    };
    $scope.submitLifeStyleExpenses = function () {
        var lifeStyleExpensesList = {
            additionallifestyle: $scope.lifeStyleList,
            shoppingAmt: $scope.lifeStyleExpensesForm.shoppingAmt,
            shoppingCycle: $scope.lifeStyleExpensesForm.shoppingCycle,
            entertainmentAmt: $scope.lifeStyleExpensesForm.entertainmentAmt,
            entertainmentCycle: $scope.lifeStyleExpensesForm.entertainmentCycle,
            travelAmt: $scope.lifeStyleExpensesForm.travelAmt,
            travelCycle: $scope.lifeStyleExpensesForm.travelCycle,

        };

        finGpsService.setInfo('lifestyle', lifeStyleExpensesList);
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#lifeStyleExpensesForm :input").attr("disabled", true);
            $("#lifeStyleExpensesForm :submit").attr("disabled", true);
        }
    }
}

angular.module('finatwork').controller('finGpsLifeStyleExpensesCtrl', finGpsLifeStyleExpensesCtrl);