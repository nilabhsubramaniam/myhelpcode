/*** Created by Nilabh on 13-09-2017.*/
function finGpsLoanExpensesCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.loanServicingForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('loan').then(function (response) {
            if (response != null && response.loan !== undefined && response.loan != undefined) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.loanServicingForm = response.loan;
                $scope.loanServicingList = response.loan.additionalLoan;
            } else {
                $scope.loanServicingList = [
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
    $scope.loanServicingList = [{
        _id: 0,
        addParticular: "",
        addParticularAmt: '',
        addParticularCycle: ''
    }];
    $scope.addLoanServiceExpenses = function (loanService) {
        var tmp = {"_id": 0, "addParticular": '', "addParticularAmt": '', "addParticularCycle": ''};
        tmp._id = loanService._id + 1;
        $scope.loanServicingList.push(tmp);
    };
    $scope.delLoanServiceExpenses = function (index) {
        $scope.loanServicingList.splice(index, 1)
    };
    $scope.submitHouseLoanServicesExpenses = function () {
        var loanList = {
            additionalLoan: $scope.loanServicingList,
            homeEMIAmt: $scope.loanServicingForm.homeEMIAmt,
            homeEMICycle: $scope.loanServicingForm.homeEMICycle,
            vehicleLoanEMIAmt: $scope.loanServicingForm.vehicleLoanEMIAmt,
            vehicleLoanEMICycle: $scope.loanServicingForm.vehicleLoanEMICycle,
            educationLoanEMIAmt: $scope.loanServicingForm.educationLoanEMIAmt,
            educationLoanEMICycle: $scope.loanServicingForm.educationLoanEMICycle,
            personalLoanEMIAmt: $scope.loanServicingForm.personalLoanEMIAmt,
            personalLoanEMICycle: $scope.loanServicingForm.personalLoanEMICycle,

        };

        finGpsService.setInfo('loan', loanList);
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#loanServicingForm :input").attr("disabled", true);
            $("#loanServicingForm :submit").attr("disabled", true);
        }
    }

}

angular.module('finatwork').controller('finGpsLoanExpensesCtrl', finGpsLoanExpensesCtrl);
