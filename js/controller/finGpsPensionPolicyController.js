/*** Created by Nilabh on 08-09-2017.*/
function finGpsPensionPolicyCtrl($scope, $state, toaster,finGpsService) {
    var uid = 1;
    $scope.pensionPolicyList = [];
    $scope.addPensionPolicy = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('pensionPolicy').then(function (response) {
            if (response != null && response.pensionPolicy != null && response.pensionPolicy.pension.length != 0) {/*response.lifeInsurance.,pensionlength can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.pensionPolicyList = response.pensionPolicy.pension;
                $scope.addPensionPolicy = false;
                if ($scope.pensionPolicyList.length > 1) {
                    $scope.pensionPolicyList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.pensionPolicyList[$scope.pensionPolicyList.length - 1]._id + 1;
            } else {
                $scope.finGpsPensionPolicyForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.submitPensionPolicyForm = function () {
        var newPensionPolicy = $scope.finGpsPensionPolicyForm;
        if (newPensionPolicy._id == null) {
            newPensionPolicy._id = ++uid;
            $scope.pensionPolicyList.push(newPensionPolicy);
        } else {
            for (var i in $scope.pensionPolicyList) {
                if ($scope.pensionPolicyList[i]._id == newPensionPolicy._id) {
                    $scope.pensionPolicyList[i] = newPensionPolicy;
                    break;
                }
            }
        }
        $scope.finGpsPensionPolicyForm = {};
        $scope.addPensionPolicy = false;
    };
    $scope.addFinGpsPensionPolicy = function () {
        $scope.finGpsPensionPolicyForm = {};
        $scope.addPensionPolicy = true;
    };
    $scope.cancelPensionPolicy = function () {
        if ($scope.pensionPolicyList.length) {
            $scope.addPensionPolicy = false;
        } else {
            $state.go('forms.finGps.insurance.generalInsurance');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.pensionPolicyList) {
                if ($scope.pensionPolicyList[i]._id == id) {
                    $scope.pensionPolicyList.splice(i, 1);
                    $scope.finGpsPensionPolicyForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.pensionPolicyList) {
                if ($scope.pensionPolicyList[i]._id == id) {
                    $scope.finGpsPensionPolicyForm = angular.copy($scope.pensionPolicyList[i]);
                    break;
                }
            }
            $scope.addPensionPolicy = true;
        }
    };
    $scope.submitPensionPolicy = function () {
        var pensionPolicyLists = {
            pension:$scope.pensionPolicyList
        };
        finGpsService.setInfo('pensionPolicy', pensionPolicyLists);
        $state.go('forms.finGps.insurance.generalInsurance');
        toaster.success("Saved successfully");
    }
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
angular.module('finatwork').controller('finGpsPensionPolicyCtrl', finGpsPensionPolicyCtrl);