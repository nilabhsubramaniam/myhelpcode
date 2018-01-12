function filingBankInfoCtrl($scope, $state, fintaxFilingService, convertDigitsIntoWords, toaster) {
    $scope.formEditable = true;
    $scope.init = function () {
        fintaxFilingService.getInfo().then(function (response) {
            if (response != null) {
                if (!IsAdmin())formStatus(response.state);
            }
        }, function () {
            console.log(reason);
        });
        fintaxFilingService.getBankInfo().then(function (response) {
            if (response.length != 0) {
                $scope.bankList = response;
            } else {
                $scope.bankList = [
                    {
                        _id: 0,
                        ifsc_code: '',
                        account_number: '',
                        account_type: ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });

    };
    $scope.addBankInfo = function (bank) {
        var tmp = {"_id": 0, "ifsc_code": '', "account_number": '', "account_type": ''};
        tmp._id = bank._id + 1;
        $scope.bankList.push(tmp);
        //$scope.oneAtATime = true;
    };
    $scope.submitBankInfo = function () {
        fintaxFilingService.setBankInfo($scope.bankList);
        $state.go('forms.returnFiling.filingSalary');
        toaster.success({body: "Bank Information saved"});
    };

    $scope.deleteBank = function (index) {
                $scope.bankList.splice(index, 1);
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingBankInfo :input").attr("disabled", true);
            $("#filingBankInfo :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingBankInfoCtrl', filingBankInfoCtrl);