/*** Created by Nilabh on 29-06-2017. goalTopUpController*/
function goalTopUpController($scope, $state, $http, c3ChartService, convertDigitsIntoWords, thousandSeparator, toaster, goalData, fundData) {
    $scope.goalData = goalData.getGoalData();
    $scope.monthlyTopUp = $scope.goalData.sipRequiredTopUp;
    $scope.goalData.marketValue = Math.round( $scope.goalData.marketValue);
    $scope.accumulatedAmt = $scope.goalData.futurePrice;
    $scope.goalimagesrc = "/img/goal_" + $scope.goalData.type + "_m.png";
    $scope.thousandseparator = thousandSeparator.thousandSeparator;
    $scope.FDtoRealDiff = 0;
    $scope.areaChartFuturePrice = $scope.goalData.type === 'retirement' ? $scope.goalData.retCorpus:$scope.goalData.futurePrice;
    $scope.balanceYear = Math.floor(($scope.goalData.balMonths)/12);
    $scope.balanceMonth =($scope.goalData.balMonths)%12;
    $scope.monthlyTopUp = $scope.goalData.sipRequiredTopUp <= 0 ? 0:$scope.monthlyTopUp

    //Gauge
    $scope.dynamicChartId = 'chart';
    $scope.chartType = {};
    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };
    $scope.chart = {
        data: {
            type: 'gauge',
            columns: [['data', Math.round($scope.goalData.percentAchievable * 100)]],
            onclick: function (d, i) {//TODO check if it can be removed
                console.log("onclick", d, i);
            }
        },
        gauge: {
            label: {
                format: function (value, ratio) {
                    return value;
                },
                show: true // to turn off the min/max labels.
            },
            min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            max: 100, // 100 is default
            units: ' %   Goal achievable',
            width: 39 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return value + " % of goal achievable";
                }
            }
        }
    };

    $scope.topUpDynamicChartID = 'topUpChart';
    $scope.topUpchartType = {};
    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.topUpchartType[serie], serie);
    };
    $scope.topUpchart = {
        data: {
            type: 'gauge',
            columns: [['data', 100]],//check and change later
            onclick: function (d, i) {
                console.log("onclick", d, i);
            }
        },
        gauge: {
            label: {
                format: function (value, ratio) {
                    return value;
                },
                show: true // to turn off the min/max labels.
            },
            min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            max: 100, // 100 is default
            units: ' %   Goal achievable',
            width: 39 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return value + " % of goal achievable";
                }
            }
        }
    };
    //Area chart
    $scope.areaChartId = 'areaChart';
    $scope.areaChart = {
        data: {
            columns: [
                ['FD', 73877, 152592, 236462, 325824, 421038],
                ['Real', 74783, 156581, 246052, 343916, 450961],
                ['Optimist', 75566, 160085, 254618, 360352, 478614],
                ['Pessimist', 74010, 153173, 237848, 328419, 425296]
            ],
            types: {
                FD: 'area-spline',
                Real: 'area-spline',
                Optimist: 'area-spline',
                Pessimist: 'area-spline'
            }
        },
        size: {
            height: 380,
            width: 800
        },
        color: {
            pattern: ['#0000ff', '#008000', '#ff0000', '#ffa500']
        },
        legend: {
            position: 'right'
        },
        grid: {
            y: {
                lines: [
                    {value: 0, text: '', position: 'start'},
                    {value: 0, text: '', position: 'start'}
                ]
            },
            x: {
                lines: [
                    {value: 0, text: '', position: 'middle'}
                ]
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return $scope.thousandseparator(value);
                }
            }
        }
    };

    $scope.init = function () {
        poplulateAreaChart($scope.goalData.graph);
        switch ($scope.goalData.type) {
            case 'retirement':
                $scope.accumulateText = "Accumulate a corpus of";
                $scope.accumulatedAmt = $scope.goalData.retCorpus;
                $scope.areachartLabel = "Additional returns over PPF in a Realistic scenario : ";
                break;
            case 'taxPlanning':
                $scope.accumulateText = "Invest";
                break;
            default:
                $scope.accumulateText = 'Accumulate';
                $scope.areachartLabel = "Additional returns over PPF in a Realistic scenario : ";

        }
    };

    $scope.visualizeGoalTopUp = function () {
        var topUpLumpSum = parseInt($scope.lumpSumTopUp);
        var topUpSIP = parseInt($scope.monthlyTopUp);

        if (topUpLumpSum <= 0 || isNaN(topUpLumpSum)) topUpLumpSum = 0;
        if (topUpSIP <= 0 || isNaN(topUpSIP)) topUpSIP = 0;

        if (!(validateAmount(topUpLumpSum, topUpSIP, $scope.goalData.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpSum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }
        if ($scope.goalData.type === "taxPlanning") {
            if (( $scope.goalData.currentPrice < (($scope.goalData.tenure *$scope.monthlyTopUp) +$scope.lumpSumTopUp))) {
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }
        var data = {
            _userid: getUserId(),
            _goalid: $scope.goalData._goalid,
            state: 'calTopUp',
            lumpsumTopUp: topUpLumpSum,
            sipTopUp: topUpSIP
        };
        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + data._goalid,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var percentage = response.data.percentAchievableTopUp * 100;
            $scope.topUpchart.data.columns = [['data', Math.round(percentage.toFixed(2))]];
            poplulateAreaChart(response.data.graph);
          }, function errorCallback(response) {
            console.log(response);
        });
    };

    //Next screen view
    $scope.setGoalTopUp = function () {

        var topUpLumpSum = parseInt($scope.lumpSumTopUp);
        var topUpSIP = parseInt($scope.monthlyTopUp);

        if (topUpLumpSum <= 0 || isNaN(topUpLumpSum)) topUpLumpSum = 0;
        if (topUpSIP <= 0 || isNaN(topUpSIP)) topUpSIP = 0;

        if (!(validateAmount(topUpLumpSum, topUpSIP, $scope.goalData.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpSum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }
        if ($scope.goalData.type === "taxPlanning") {
            if (( $scope.goalData.currentPrice < (($scope.goalData.tenure *$scope.monthlyTopUp) +$scope.lumpSumTopUp))) {
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }

        var data = {
            _userid: getUserId(),
            _goalid: $scope.goalData._goalid,
            state: 'setTopUp',
            lumpsumTopUp: topUpLumpSum,
            sipTopUp: topUpSIP
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + data._goalid,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            fundData.setFundData(response.data);
            $state.go("dashboards.fund_list");
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.$watch('lumpSumTopUp', function (val) {
        if (val && val > 0) {
            $scope.lumsumTopUpInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.lumsumTopUpInWords = "";
        }
    });
    $scope.$watch('monthlyTopUp', function (val) {
        if (val && val > 0) {
            $scope.sipTopUpInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.sipTopUpInWords = "";
        }
    });

    function poplulateAreaChart(graph){
          var tmpArray = [];
            var columns = [];
            if ($scope.goalData.type === "taxPlanning") {
                tmpArray.push("PPF");
                graph.PPF.forEach(function (elem) {
                    tmpArray.push(elem);
                });
                columns.push(tmpArray);
                tmpArray = [];
            } else {
                tmpArray.push("FD");
                graph.FD.forEach(function (elem) {
                    tmpArray.push(elem);
                });
                columns.push(tmpArray);
                tmpArray = [];
            }
            tmpArray.push("Optimist");
            graph.Optimist.forEach(function (elem) {
                tmpArray.push(elem);
            });
            columns.push(tmpArray);
            tmpArray = [];
            tmpArray.push("Pessimist");
            graph.Pessimist.forEach(function (elem) {
                tmpArray.push(elem);
            });
            columns.push(tmpArray);
            tmpArray = [];
            tmpArray.push("Real");
            graph.Real.forEach(function (elem) {
                tmpArray.push(elem);
            });
            columns.push(tmpArray);
            var types = {};
            if ($scope.goalData.type === "taxPlanning") {
                types = {
                    "PPF": "area-spline",
                    "Optimist": "area-spline",
                    "Pessimist": "area-spline",
                    "Real": "area-spline"
                };
            } else {
                types = {
                    "FD": "area-spline",
                    "Optimist": "area-spline",
                    "Pessimist": "area-spline",
                    "Real": "`area-spline"
                };
            }
            if ($scope.goalData.type === "taxPlanning") {//TODO need to revist for tax planning
                $scope.areaChart.grid.x.lines[0].value = 3;
                $scope.areaChart.grid.x.lines[0].text = "Lock-in period ends";
                $scope.FDtoRealDiff = graph.Real[graph.length - 1] - graph.PPF[graph.PPF.length - 1];
            } else {
                $scope.areaChart.grid.y.lines[0].value = $scope.areaChartFuturePrice;
                $scope.areaChart.grid.y.lines[0].text = "Future Value :" + $scope.thousandseparator($scope.areaChartFuturePrice);
                if ($scope.goalData.type != "retirement" && $scope.goalData.type != "crorepati") {
                    $scope.areaChart.grid.y.lines[1].value = $scope.goalData.currentPrice;
                    $scope.areaChart.grid.y.lines[1].text = "Current Value : " + $scope.thousandseparator($scope.goalData.currentPrice);
                }
                $scope.areaChart.grid.x.lines = [];
                $scope.FDtoRealDiff = graph.Real[graph.Real.length - 1] - graph.FD[graph.FD.length - 1];
            }
            $scope.areaChart.data = {columns: columns, types: types};
    }
}
angular.module('finatwork').controller('goalTopUpController', goalTopUpController);

