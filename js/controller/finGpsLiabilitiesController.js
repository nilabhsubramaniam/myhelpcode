/** Created by Nilabh on 11-09-2017.*/
function finGpsLiabilitiesCtrl($scope, $state, $http, toaster, finGpsService) {
    var uid = 1;
    $scope.liabilitiesList = [];
    $scope.addLiabilities = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.todayDate = moment().hours(23).minutes(59).seconds(59).milliseconds(0);
    $scope.finGpsLiabilitiesForm = {
        isOutstanding: 'no',
        isLoan: 'no'
    };
    $scope.init = function () {
        finGpsService.getInfo('liabilities').then(function (response) {
            if (response != null && response.liabilities.loans != null && response.liabilities.loans.length != 0) {/*response.lifeInsurance.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.liabilitiesList = response.liabilities.loans;
                $scope.finGpsLiabilitiesForm.selfOutstandingBalance = response.liabilities.selfOutstandingBalance;
                $scope.finGpsLiabilitiesForm.spouseOutstandingBalance = response.liabilities.spouseOutstandingBalance;
                $scope.finGpsLiabilitiesForm.comment = response.liabilities.comment;
                $scope.addLiabilities = false;
                $scope.finGpsLiabilitiesForm.isLoan = 'yes';
                $scope.finGpsLiabilitiesForm.isOutstanding='yes';
                if ($scope.liabilitiesList.length > 1) {
                    $scope.liabilitiesList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.liabilitiesList[$scope.liabilitiesList.length - 1]._id + 1;
            } else {
                $scope.finGpsLiabilitiesForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
        loadLoanType();
    };
    var loadLoanType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.loanType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.loanList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.submitAdditionalLiabilities = function () {
        $scope.finGpsLiabilitiesForm.startDate = moment($scope.finGpsLiabilitiesForm.startDate);
        var newLiabilities = $scope.finGpsLiabilitiesForm;
        if ($scope.finGpsLiabilitiesForm.isLoan = 'yes') {
            if (newLiabilities._id == null) {
                newLiabilities._id = ++uid;
                $scope.liabilitiesList.push(newLiabilities);
            } else {
                for (var i in $scope.liabilitiesList) {
                    if ($scope.liabilitiesList[i]._id == newLiabilities._id) {
                        $scope.liabilitiesList[i] = newLiabilities;
                        break;
                    }
                }
            }
        }
        $scope.finGpsLiabilitiesForm = {};
        $scope.addLiabilities = false;

    };
    $scope.addFinGpsLiabilities = function () {
        $scope.finGpsLiabilitiesForm = {};
        $scope.finGpsLiabilitiesForm.isLoan = 'yes';
        $scope.addLiabilities = true;

    };
    $scope.cancelLiabilities = function () {
        if ($scope.liabilitiesList.length) {
            $scope.addLiabilities = false;
        } else {
            $state.go('forms.finGps.insurance.lifeInsurance');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.liabilitiesList) {
                if ($scope.liabilitiesList[i]._id == id) {
                    $scope.liabilitiesList.splice(i, 1);
                    $scope.finGpsLiabilitiesForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.liabilitiesList) {
                if ($scope.liabilitiesList[i]._id == id) {
                    $scope.finGpsLiabilitiesForm = angular.copy($scope.liabilitiesList[i]);
                    $scope.finGpsLiabilitiesForm.isLoan = 'yes';
                    break;
                }
            }
            $scope.addLiabilities = true;
        }
    };
    $scope.submitFinGpsLiabilities = function () {
        var liabilitiesLists = {
            loans: $scope.liabilitiesList,
            selfOutstandingBalance: $scope.finGpsLiabilitiesForm.selfOutstandingBalance,
            spouseOutstandingBalance: $scope.finGpsLiabilitiesForm.spouseOutstandingBalance,
            comment: $scope.finGpsLiabilitiesForm.comment
        };
        finGpsService.setInfo('liabilities', liabilitiesLists);
        $state.go('forms.finGps.insurance.generalInsurance');
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#finGpsLiabilitiesForm :input").attr("disabled", true);
            $("#finGpsLiabilitiesForm :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsLiabilitiesCtrl', finGpsLiabilitiesCtrl);
