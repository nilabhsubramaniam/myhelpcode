/**
 * GoalWise Dashboard - Controller for Goalwise view
 */
function goalWiseDashboardCtrl($scope, $state, $http, DTOptionsBuilder, thousandSeparator, toaster) {
    var resData = {};
    $scope.dynamicChartId = 'pie-plot1-chart';
    $scope.activeclass = "activeborder";
    var schemeallocation = [];
    var loadSchemeallocation = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.fundnamelist,
        }).then(function successCallback(response) {
            schemeallocation = response.data;
            $scope.getGoalsList("active");
        }, function errorCallback(response) {

        });
    };

    var getAssetAllocation = function (goalIndex) {
        var assetAllocation = {
            equityLarge: 0,
            equityMid: 0,
            debtLong: 0,
            debtShort: 0,
            gold: 0,
            liquid: 0,
            elss: 0,
            hybrid: 0
        };
        resData[goalIndex].funds.forEach(function (fund) {
            if (fund.category == 'EquityLarge') {
                assetAllocation.equityLarge += fund.marketValue;
            } else if (fund.category == 'EquityMid') {
                assetAllocation.equityMid += fund.marketValue;
            } else if (fund.category == 'DebtLong') {
                assetAllocation.debtLong += fund.marketValue;
            } else if (fund.category == 'DebtShort') {
                assetAllocation.debtShort += fund.marketValue;
            } else if (fund.category == 'Gold') {
                assetAllocation.gold += fund.marketValue;
            } else if (fund.category == "Liquid") {
                assetAllocation.liquid += fund.marketValue;
            } else if (fund.category == 'ELSS') {
                assetAllocation.elss += fund.marketValue;
            } else if (fund.category == 'Hybrid') {
                assetAllocation.hybrid += fund.marketValue;
            }
        });
        return assetAllocation;
    };
    $scope.init = function () {
        if (IsAdmin()) {
            if (window.currentUesrId != "" && window.currentUesrId !== undefined)
                loadSchemeallocation();
            else
                toaster.error({body: "Please load any one of profile!"});
        } else {
            loadSchemeallocation();
        }
    };


    $scope.type = 'danger';

    var sortArray = [];
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            {extend: 'excel', title: 'ExampleFile'},

            {
                extend: 'print',
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]);
    $scope.setIndividualGoal = function (type, src, name) {
        $scope.selected = type;
        var sortData = [];
        for (var i = 0; i < resData.length; i++) {
            if (type === resData[i].type) {
                sortData.push(resData[i]);
            }
        }
        $scope.goals = sortData;
    };

    $scope.getGoalsList = function (status) {
        var goalsList = [
            {name: "Home", src: "/img/goal_home_m.png", type: "home"},
            {name: "Vehicle", src: "/img/goal_vehicle_m.png", type: "vehicle"},
            {name: "Education", src: "/img/goal_education_m.png", type: "education"},
            {name: "Retirement", src: "/img/goal_retirement_m.png", type: "retirement"},
            {name: "Marriage", src: "/img/goal_marriage_m.png", type: "marriage"},
            {name: "Contingency", src: "/img/goal_contingency_m.png", type: "contingency"},
            {name: "Tax Planning", src: "/img/goal_taxPlanning_m.png", type: "taxPlanning"},
            {name: "Crorepati", src: "/img/goal_crorepati_m.png", type: "crorepati"},
            {name: "Wealth Creation", src: "/img/goal_wealthCreation_m.png", type: "wealthCreation"},
            {name: "Other", src: "/img/goal_other_m.png", type: "other"}

        ];
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=" + status + "&view=goal+fund&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data.length > 0) {
                resData = response.data;
                var tempArray = [];
                for (var i = 0; i < resData.length; i++) {
                    resData[i].updatedAt = moment(resData[i].updatedAt).format('DD-MM-YYYY HH:mm A');
                    resData[i].createdAt = moment(resData[i].createdAt).format('DD-MM-YYYY HH:mm A');
                    resData[i].percentAchievable = Math.round(resData[i].percentAchievable * 100);
                    resData[i].percentAchieved = Math.round(resData[i].percentAchieved * 100);
                    resData[i].assetAllocation = getAssetAllocation(i);

                    if (sortArray.indexOf(resData[i].type) == -1) {
                        for (var j = 0; j < goalsList.length; j++) {
                            if (resData[i].type === goalsList[j].type) {
                                tempArray.push(goalsList[j]);
                                sortArray.push(goalsList[j].type);
                                break;
                            }
                        }
                    }
                }
                if (sortArray.length > 1) {
                    var sortData = [];
                    for (var i = 0; i < resData.length; i++) {
                        if (sortArray[0] === resData[i].type) {
                            sortData.push(resData[i]);
                        }
                    }
                    $scope.goals = sortData;
                    $scope.selected = sortArray[0];
                } else {
                    $scope.goals = resData;
                }
                $scope.goalsList = tempArray;
            } else {
                toaster.error({body: "There is no active goals available"});
            }

        }, function errorCallback(response) {

        });
    };
    $scope.getFundName = function (_id) {
        for (var j = 0; j < schemeallocation.length; j++) {
            if (_id === schemeallocation[j].schemeId)
                return schemeallocation[j].scheme;
        }
    };
    $scope.getNumber = function (num) {
        return isNaN(num)?'Pending':Math.round(num);

    };
    $scope.getDecimal = function (num) {
        return isNaN(num)?'Pending':num.toFixed(2);
    };

    $scope.thousandseparator = thousandSeparator.thousandSeparator;
}
angular.module('finatwork').controller('goalWiseDashboardCtrl', goalWiseDashboardCtrl);