/*** Created by Nilabh on 30-08-2017.*/
function finGpsInsuranceCtrl($scope, $state, toaster, $http, finGpsService) {
    var uid = 1;
    $scope.lifeInsuranceList = [];
    $scope.addLifeInsurance = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.todayDate = moment().hours(23).minutes(59).seconds(59).milliseconds(0);
    $scope.init = function () {
        finGpsService.getInfo('lifeInsurance').then(function (response) {
            if (response != null && response.lifeInsurance != null && response.lifeInsurance.insurance.length != 0) {/*response.lifeInsurance.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin()) formStatus(response.state);
                $scope.lifeInsuranceList = response.lifeInsurance.insurance;
                $scope.addLifeInsurance = false;
                if ($scope.lifeInsuranceList.length > 1) {
                    $scope.lifeInsuranceList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.lifeInsuranceList[$scope.lifeInsuranceList.length - 1]._id + 1;
            } else {
                $scope.finGpsLifeInsuranceForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
        loadPolicyType();
    };
    $scope.otherLifeInsurance = function () {
        $scope.otherInsuranceDetails = $scope.finGpsLifeInsuranceForm.policyType == "others";
    };
    var loadPolicyType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.policyType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.policyList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
        $scope.otherInsuranceDetails = false;
    };
    $scope.submitLifeInsuranceForm = function () {
        $scope.finGpsLifeInsuranceForm.issueDate = moment($scope.finGpsLifeInsuranceForm.issueDate).format('YYYY-MM-DD');
        var newLifeInsurance = $scope.finGpsLifeInsuranceForm;
        if (newLifeInsurance._id == null) {
            newLifeInsurance._id = ++uid;
            $scope.lifeInsuranceList.push(newLifeInsurance);
        } else {
            for (var i in $scope.lifeInsuranceList) {
                if ($scope.lifeInsuranceList[i]._id == newLifeInsurance._id) {
                    $scope.lifeInsuranceList[i] = newLifeInsurance;
                    break;
                }
            }
        }
        $scope.finGpsLifeInsuranceForm = {};
        $scope.addLifeInsurance = false;

    };
    $scope.addFinGpsLifeInsurance = function () {
        $scope.finGpsLifeInsuranceForm = {};
        $scope.addLifeInsurance = true;

    };
    $scope.cancelLifeInsurance = function () {
        if ($scope.lifeInsuranceList.length) {
            $scope.addLifeInsurance = false;
        } else {
            $state.go('forms.finGps.insurance.pensionPolicy');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.lifeInsuranceList) {
                if ($scope.lifeInsuranceList[i]._id == id) {
                    $scope.lifeInsuranceList.splice(i, 1);
                    $scope.finGpsLifeInsuranceForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.lifeInsuranceList) {
                if ($scope.lifeInsuranceList[i]._id == id) {
                    $scope.finGpsLifeInsuranceForm = angular.copy($scope.lifeInsuranceList[i]);
                    break;
                }
            }
            $scope.addLifeInsurance = true;
        }
    };
    $scope.submitLifeInsurance = function () {
        var lifeInsuranceLists = {
            insurance: $scope.lifeInsuranceList
        };
        finGpsService.setInfo('lifeInsurance', lifeInsuranceLists);
        $state.go('forms.finGps.insurance.pensionPolicy');
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#lifeInsuranceRelated :input").attr("disabled", true);
            $("#lifeInsuranceRelated :submit").attr("disabled", true);
        }
    }
}

angular.module('finatwork').controller('finGpsInsuranceCtrl', finGpsInsuranceCtrl);