/*** Created by Nilabh on 11-08-2017.*/
function finGpsImpGoalsCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.finGpsRetirementGoals = {};
    $scope.finGpsContingencyGoals = {};
    $scope.childrenDetailsList = [
        {
            _id: 0,
            offspring: '',
            category: '',
            startYear: '',
            endYear: '',
            amount: '',
            priority: ''
        }
    ];

    $scope.init = function () {
        finGpsService.getInfo().then(function (response) {
            if (response != null) {
                if (response.retirementGoals) {
                    $scope.finGpsRetirementGoals = response.retirementGoals;
                } else {
                    $scope.finGpsRetirementGoals.retirementAge = 60;
                    $scope.finGpsRetirementGoals.lifestyleChange = "same";
                }
                if (response.contingencyGoals) {
                    $scope.finGpsContingencyGoals = response.contingencyGoals;
                } else {
                    $scope.finGpsContingencyGoals = {};
                }
                if (response.childGoal && response.childGoal.childGoals.length > 0) {
                    $scope.childrenDetailsList = response.childGoal.childGoals;
                    $scope.userComment = response.childGoal.comment;
                } else {
                    $scope.childrenDetailsList = [{
                        _id: 0,
                        offspring: '',
                        category: '',
                        startYear: '',
                        endYear: '',
                        amount: '',
                        priority: ''
                    }];
                }
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.addOffspring = function (childrenDetails) {
        var tmp = {
            "_id": 0,
            "offspring": '',
            "category": '',
            "startYear": '',
            "endYear": '',
            "amount": '',
            "priority": ''
        };
        tmp._id = childrenDetails._id + 1;
        $scope.childrenDetailsList.push(tmp);
    };
    $scope.deleteOffspring = function (index) {
        $scope.childrenDetailsList.splice(index, 1);
    };
    $scope.submit = function () {
        var finGpsRetirementGoals = {
            retirementAge: $scope.finGpsRetirementGoals.retirementAge,
            lifestyleChange: $scope.finGpsRetirementGoals.lifestyleChange,
            retirementComment: $scope.finGpsRetirementGoals.retirementComment
        };
        finGpsService.setInfo('retirementGoals', finGpsRetirementGoals);
        // $state.go('forms.finGps.goal.additionalGoal');
    };
    $scope.submitContingencyGoal = function () {
        var finGpsContingencyGoals = {
            contingencyFund: $scope.finGpsContingencyGoals.contingencyFund,
            contingencyComment: $scope.finGpsContingencyGoals.contingencyComment
        };
        finGpsService.setInfo('contingencyGoals', finGpsContingencyGoals);
        // $state.go('forms.finGps.goal.additionalGoal');
    };
    $scope.submitChildsGoal = function () {
        for (var i = 0; i < $scope.childrenDetailsList.length; i++) {
            $scope.childrenDetailsList.startYear = moment($scope.childrenDetailsList.startYear).format('YYYY-MM-DD'),
            $scope.childrenDetailsList.endYear = moment($scope.childrenDetailsList.endYear).format('YYYY-MM-DD')
        }
        var finGpsChildGoals = {
            childGoals: $scope.childrenDetailsList,
            comment: $scope.userComment
        };
        finGpsService.setInfo('childGoal', finGpsChildGoals);
        $state.go('forms.finGps.goal.additionalGoal');
    };

}
angular.module('finatwork').controller('finGpsImpGoalsCtrl', finGpsImpGoalsCtrl);
