function healthResultCtrl($scope, $state, $http, $timeout) {

    //getting health profile result
    $http({
        method: 'GET',
        url: window.link.healthProfileResult + "/" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        if (response.data == null) {
            $state.go('forms.fin_health');
        }
        $scope.scores = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.value = 7;
    $scope.upperLimit = 9;
    $scope.lowerLimit = 3;
    $scope.unit = "";
    $scope.precision = 1;
    $scope.ranges = [
        {
            min: 3,
            max: 4.2,
            color: '#C50200'
        },
        {
            min: 4.2,
            max: 5.4,
            color: '#FF7700'
        },
        {
            min: 5.4,
            max: 6.6,
            color: '#FF7700'
        }
        ,
        {
            min: 6.6,
            max: 7.8,
            color: '#8DCA2F'
        },
        {
            min: 7.8,
            max: 9,
            color: '#8DCA2F'
        },

    ];
    $scope.getCategory = function (category) {
        return (category === "OverAll");
    };
    $scope.goNewState = function (state) {
        var currentState = "";
        switch (state) {
            case "FinTelligent":
                currentState = "dashboards.goals_home";
                break;
            case "FinGPS":
                currentState = "fingps";
                break;
            case "FinSure":
                currentState = "finsure";
                break;
            case "FinTax":
                currentState = "fintax";
                break;
            case "FinEstate":
                currentState = "finestate";
                break;
        }
        (currentState != "") ? $state.go(currentState) : $state.go("/dashboards/dashboard_1");
    };
    $scope.getScoreLabel = function (score) {
        var state = "";
        if (score > 7) state = "Excellent";
        if (score > 4 && score <= 7) state = "Good";
        if (score <= 4) state = "Poor";
        return state;
    };
    $scope.getStarted = function () {
        $state.go('dashboards.goals_home');
    }

}
angular.module('finatwork').controller('healthResultCtrl', healthResultCtrl);