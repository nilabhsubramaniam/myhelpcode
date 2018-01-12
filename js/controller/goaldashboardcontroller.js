function stopGoalModal($scope, close) {
    $scope.close = function (result) {
        close(result, 500);
    };
}
function goalDashboardCtrl($scope, DTOptionsBuilder, $http, thousandSeparator, goalData, $state, toaster, ModalService, $window) {
    var resData;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            {extend: 'excel', title: 'Goal_List'},
            {
                extend: 'pdf',
                customize: function (win) {
                    $scope.pdfGenerator();
                }
            }
        ])
        .withOption('bFilter', false);

    $scope.init = function () {
        if (IsAdmin()) {
            if (window.currentUesrId != "" && window.currentUesrId !== undefined) {
                getGoalsList('all');
                getBankDetails();
            } else {
                toaster.error({body: "Please load any one of profile!"});
            }
        } else {
            getGoalsList('all');
            getBankDetails();
        }
    };

    function getGoalsList(status) {
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=" + status + "&view=goal&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data.length > 0) {
                resData = response.data;
                for (var i = 0; i < resData.length; i++) {
                    resData[i].updatedAt = moment(resData[i].updatedAt).format('DD-MM-YYYY');
                    resData[i].createdAt = moment(resData[i].createdAt).format('DD-MM-YYYY');
                    resData[i].percentAchievable = Math.round(resData[i].percentAchievable * 100);
                    resData[i].percentAchieved = Math.round(resData[i].percentAchieved * 100);
                    resData[i].marketValue = Math.round(resData[i].marketValue);
                    resData[i].investedCost = Math.round(resData[i].investedCost);
                }
                $scope.goals = resData;

                $scope.ExcelData = [];

                $.each(resData, function (index, val) {
                    var tempObj = {
                        PersonalizedName: val.name,
                        CreationDate: val.createdAt,
                        Value: val.currentPrice,
                        NumberOfYears: val.maturity,
                        ValueFuture: val.futurePrice,
                        MonthlyInvestmentRequired: val.sipRequired,
                        MonthlyInvestmentCommitted: val.sip,
                        AchieveablePercent: val.percentAchievable,
                        AchievedAmount: val.marketValue - val.investedCost
                    };
                    // debugger;
                    $scope.ExcelData.push(tempObj);
                });
                $scope.filename = "Goals_List";
                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(drawSeriesChart);
            } else {
                toaster.error({body: "There is no goals available"});
            }
        }, function errorCallback(response) {

        });
    }

    function getBankDetails() {
        $http({
            method: 'GET',
            url: window.link.bank + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data !== null) {
                $scope.ACH_Status = response.data.umrn ? true : false;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.pdfGenerator = function () {
        var doc = new jsPDF('p', 'pt');

        var header = function (data) {
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFont("helvetica");
            doc.addImage(headerImgData, 'JPEG', 0, 0, 595, 82);
            //doc.text("Report", data.settings.margin.left + 20, 60);
        };

        doc.autoTable(getColumns(), getData(5), {
            beforePageContent: header,
            startY: doc.autoTableEndPosY() + 100,
            margin: {horizontal: 40},
            styles: {overflow: 'linebreak'},
            headerStyles: {fillColor: [128, 0, 0], textColor: [255, 255, 255], fontSize: 8},
            bodyStyles: {valign: 'top', textColor: [128, 0, 0], fontSize: 8},
            columnStyles: {},
            tableWidth: 'auto'
        });
        doc.save("goals.pdf");
    };

    var getColumns = function () {
        return [
            {title: "Personalized Name", dataKey: "PersonalizedName"},
            {title: "Goal Year", dataKey: "NumberOfYears"},
            {title: "Goal Future Value", dataKey: "ValueFuture"},
            {title: "Reqd Monthly Investment", dataKey: "MonthlyInvestmentRequired"},
            {title: "Amount Committed Lumpsum", dataKey: "LumpsumInvestmentCommitted"},
            {title: "Amount Committed Monthly", dataKey: "MonthlyInvestmentCommitted"},
            {title: "Goal Achieveable %", dataKey: "AchieveablePercent"},
            {title: "Goal Achieved %", dataKey: "AchievedPercent"},
            {title: "Goal Achieved Amount", dataKey: "AchievedAmount"}
        ];
    };

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

    function getData(rowCount) {
        var data = [];
        $.each($scope.goals, function (index, val) {
            var tempObj = {
                // Type: val.type,
                PersonalizedName: val.name || $scope.goalsDisplayName[val.type],
                Value: val.currentPrice,
                NumberOfYears: val.maturity,
                ValueFuture: val.futurePrice,
                MonthlyInvestmentRequired: val.sipRequired,
                MonthlyInvestmentCommitted: val.sip,
                LumpsumInvestmentCommitted: val.lumpsum,
                AchieveablePercent: val.percentAchievable,
                AchievedPercent: val.percentAchieved,
                AchievedAmount: val.marketValue - val.investedCost
            };
            data.push(tempObj);
        });
        return data;

    }

    $scope.isExecuteState = function (state) {
        return state === "set" || state === 'save';
    };

    $scope.isActiveState = function (state) {
        return state === "active" || state === "fullyActive";
    };

    $scope.isTopUpState = function (goalid) {
        var isTopUpState = false;
        $scope.goals.findIndex(function (goal) {
            if (goal._goalid === goalid) {
                if (goal.type !== "wealthCreation" && goal.type !== "taxPlanning" && goal.state === "fullyActive" && $scope.ACH_Status) {
                    /*check for on going Topup*/
                    if (moment() >= moment(goal.sipTopUpEndDate) || goal.sipTopUpEndDate === undefined) {
                        /*check for goal End Date*/
                        if (goal.type === 'contingency' || moment() < moment(goal.toDate)) {
                            isTopUpState = true;
                        }
                    }
                }
            }
        });
        return isTopUpState;
    };

    $scope.getNumber = function (num) {
        return Math.round(num);
    };

    $scope.thousandseparator = thousandSeparator.thousandSeparator;

    function drawSeriesChart() {
        var dynamicData = [];
        dynamicData.push(['ID', 'Goal Year', 'Portfolio Value', ' % Achieved', 'Goal value(FV)']);
        $.each(resData, function (index, val) {
            dynamicData.push([val.name || $scope.goalsDisplayName[val.type], val.maturity, Math.round(val.marketValue), val.percentAchieved, val.futurePrice]);
        });
        var data = google.visualization.arrayToDataTable(dynamicData);
        var minY = d3.min(resData, function (d) {
            return d.marketValue;
        });
        if (minY < 10000) minY = 10000;
        var options = {
            title: 'Goal Dashboard',
            vAxis: {
                title: 'Portfolio Value',
                minValue: minY,
                maxValue: d3.max(resData, function (d) {
                    return d.marketValue;
                })
            },
            hAxis: {
                title: 'Goal Maturity Year',
                minValue: d3.min(resData, function (d) {
                    return moment(d.createdAt, 'DD-MM-YYYY').year();
                }),
                maxValue: d3.max(resData, function (d) {
                    return d.maturity;
                }),
                format: ''
            },
            colorAxis: {minValue: 0, maxValue: 100, colors: ['red', 'yellow', 'green']},
            bubble: {
                textStyle: {
                    fontSize: 12,
                    fontName: 'Times-Roman',
                    color: 'green',
                    bold: true,
                    italic: true
                },
                opacity: 1
            }
        };
        var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
        chart.draw(data, options);
    }

    $scope.commitGoal = function (goalId) {
        $http({
            method: 'GET',
            url: window.link.create_goal + "/" + goalId + "?view=goal&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            goalData.setGoalData(response.data[0]);
            $state.go("dashboards.goal_info", {type: response.data[0].type, pagestatus: 'fromdashboard'});
        }, function errorCallback(response) {

        });
    };

    $scope.stopGoal = function (goalId) {
        ModalService.showModal({
            templateUrl: "views/terminateGoal_modal.html",
            controller: "stopGoalModal"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                modal.close.then(function (result) {
                    if (result) {
                        var data = {
                            _userid: getUserId(),
                            _goalid: goalId,
                            state: 'stop'
                        };
                        $http({
                            method: 'POST',
                            url: window.link.create_goal + "/" + goalId,
                            data: data,
                            headers: {'x-access-token': window.localStorage.getItem("token")}
                        }).then(function successCallback(response) {
                            toaster.success({body: "Thanks! Acknowledge email sent"});
                            getGoalsList('all');
                        }, function errorCallback(err) {
                            console.log(err);
                        });
                    }
                });

            });
        });
    };

    $scope.topUp = function (goalId) {
        $http({
            method: 'POST',
            url: window.link.create_goal + "/" + goalId,
            data: {state: 'createTopUp', _userid: getUserId()},
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            goalData.setGoalData(response.data);
            $state.go("dashboards.goal-top-up");
        }, function errorCallback(response) {

        });
    };

    $scope.deleteGoal = function (goalID) {
        ModalService.showModal({
            templateUrl: "views/goalDeletionModal.html",
            controller: "stopGoalModal"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    var data = {
                        token: window.localStorage.getItem("token"),
                        _userid: getUserId()
                    };
                    $http({
                        method: 'DELETE',
                        url: window.link.create_goal + '/' + goalID,
                        data: $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        getGoalsList('all');
                    }, function errorCallback(response) {
                        //toaster.error({body: response.data.error.message});
                    });
                }
            });
        });
    };

    var headerImgData = 'data:image/png;base64,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';
}
angular.module('finatwork').factory('goalData', function () {
    var service = {};
    var _data = {};

    service.setGoalData = function (data) {
        _data = data;
    };
    service.getGoalData = function () {
        return _data;
    };
    return service;
});
angular.module('finatwork')
    .controller('goalDashboardCtrl', goalDashboardCtrl)
    .controller('stopGoalModal', stopGoalModal);