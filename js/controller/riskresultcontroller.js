
function riskResultCtrl($scope, $state, $http, c3ChartService) {

    //Area chart
    /*$scope.chartType = {};

    $scope.transform = function(chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };
    $scope.riskprofilechartID = 'riskprofileID';
    $scope.riskprofilechart = {

        data: {
            columns: [
                ['Profile',0,1,2,3,4,5,6],
            ],
            colors: {
                Profile: '#0000ff'
            }
        },
        zoom: {
            enabled: true
        },
        axis: {
            y: {
                max: 7,
                min: 1,
                label: {
                    text: 'Risk',
                    position: 'outer-middle'
                }
            },
            x: {
                max: 5,
                min: 0,
                label: {
                    text: 'Return',
                    position: 'outer-center'
                }
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    var format = "";
                    if(value === 1)format = "Conservative";
                    if(value === 2)format = "Moderately Conservative";
                    if(value === 3)format = "Balanced";
                    if(value === 4)format = "Moderately Aggressive";
                    if(value === 5)format = "Aggressive";
                    return format;
                }
            }
        },
        legend: {
            show: false
        },
        regions: [
            {axis: 'x', start:0, end: 0, class: 'green'},
        ]
    };*/

    //getting risk profile result
    $http({
        method: 'GET',
        url: window.link.riskProfileResult + "/" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        if (response.data == 0) {
            return false;
        }
        $scope.profile_risk = response.data.profile;
        $scope.text_risk = response.data.text;
        if(response.data.profile === "Conservative")
            $scope.profileImageSrc = "/img/conservative.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:0.5, end: 1.5, class: 'green'}];
        if(response.data.profile === "Moderately Conservative")
            $scope.profileImageSrc = "/img/moderately_conservative.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:1.5, end: 2.5, class: 'green'}];
        if(response.data.profile === "Balanced")
            $scope.profileImageSrc = "/img/balanced.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:2.5, end: 3.5, class: 'green'}];
        if(response.data.profile === "Moderately Aggressive")
            $scope.profileImageSrc = "/img/moderately_aggressive.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:3.5, end: 4.5, class: 'green'}];
        if(response.data.profile === "Aggressive")
            $scope.profileImageSrc = "/img/aggressive.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:4.5, end: 5.5, class: 'green'}];
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.SetupGoal = function () {
        $state.go('dashboards.goals_home');
    };
}
angular.module('finatwork').controller('riskResultCtrl',['$scope', '$state', '$http' , 'c3ChartService', riskResultCtrl]);