/*** Created by Nilabh on 12-09-2017.*/
function finGpsAdditionalGoalsCtrl($scope, $state, $http, toaster, finGpsService) {
    $scope.finGpsAdditionalGoalsForm = {};
    $scope.todayDate =  moment().hours(23).minutes(59).seconds(59).milliseconds(0);
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('additionalGoals').then(function (response) {
            if (response != null && response.additionalGoals.goals != null && response.additionalGoals.goals.length != 0) {
                if (!IsAdmin()) formStatus(response.state);
                $scope.additionalGoalList = response.additionalGoals.goals;
                $scope.finGpsAdditionalGoalsForm.comment = response.additionalGoals.comment;
            } else {
                $scope.additionalGoalList = [
                    {
                        _id: 0,
                        additionalType: '',
                        name: '',
                        year: '',
                        amount: '',
                        priority: ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });
        loadGoalType();
    };
    var loadGoalType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.goalType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.goalTypeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.additionalGoalList = [
        {
            _id: 0,
            additionalType: '',
            name: '',
            year: '',
            amount: '',
            priority: ''
        }
    ];
    $scope.addAdditionalGoal = function (goal) {
        var tmp = {"_id": 0, "additionalType": '', "name": '', "year": '', "amount": '', "priority": ''};
        tmp._id = goal._id + 1;
        $scope.additionalGoalList.push(tmp);
    };
    $scope.deleteAdditionalGoal = function (index) {
        $scope.additionalGoalList.splice(index, 1);
    };
    $scope.submitAdditionalGoal = function () {
        var goalLists = {
            goals: $scope.additionalGoalList,
            comment: $scope.finGpsAdditionalGoalsForm.comment
        };
        finGpsService.setInfo('additionalGoals', goalLists);
        $state.go('forms.finGps.finGpsCashFlow.incomeCashFlow');
        toaster.success("Saved successfully");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#finGpsAdditionalGoalsForm :input").attr("disabled", true);
            $("#finGpsAdditionalGoalsForm :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsAdditionalGoalsCtrl', finGpsAdditionalGoalsCtrl);