function serviceRequestCTRL($scope, $state, $http, toaster) {

    $scope.init = function(){

    };

    $scope.sendRequest = function(){
        var action = {
            action: 'generate_pdf',
            _userid: window.localStorage.getItem("userid"),
            type:$scope.requestType,
            message:$scope.message,
            token: window.localStorage.getItem("token")
        };
        $http({
            method: 'POST',
            url: window.link.serviceRequest,
            data: $.param(action),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            toaster.success({body: "Thanks for placing the service request. Our Operations team will get back to you shortly"});
            $state.go("dashboards.dashboard_1");
        }, function errorCallback(response) {

        });
    };
}
angular.module('finatwork').controller('serviceRequestCTRL', serviceRequestCTRL);