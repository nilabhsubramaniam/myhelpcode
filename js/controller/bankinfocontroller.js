/**
 * bankInfo - Controller for bankInfo Form
 */
function modelButtonController($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
angular.module('finatwork').controller('modelButtonController', modelButtonController);
function bankInfo($scope, $http, toaster, $uibModal, $state, formEditService, Scopes) {
    $scope.formStatus = false;
    $scope.formEditStatus = false;
    $scope.submitText = "Save";
    $scope.showFullForm = false;
    $scope.bankInfoFormData = {
        token: window.localStorage.getItem("token"),
        _userid: window.localStorage.getItem("userid")
    };
    $scope.accountTypeList = [];
    $scope.ifscFlag = false;
    $scope.invalidIfscCode = false;

    var loadAccountTypeList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.account_type,
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.accountTypeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    var loadBillDeskBankList = function () {
        $http({
            method: 'GET',
            url: window.link.billdeskbank + '?activeflag=Y&bank_category=Net Banking',
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            (response.data).push({"bd_bank_code": "non_billdesk", "bd_bank_name": "Other Bank"});
            $scope.BillDeskBankList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.init = function () {
        if (!IsAdmin())fourmStatus();
        loadAccountTypeList();
        loadBillDeskBankList();
        getDefaultValue();
    };
    $scope.otherBankDetails = function () {
        $scope.otherBank = $scope.bd_bank == "non_billdesk";
        if ($scope.bd_bank == "non_billdesk") {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_otherbank_info.html',
                controller: modelButtonController,
                windowClass: "animated fadeIn"
            });
        }
    };
    $scope.getBankDetails = function () {
        if ($scope.ifscFlag) {
            return false;
        }

        $scope.ifscFlag = true;
        $scope.invalidIfscCode = false;
        $http({
            method: 'GET',
            url: window.link.ifsc + '/' + $scope.bankInfoFormData.ifsc_code,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            $scope.ifscFlag = false;
            if (typeof response.data == 'string') {
                $scope.invalidIfscCode = true;
                return false;
            }
            $scope.showFullForm = true;
            $scope.bankInfoFormData.name = response.data.BANK;
            $scope.bankInfoFormData.branch = response.data.BRANCH;
            $scope.bankInfoFormData.addr = response.data.ADDRESS;
            $scope.bankInfoFormData.city = response.data.CITY;
            $scope.bankInfoFormData.country = "India";
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.submitBankInfoForm = function () {
        if ($scope.formStatus) {
            $state.go('forms.wizard.service_request');
        } else {
            if ($scope.ifscFlag || $scope.invalidIfscCode) {
                return false;
            }
            if ($scope.bankInfoFormData.confirm_account_number != $scope.bankInfoFormData.account_number) {
                toaster.error({body: "Account Number doesn't match"});
                return false;
            }
            var pincodeIndex = $scope.bankInfoFormData.addr.search(/[1-9][0-9]{5}$/);
            if (pincodeIndex > 0) {
                $scope.bankInfoFormData.pincode = $scope.bankInfoFormData.addr.substring(pincodeIndex);
            }
            $scope.bankInfoFormData.code = $scope.bd_bank;
            $scope.bankInfoFormData.bankType = ($scope.bd_bank == "non_billdesk") ? "non_billdesk" : "billdesk";

            var formObj = document.getElementById("bankInfoForm");
            var url = window.link.bank;
            var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
            if ($scope.formEditStatus || IsAdmin()) {
                url = window.link.bank + "/" + userId;
            }
            $http({
                method: 'POST',
                url: url,
                data: $.param($scope.bankInfoFormData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                toaster.success("Saved");
                if (!$scope.formEditStatus) {
                    var isFormEdit = {
                        personal: false,
                        bank: false,
                        nominee: false,
                        kyc: false,
                        docs: true,
                        service: true
                    };
                    formEditService.setIsEditable(isFormEdit);
                    Scopes.get('formWizardCtrl').isFormEdit.nominee = false;
                }
                $state.go("forms.wizard.nominee-info");
            }, function errorCallback(response) {
                //toaster.error({body: response.data.err});
            });
        }
    };
    function getDefaultValue() {
        var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url: window.link.bank + "/" + userId,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.bankInfoFormData = {
                    token: window.localStorage.getItem("token"),
                    _userid: (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid"),
                    acctName: response.data.acctName,
                    name: response.data.name,
                    code: response.data.code,
                    ifsc_code: response.data.ifsc_code,
                    branch: response.data.branch,
                    addr: response.data.addr,
                    account_number: response.data.account_number,
                    confirm_account_number: response.data.account_number,
                    account_type: response.data.account_type,
                    otherBankText: (response.data.bankType === "non_billdesk") ? response.data.name : ""
                };
                $scope.bd_bank = (response.data.bankType === "non_billdesk") ? response.data.bankType : response.data.code;
                $scope.otherBank = ($scope.bd_bank == "non_billdesk") ? true : false;
                $scope.showFullForm = true;
            }
        }, function errorCallback(response) {
            $scope.bankInfoFormData = {
                token: window.localStorage.getItem("token"),
                _userid: (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid")
            };
        });
    }

    function fourmStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + window.localStorage.getItem("userid"),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "acct_verified") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
                if (isActive) {
                    $("#bankInfoForm :input").attr("disabled", true);
                    $("#bankInfoForm :submit").attr("disabled", false);
                }
                var isEditable = false;
                for (var i = 0; i < response.data.accountInfo.length; i++) {
                    if (response.data.accountInfo[i].state == "bankInfo") {
                        isEditable = true;
                    }
                }
                if (isEditable)
                    $scope.submitText = "Update";
                $scope.formEditStatus = isEditable;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('bankInfo', bankInfo);
