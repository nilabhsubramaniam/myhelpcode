/*** Created by Nilabh on 14-08-2017.*/
function finGpsIncomeCtrl($scope, $state, $http, toaster, finGpsService) {
    $scope.incomeCashFlowForm={};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('incomeCashFlow').then(function (response) {
            if (response != null && response.incomeCashFlow.income != null && response.incomeCashFlow.income.length != 0) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.incomeList = response.incomeCashFlow.income;
                $scope.incomeCashFlowForm.comment = response.incomeCashFlow.comment;
            } else {
                $scope.incomeList = [
                    {
                        _id: 0,
                        category: '',
                        selfIncome: '',
                        SpouseIncome: '',
                        frequency: ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });
        otherSrcIncome();
    };
    var otherSrcIncome = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.otherIncomeSource
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.otherSrcIncomeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.incomeList = [{
        _id: 0,
        category: '',
        selfIncome: '',
        SpouseIncome: '',
        frequency: ''
    }];
    $scope.addIncomeGoal = function (income) {
        var tmp = {"_id": 0, "category": '', "selfIncome": '', "SpouseIncome": '',"frequency":''};
        tmp._id = income._id + 1;
        $scope.incomeList.push(tmp);
    };
    $scope.deleteIncomeGoal = function (index) {
        $scope.incomeList.splice(index, 1);
    };
    $scope.submitIncomeCashFlow = function () {
        var incomeCashFlowList = {
            income: $scope.incomeList,
            comment:$scope.incomeCashFlowForm.comment
        };
        finGpsService.setInfo('incomeCashFlow', incomeCashFlowList);
        $state.go('forms.finGps.finGpsCashFlow.expensesCashFlow');
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#incomeCashFlowForm :input").attr("disabled", true);
            $("#incomeCashFlowForm :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('finGpsIncomeCtrl', finGpsIncomeCtrl);