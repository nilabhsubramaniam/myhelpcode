/*** Created by Nilabh on 12-09-2017.*/
function finGpsPersonalAssetCtrl($scope, $state, $http, toaster, finGpsService) {
    $scope.finGpsPersonalAssetsForm ={};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('personalInvestmentAssets').then(function (response) {
            if (response != null && response.personalInvestmentAssets.personalAssets != null && response.personalInvestmentAssets.personalAssets.length != 0) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.personalBenefitList = response.personalInvestmentAssets.personalAssets;
                $scope.finGpsPersonalAssetsForm.comment = response.personalInvestmentAssets.comment;
            } else {
                $scope.personalBenefitList = [
                    {
                        _id: 0,
                        personalAssetType: '',
                        holder: '',
                        purchaseCost: '',
                        currentValue: ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    //Personal Benefits
    $scope.personalBenefitList = [{
        _id: 0,
        personalAssetType: '',
        holder: '',
        purchaseCost: '',
        currentValue: ''
    }];
    $scope.addPersonalBenefits = function (personal) {
        var tmp = {"_id": 0, "personalAssetType": '', "holder": '', "purchaseCost": '', "currentValue": ''};
        tmp._id = personal._id + 1;
        $scope.personalBenefitList.push(tmp);
    };
    $scope.deletePersonalBenefits = function (index) {
        $scope.personalBenefitList.splice(index, 1);
    };
    $scope.submitFinGpsPersonalAssets = function () {
        var personalLists = {
            personalAssets: $scope.personalBenefitList,
            comment :$scope.finGpsPersonalAssetsForm.comment
        };
        finGpsService.setInfo('personalInvestmentAssets',personalLists );
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

angular.module('finatwork').controller('finGpsPersonalAssetCtrl', finGpsPersonalAssetCtrl);
