/**
 * Created by Nilabh on 19-04-2017.
 */
function filingPersonalInfoCtrl($scope, $state, fintaxFilingService, convertDigitsIntoWords, toaster) {
    $scope.formEditable = true;
    $scope.init = function () {
        fintaxFilingService.getInfo().then(function (response) {
            if (response != null) {
                if (!IsAdmin())formStatus(response.state);
            }
        }, function () {
            console.log(reason);
        });
        fintaxFilingService.getPersonalInfo().then(function (response) {
            if(response != null){
                $scope.personalInfoFormData = response;
            } else {
                $scope.personalInfoFormData = {};
            }
        }, function(reason){
            console.log(reason);
        });
    };
    $scope.submitPersonalInfo = function () {
        fintaxFilingService.setPersonalInfo($scope.personalInfoFormData);//should be via promise
        toaster.success({body: "Personal Information saved"});
    };
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingPersonalInfo :input").attr("disabled", true);
            $("#filingPersonalInfo :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingPersonalInfoCtrl', filingPersonalInfoCtrl);