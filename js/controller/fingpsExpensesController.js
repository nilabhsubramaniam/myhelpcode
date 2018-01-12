/*** Created by Nilabh on 17-08-2017.*/
function finGpsExpensesCtrl($scope, toaster, $state,finGpsService) {
    $scope.expensesCashFlowForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('expenses').then(function (response) {
            if (response != null && response.expenses !== undefined && response.expenses != undefined) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.expensesCashFlowForm = response.expenses;

            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.submitExpensesCashFlow = function () {
        var expensesCashFlowList = {
            comment: $scope.expensesCashFlowForm.comment

        };
        finGpsService.setInfo('expenses', expensesCashFlowList);
        $state.go('forms.finGps.finGpsCashFlow.regularInvestment');
        toaster.success("Saved successfully");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#expensesCashFlowForm :input").attr("disabled", true);
            $("#expensesCashFlowForm :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('finGpsExpensesCtrl', finGpsExpensesCtrl);