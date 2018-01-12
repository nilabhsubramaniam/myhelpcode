/*** Created by Nilabh on 13-09-2017.*/
function finGpsDependentExpensesCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.dependentExpensesForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('dependent').then(function (response) {
            if (response != null && response.dependent !== undefined && response.dependent != undefined) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.dependentExpensesForm = response.dependent;
                $scope.dependentExpensesList = response.dependent.additionalDependent;
            } else {
                $scope.dependentExpensesList = [
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
    $scope.dependentExpensesList = [{
        _id: 0,
        addParticular: "",
        addParticularAmt: '',
        addParticularCycle: ''
    }];
    $scope.addDependentExpensesList = function (dependentExpenses) {
        var tmp = {"_id": 0, "addParticular": '', "addParticularAmt": '', "addParticularCycle": ''};
        tmp._id = dependentExpenses._id + 1;
        $scope.dependentExpensesList.push(tmp);
    };
    $scope.delDependentExpensesList = function (index) {
        $scope.dependentExpensesList.splice(index, 1)
    };
    $scope.submitDependentExpenses = function () {
        var dependentList = {
            additionalDependent: $scope.dependentExpensesList,
            childRelatedExpenses: $scope.dependentExpensesForm.childRelatedExpenses,
            childRelatedExpensesCycle: $scope.dependentExpensesForm.childRelatedExpensesCycle,
            parentContributionExpensesAmt: $scope.dependentExpensesForm.parentContributionExpensesAmt,
            parentContributionCycle: $scope.dependentExpensesForm.parentContributionCycle
        };

        finGpsService.setInfo('dependent', dependentList);
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#dependentExpensesForm :input").attr("disabled", true);
            $("#dependentExpensesForm :submit").attr("disabled", true);
        }
    }

}

angular.module('finatwork').controller('finGpsDependentExpensesCtrl', finGpsDependentExpensesCtrl);
