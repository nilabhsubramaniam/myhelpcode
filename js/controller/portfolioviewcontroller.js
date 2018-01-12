/**
 * portfolioview - Controller for portfolioview
 */
function goalPortfolioDashboardCtrl($scope, $http, c3ChartService, thousandSeparator, toaster) {
    $scope.thousandseparator = thousandSeparator.thousandSeparator;
    $scope.gridData = [];
    $scope.portfoilo = {};
    $scope.showPortFolioPage = false;
    $scope.gridOptions = {
        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
        expandableRowHeight: 150,
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        }
    };

    $scope.gridOptions.columnDefs = [
        {name: 'Goal Type', field: "Type", width: '12%'},
        {name: 'Category', field: "Category", width: '10%'},
        {name: 'Folio No', field: "Folio", width: '13%'},
        {name: 'Scheme Name', field: "Scheme_Name", width: '19%'},
        {name: 'Invested Amt', field: "Invested_Amt", width: '10%'},
        {name: 'Current Value', field: "Current_Value", width: '9%'},
        {name: 'Profit', field: "Profit", width: '7%'},
        {name: 'Absolute Returns(%)', field: "Absolute_Returns", width: '10%'},
        {name: 'Annualized (xirr %)', field: "XIRR", width: '9%'}
    ];

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

    $scope.trxnDisplayType = {
        "NEWPUR": "Purchase",
        "NEW": "Purchase",
        "Fresh Purchase": "Purchase",
        "Fresh Purchase Systematic": "SIP",
        "SIP": "SIP",
        "SIN": "SIP",
        "Additional Purchase": "Additional Purchase",
        "ADDPUR": "Additional Purchase",
        "Add": "Additional Purchase",
        "Additional Purchase Systematic": "SIP",
        "SIPR": "SIP Rejection",
        "SINR": "SIP Rejection",
        "STPI": "S T P In",
        "STPA": "S T P In",
        "STPO": "S T P Out",
        "RED": "Redemption",
        "Partial Redemption": "Redemption",
        "Full Redemption": "Redemption",
        "Switch In": "Switch In",
        "SWIN": "Switch In",
        "SWINR": "Switch In Rejection"
    };

    $scope.schemeallocation = [];
    var loadSchemeAllocation = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.fundnamelist
        }).then(function successCallback(response) {
            $scope.schemeallocation = response.data;
            getFundData();
        }, function errorCallback(response) {

        });
    };

    $scope.chartType = {};

    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };

    $scope.goalAllocationID = 'goalAllocationID';
    $scope.goalAllocation = {
        data: {
            columns: [],
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return Math.round(value);
                }
            }
        }
    };

    $scope.amcAllocationID = 'amcAllocationID';
    $scope.amcAllocation = {
        data: {
            columns: [],
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return Math.round(value);
                }
            }
        }
    };

    $scope.assetAllocationID = 'assetAllocationID';
    $scope.assetAllocation = {
        data: {
            columns: [],
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    var format = "";
                    value = Math.round(value);
                    if (id === "DebtLong") format = "Debt - LongTerm: " + value;
                    if (id === "DebtShort") format = "Debt - ShortTerm: " + value;
                    if (id === "ELSS") format = "TaxSaving (ELSS): " + value;
                    if (id === "EquityLarge") format = "Equity - LargeCap: " + value;
                    if (id === "EquityMid") format = "Equity - MidCap: " + value;
                    if (id === "Gold") format = "Gold/International: " + value;
                    if (id === "Liquid") format = "Liquid: " + value;
                    if (id === "Hybrid") format = "Hybrid: " + value;
                    return format;
                }
            }
        }
    };

    function getAMCName(_id) {
        for (var j = 0; j < $scope.schemeallocation.length; j++) {
            if (_id === $scope.schemeallocation[j].schemeId)
                return $scope.schemeallocation[j].amc;
        }
    }

    function getFundName(_id) {
        for (var j = 0; j < $scope.schemeallocation.length; j++) {
            if (_id === $scope.schemeallocation[j].schemeId)
                return $scope.schemeallocation[j].scheme;
        }
    }

    $scope.init = function () {
        if (IsAdmin()) {
            if (window.currentUesrId != "" && window.currentUesrId !== undefined)
                loadSchemeAllocation();
            else
                toaster.error({body: "Please load any one of profile!"});
        } else {
            loadSchemeAllocation();
        }
    };

    function showAMCChart() {
        var folio, subFund, absReturn, xir, currentValue, investedAmt, profit;
        var tempArry = [];
        /* Grid Data */
        $scope.fundAll.forEach(function (fund) {
            if (fund.status === 'active') {
                fund.trxn.forEach(function (trxn) {
                    trxn.tradDate = moment(trxn.tradDate).format('DD-MMM-YYYY');
                    trxn.amount = Math.round(trxn.units * trxn.NAV);
                    trxn.trxnType = $scope.trxnDisplayType[trxn.trxnType];
                });
                folio = fund.folio;
                absReturn = (fund.absReturn * 100).toFixed(2);
                xir = (fund.xirr * 100).toFixed(2);
                currentValue = $scope.thousandseparator(Math.round(fund.marketValue));
                investedAmt = $scope.thousandseparator(Math.round(fund.investedCost));
                profit = $scope.thousandseparator(Math.round(fund.marketValue) - Math.round(fund.investedCost));
                subFund = fund.trxn;
            } else {
                folio = 'Pending';
                absReturn = 'Pending';
                xir = 'Pending';
                currentValue = 'Pending';
                investedAmt = 'Pending';
                profit = 'Pending';
                subFund = null;
            }
            $scope.gridData.push({
                Type: $scope.goalsDisplayName[fund.type],
                Category: fund.category,
                Scheme_Name: getFundName(fund._schemeId),
                Folio: folio,
                Invested_Amt: investedAmt,
                Current_Value: currentValue,
                Profit: profit,
                Absolute_Returns: absReturn,
                XIRR: xir,
                subFund: subFund
            })
        });

        $scope.gridData.forEach(function (data) {
            if (data.subFund !== null) {
                data.subGridOptions = {
                    columnDefs: [{name: "Date", field: "tradDate"}, {name: "Trxn Type", field: "trxnType"}, {
                        name: "Units",
                        field: "units"
                    }, {name: "NAV", field: "NAV"}, {name: "Amount", field: "amount"}],
                    data: data.subFund
                }
            }
        });

        if ($scope.portfoilo) {
            $scope.gridData.push({
                Type: "Total",
                Invested_Amt: $scope.thousandseparator(Math.round($scope.portfoilo.investedCost)),
                Current_Value: $scope.thousandseparator(Math.round($scope.portfoilo.marketValue)),
                Profit: $scope.thousandseparator(Math.round($scope.portfoilo.marketValue - $scope.portfoilo.investedCost)),
                Absolute_Returns: ($scope.portfoilo.absReturn * 100).toFixed(2),
                XIRR: ($scope.portfoilo.xirr * 100).toFixed(2)
            });
        }

        $scope.gridOptions.data = $scope.gridData;

        var fundObject = {};
        $scope.fundAll.forEach(function (item) {
            fundObject[item._schemeId] = fundObject[item._schemeId] || "";
        });

        var sortFund = Object.keys(fundObject);
        var amcNameWithSchemeId = [];
        sortFund.forEach(function (item) {
            amcNameWithSchemeId.push({_schemeId: item, amcname: getAMCName(item)});
        });

        var columns = [];
        amcNameWithSchemeId.forEach(function (amc) {
            tempArry.push(amc.amcname);
            $scope.fundAll.forEach(function (fund) {
                if (fund.marketValue) {
                    if (amc._schemeId === fund._schemeId)
                        tempArry.push(fund.marketValue);
                }
            });
            columns.push(tempArry);
            tempArry = [];
        });
        $scope.amcAllocation.data.columns = columns;
    }

    function getFundData() {
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=active&view=goal+fund+trxn&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data.length > 0) {
                var tempArry = [];
                $scope.showPortFolioPage = true;
                $scope.goalData = response.data;
                $scope.fundAll = [];
                $scope.goalData.forEach(function (goal) {
                    goal.funds.forEach(function (fund) {
                        fund.type = goal.type;
                    });
                    $scope.fundAll = $scope.fundAll.concat(goal.funds);
                });

                var fundObject = {};
                $scope.fundAll.forEach(function (item) {
                    fundObject[item.category] = fundObject[item.category] || "";
                });

                var sortFund = Object.keys(fundObject);

                var assetColumns = [];
                sortFund.forEach(function (elem) {
                    tempArry.push(elem);
                    $scope.fundAll.forEach(function (fund) {
                        if (fund.marketValue)
                            if (elem === fund.category)
                                tempArry.push(fund.marketValue);

                    });
                    assetColumns.push(tempArry);
                    tempArry = [];
                });
                $scope.assetAllocation.data.columns = assetColumns;

                var goalColumns = [];
                $scope.goalData.forEach(function (goal) {
                    tempArry.push(goal.type);
                    goal.funds.forEach(function (fund) {
                        if(fund.marketValue)
                            tempArry.push(fund.marketValue);
                    });
                    goalColumns.push(tempArry);
                    tempArry = [];
                });
                $scope.goalAllocation.data.columns = goalColumns;

                $http({
                    method: 'GET',
                    url: window.link.portfolio + '/' + getUserId(),
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    if (response.data) {
                        $scope.portfoilo = response.data;
                    }
                    showAMCChart();
                }, function errorCallback(response) {
                    console.log(response);
                });
            } else {
                toaster.error({body: "There is no active goals available"});
                $scope.showPortFolioPage = false;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('goalPortfolioDashboardCtrl', ['$scope', '$http', 'c3ChartService', 'thousandSeparator', 'toaster', goalPortfolioDashboardCtrl]);