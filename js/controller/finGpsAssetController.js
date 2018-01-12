/*** Created by Nilabh on 14-09-2017.*/
function finGpsAssetCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.formEditable = true;
    $scope.finGpsAssetForm = {};
    $scope.init = function () {
        finGpsService.getInfo('assets').then(function (response) {
            if (response != null && response.assets != null && response.assets.length != 0) {/*response.assets.investmentAssets.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.finGpsAssetForm.savingAmt = response.assets.savingAmt;
                $scope.finGpsAssetForm.spouseSavingAmt = response.assets.spouseSavingAmt;

            } else {
                $scope.finGpsAssetForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.submitAsset = function () {
        var assetList = {
            savingAmt: $scope.finGpsAssetForm.savingAmt,
            spouseSavingAmt:$scope.finGpsAssetForm.spouseSavingAmt
        };
        finGpsService.setInfo('assets', assetList);
        $state.go('forms.finGps.assets&Liabilities.liabilities');
        toaster.success("Saved successfully");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#finGpsAssetForm :input").attr("disabled", true);
            $("#finGpsAssetForm :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsAssetCtrl', finGpsAssetCtrl);
