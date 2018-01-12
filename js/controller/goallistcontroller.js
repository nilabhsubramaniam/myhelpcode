function goallistcontroller($scope, $state, $http, toaster, fundData) {
    $scope.disabled = function () {
        return true;
    };
    $scope.formStatus = false;

    $scope.goalsDisplayName = {
        "home": "Home",
        "vehicle": "Vehicle",
        "education": "Education",
        "retirement": "Retirement",
        "marriage": "Marriage",
        "contingency": "Contingency",
        "taxPlanning": "Tax Planning",
        "crorepati": "Crorepati",
        "wealthCreation": "Wealth Creation",
        "other": "Other"
    };

    $scope.init = function () {
        formStatus();
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=inactive&view=goal&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            response.data.forEach(function (goal) {
                goal.name = goal.name || $scope.goalsDisplayName[goal.type];
            });
            $scope.goallists = response.data;
        }, function errorCallback(response) {

        });
    };

    $scope.delete = function (index) {
        var goal_id = $scope.goallists[index]._goalid;
        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId()
        };

        $http({
            method: 'DELETE',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.goallists.splice(index, 1);
        }, function errorCallback(response) {
            //toaster.error({body: response.data.error.message});
        });
    };

    $scope.isEditable = function (index) {
        $scope.goallists[index].isEditable = !$scope.goallists[index].isEditable;
        $scope.goallists[index].isLumpsumEditable = !$scope.goallists[index].isLumpsumEditable;
        $scope.goallists[index].isSIPEditable = !$scope.goallists[index].isSIPEditable;
        return $scope.goallists[index].isEditable;
    };

    $scope.Submit = function () {
        var data = {};
        angular.forEach($scope.goallists, function (goal) {
            if (goal.isUpdated) {
                data = {
                    _userid:getUserId(),
                    _goalid:goal._goalid,
                    state: "set"
                };
            }
        });

        if (!data.state) {
            toaster.error({body: "Please select a goal would you like to commit"});
            return;
        }

        if ($scope.formStatus) {
            $http({
                method: 'POST',
                url: window.link.create_goal,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                fundData.setFundData(response.data);
                $state.go("dashboards.fund_list");
            }, function errorCallback(response) {
                toaster.error({body: 'We build a personalized portfolio for an investment more than threshold limit (lumpsum: 10 lakhs, SIP: 1.5 lakhs/month), our advisor will help you construct the same'});
            });
        } else {
            $state.go("forms.wizard.personal-info");
        }
    };

    $scope.updateGoal = function (index) {
        var goal_id = $scope.goallists[index]._goalid;

        var lumpmsumAmount = parseInt($scope.goallists[index].lumpsum);
        var monthlyInvestment = parseInt($scope.goallists[index].sip);
        var type = $scope.goallists[index].type;

        if (lumpmsumAmount <= 0 || isNaN(lumpmsumAmount)) lumpmsumAmount = 0;
        if (monthlyInvestment <= 0 || isNaN(monthlyInvestment)) monthlyInvestment = 0;

        if (!validateAmount(lumpmsumAmount, monthlyInvestment, type)) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpsum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            $scope.goallists[index].lumpsum = 0;
            $scope.goallists[index].sip = 0;
            $scope.goallists[index].isEditable = false;
            $scope.goallists[index].isLumpsumEditable = false;
            $scope.goallists[index].isSIPEditable = false;

            return;
        }

        if (type === "taxPlanning") {
            if(($scope.goallists[index].tenure * monthlyInvestment + lumpmsumAmount) > $scope.goallists[index].currentPrice){
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                $scope.goallists[index].lumpsum = 0;
                $scope.goallists[index].sip = 0;
                $scope.goallists[index].isEditable = false;
                $scope.goallists[index].isLumpsumEditable = false;
                $scope.goallists[index].isSIPEditable = false;
                return;
            }
        }

        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            lumpsum: (isNaN(parseInt($scope.goallists[index].lumpsum))) ? 0 : parseInt($scope.goallists[index].lumpsum),
            sip: (isNaN(parseInt($scope.goallists[index].sip))) ? 0 : parseInt($scope.goallists[index].sip),
            state: "cal"
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.goallists[index].percentAchievable = response.data.percentAchievable;
        }, function errorCallback(response) {
            //toaster.error({body: response.data.err.message});
        });

        $scope.goallists[index].isEditable = !$scope.goallists[index].isEditable;
        $scope.goallists[index].isLumpsumEditable = !$scope.goallists[index].isLumpsumEditable;
        $scope.goallists[index].isSIPEditable = !$scope.goallists[index].isSIPEditable;
        return $scope.goallists[index].isEditable;
    };

    $scope.getPercentage = function (percentage) {
        return Math.round(percentage * 100);
    };

    $scope.addNewGoal = function () {
        $state.go("dashboards.goals_home");
    };

    $scope.updateSelection = function (position, goallists) {
        angular.forEach(goallists, function (goallist, index) {
            if (position != index)
                goallist.isUpdated = false;
        });
    };

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "active") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').factory('fundData', function () {
    var service = {};
    var _data = {};

    service.setFundData = function (data) {
        _data = data;
    };
    service.getFundData = function () {
        return _data;
    };
    return service;
});
angular.module('finatwork').controller('goallistcontroller', goallistcontroller);