function reSendOTPCtrl($scope, $http ,toaster, $location) {

    $scope.email = "";
    $scope.resendOTP = function () {

        var otpData = {
            username: $scope.email
        };
        var url = window.link.resend_otp;
        $http({
            method: 'POST',
            url: url,
            data: $.param(otpData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            toaster.success({body: 'New OTP is sent to your mobile no'});
            $location.path("/verify_otp");
        }, function errorCallback(response) {

        });
    }
}
 
angular.module('finatwork').controller('reSendOTPCtrl', reSendOTPCtrl);
