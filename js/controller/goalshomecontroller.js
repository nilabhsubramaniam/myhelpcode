/**
 * NomineeInfo - Controller for NomineeInfo Form
 */
function goalsHome($scope, $state, $http) {
    $scope.formStatus = false;
    $scope.riskProfileStatus = false;

    $scope.goals = [
	    {name:"Home",src:"/img/goal_home_m.png", type: "home"},
	    {name:"Vehicle",src:"/img/goal_vehicle_m.png", type: "vehicle"},
	    {name:"Education",src:"/img/goal_education_m.png", type: "education"},
	    {name:"Retirement",src:"/img/goal_retirement_m.png", type: "retirement"},
	    {name:"Marriage",src:"/img/goal_marriage_m.png", type: "marriage"},
	    {name:"Contingency",src:"/img/goal_contingency_m.png", type: "contingency"},
        {name:"Tax Planning",src:"/img/goal_taxPlanning_m.png", type: "taxPlanning"},
        {name:"Crorepati",src:"/img/goal_crorepati_m.png", type: "crorepati"},
        {name:"Wealth Creation",src:"/img/goal_wealthCreation_m.png", type: "wealthCreation"},
        {name:"Other",src:"/img/goal_other_m.png", type: "other"}
    ];
    
    $scope.init = function(){
         riskProfileStatus();
    };

    $scope.goalDetails = function(type){
        if($scope.riskProfileStatus)
            $state.go("dashboards.goal_info", {type: type,pagestatus:'fromhome'});
        else
            $state.go("forms.risk_profile");
    };

    function riskProfileStatus()  {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" +getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if(response.data.riskProfile == null){
                $scope.riskProfileStatus = false;
            } else {
                $scope.riskProfileStatus = response.data.riskProfile;
            }
        }, function errorCallback(response) {
            console.log("Error" + response);
        });
    }
}
angular.module('finatwork').controller('goalsHome', goalsHome);