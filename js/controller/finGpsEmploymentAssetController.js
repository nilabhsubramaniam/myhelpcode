/*** Created by Nilabh on 23-08-2017.*/
function finGpsEmploymentAssetCtrl($scope, $state, $http, toaster, finGpsService) {
    $scope.finGpsEmploymentBenefitsForm = {};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('employmentAssets').then(function (response) {
            if (response != null && response.employmentAssets.employmentBenefits != null && response.employmentAssets.employmentBenefits.length != 0) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.employmentBenefitList = response.employmentAssets.employmentBenefits;
                $scope.finGpsEmploymentBenefitsForm.comment = response.employmentAssets.comment;
            } else {
                $scope.employmentBenefitList = [
                    {
                        _id: 0,
                        category: '',
                        holder: '',
                        amount: ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });
        loadEmploymentList();
    };

    var loadEmploymentList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.employmentBenefit
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.employmentCategoryList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.employmentBenefitList = [{
        _id: 0,
        category: '',
        holder: '',
        amount: ''
    }];
    $scope.addEmploymentBenefits = function (employment) {
        var tmp = {"_id": 0, "category": '', "holder": '', "amount": ''};
        tmp._id = employment._id + 1;
        $scope.employmentBenefitList.push(tmp);
    };
    $scope.deleteEmploymentBenefits = function (index) {
        $scope.employmentBenefitList.splice(index, 1);
    };
    $scope.submitFinGpsEmploymentAssets = function () {
        var employmentLists = {
            employmentBenefits: $scope.employmentBenefitList,
            comment: $scope.finGpsEmploymentBenefitsForm.comment
        };
        finGpsService.setInfo('employmentAssets', employmentLists);
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#finGpsPersonalAssets :input").attr("disabled", true);
            $("#finGpsPersonalAssets :submit").attr("disabled", true);
        }
    }
}

angular.module('finatwork').controller('finGpsEmploymentAssetCtrl', finGpsEmploymentAssetCtrl);
