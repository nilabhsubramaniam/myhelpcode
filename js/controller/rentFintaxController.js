/**
 * Created by Finatwork on 29-03-2017.
 */
function rentInfoCtrl($scope, $state, fintaxService,convertDigitsIntoWords) {
    $scope.formEditable = true;

    $scope.init = function () {
        fintaxService.getInfo().then(function (response) {
            if (!IsAdmin())formStatus(response.state);
            $scope.rentInfoFormData = response.rent;
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.submitRentInfo = function () {
        fintaxService.setInfo('rent', $scope.rentInfoFormData);
        $state.go("forms.fintax.investment");
    };
    $scope.$watch('rentInfoFormData.rent', function (val) {
        if (val && val > 0) {
            $scope.rentInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.rentInWords = "";
        }
    });
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#rentInfo :input").attr("disabled", true);
            $("#rentInfo :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('rentInfoCtrl', rentInfoCtrl);
