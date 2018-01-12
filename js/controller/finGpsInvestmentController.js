/*** Created by Nilabh on 09-09-2017.*/
function finGpsInvestmentCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.finGpsInvestmentAssetForm = {
        fixedIncomeInvestmentValue: 0
    };
    var uid = 1;
    $scope.investmentAssetList = [];
    $scope.addInvestmentList = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.todayDate = moment().hours(23).minutes(59).seconds(59).milliseconds(0);
    $scope.init = function () {
        finGpsService.getInfo('assets').then(function (response) {
            if (response != null && response.assets.investmentAssets != null && response.assets.investmentAssets.length != 0) {/*response.assets.investmentAssets.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.investmentAssetList = response.assets.investmentAssets;
                $scope.addInvestmentList = false;
                if ($scope.investmentAssetList.length > 1) {
                    $scope.investmentAssetList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.investmentAssetList[$scope.investmentAssetList.length - 1]._id + 1;
            } else {
                $scope.finGpsInvestmentAssetForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
        instrumentType();
    };
    $scope.assetCategorySelection = function () {
        $scope.fixedIncomeInstrument = $scope.finGpsInvestmentAssetForm.instrument === "ppf" ||
            $scope.finGpsInvestmentAssetForm.instrument ==="fd" ||$scope.finGpsInvestmentAssetForm.instrument === "recurringDeposit" ||
            $scope.finGpsInvestmentAssetForm.instrument ==="sukanyaSamriddhiScheme" ||$scope.finGpsInvestmentAssetForm.instrument === "nsc-KVP" ||
            $scope.finGpsInvestmentAssetForm.instrument ==="bondDebenture-cd";
        $scope.mutualFundInvestment = $scope.finGpsInvestmentAssetForm.instrument === "mutualFund";
        $scope.sharesInvestment = $scope.finGpsInvestmentAssetForm.instrument === "shares";
        $scope.realEstateInvestment = $scope.finGpsInvestmentAssetForm.instrument === "realEstate";
        $scope.goldInvestment = $scope.finGpsInvestmentAssetForm.instrument === "gold";
        $scope.othersInvestment = $scope.finGpsInvestmentAssetForm.instrument === "others";

    };

    var instrumentType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.instruments
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.instrumentList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
        $scope.fixedIncomeInstrument = false;
        $scope.mutualFundInvestment = false;
        $scope.sharesInvestment = false;
        $scope.realEstateInvestment = false;
        $scope.goldInvestment = false;
        $scope.othersInvestment = false;
    };
    $scope.submitInvestmentAssetForm = function () {
        $scope.finGpsInvestmentAssetForm.investmentDate = moment($scope.finGpsInvestmentAssetForm.investmentDate).format('YYYY-MM-DD');
        var newInvestmentAsset = $scope.finGpsInvestmentAssetForm;
        if (newInvestmentAsset._id == null) {
            newInvestmentAsset._id = ++uid;
            $scope.investmentAssetList.push(newInvestmentAsset);
        } else {
            for (var i in $scope.investmentAssetList) {
                if ($scope.investmentAssetList[i]._id == newInvestmentAsset._id) {
                    $scope.investmentAssetList[i] = newInvestmentAsset;
                    break;
                }
            }
        }
        $scope.finGpsInvestmentAssetForm = {};
        $scope.addInvestmentList = false;

    };
    $scope.addInvestmentAsset = function () {
        $scope.finGpsInvestmentAssetForm = {};
        $scope.addInvestmentList = true;
    };
    $scope.cancelInvestmentAsset = function () {
        if ($scope.investmentAssetList.length) {
            $scope.addInvestmentList = false;
        } else {
            $state.go('forms.finGps.assets&Liabilities.liabilities');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.investmentAssetList) {
                if ($scope.investmentAssetList[i]._id == id) {
                    $scope.investmentAssetList.splice(i, 1);
                    $scope.finGpsInvestmentAssetForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.investmentAssetList) {
                if ($scope.investmentAssetList[i]._id == id) {
                    $scope.finGpsInvestmentAssetForm = angular.copy($scope.investmentAssetList[i]);
                    break;
                }
            }
            $scope.addInvestmentList = true;
        }
    };
    $scope.submitInvestmentAsset = function () {
        var investmentAssetLists = {
            investmentAssets: $scope.investmentAssetList
        };
        finGpsService.setInfo('assets', investmentAssetLists);
        toaster.success("Saved successfully");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#finGpsInvestmentAssetForm :input").attr("disabled", true);
            $("#finGpsInvestmentAssetForm :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('finGpsInvestmentCtrl', finGpsInvestmentCtrl);
