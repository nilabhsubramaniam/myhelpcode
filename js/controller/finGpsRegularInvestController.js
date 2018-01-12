/*** Created by Nilabh on 18-08-2017.*/
function finGpsRegularInvestCtrl($scope, $state, $http, toaster, finGpsService) {
    $scope.regularInvestmentForm ={};
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('regularInvestments').then(function (response) {
            if (response != null && response.regularInvestments.regular != null && response.regularInvestments.regular.length != 0) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.investmentTypeList = response.regularInvestments.regular;
                $scope.regularInvestmentForm.comment = response.regularInvestments.comment;
            } else {
                $scope.investmentTypeList = [
                    {
                        _id: 0,
                        "particulars": '',
                        "holder": '',
                        "investmentAmount": '',
                        "cycle": ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });
        loadInvestmentType();
    };
    var loadInvestmentType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.investmentType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.investmentTypeRecord = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.investmentTypeList = [{
        _id: 0,
        "particulars": '',
        "holder": '',
        "investmentAmount": '',
        "cycle": ''
    }];
    $scope.addRegularInvestment = function (investment) {
        var tmp = {"_id": 0, "particulars": '', "holder": '', "investmentAmount": '', "cycle": ''};
        tmp._id=investment._id +1;
        $scope.investmentTypeList.push(tmp);
    };
    $scope.delRegularInvestment = function(index){
        $scope.investmentTypeList.splice(index,1);
    };
    $scope.submitRegularInvestment = function () {
        var regularInvestmentList = {
            regular: $scope.investmentTypeList,
            comment:$scope.regularInvestmentForm.comment
        };
        finGpsService.setInfo('regularInvestments', regularInvestmentList);
        $state.go('forms.finGps.assets&Liabilities.assets');
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#regularInvestmentForm :input").attr("disabled", true);
            $("#regularInvestmentForm :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsRegularInvestCtrl', finGpsRegularInvestCtrl);
