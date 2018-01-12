function fundlistcontroller($scope, $state, $http, $window, fundData, c3ChartService, $q) {
    var chartData = [];
    $scope.lumpSumAvailable = false;
    $scope.sipAvailable = false;
    var schemeAllocation = [];
    $scope.getCategoryName = function (_id) {
        var name = "";
        switch (_id) {
            case "EquityLarge":
                name = "Equity - LargeCap";
                break;
            case "EquityMid":
                name = "Equity - MidCap";
                break;
            case "DebtShort":
                name = "Debt - ShortTerm";
                break;
            case "DebtLong":
                name = "Debt - LongTerm";
                break;
            case "Gold":
                name = "Gold/International";
                break;
            case "Liquid":
                name = "Liquid";
                break;
            case "ELSS":
                name = "TaxSaving (ELSS)";
                break;
            case "Hybrid":
                name = "Hybrid";
                break;

        }
        return name;
    };
    $scope.getFundName = function (_id) {
        for (var j = 0; j < schemeAllocation.length; j++) {
            if (_id === schemeAllocation[j].schemeId)
                return schemeAllocation[j].scheme;
        }
    };
    var loadSchemeAllocation = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.fundnamelist
        }).then(function successCallback(response) {
            schemeAllocation = response.data;
            $scope.goal = fundData.getFundData();//TODO fundAll shouldn't be an array
            var sipArray = [], lumpSumArray = [];
            $scope.goal.funds.forEach(function (fund) {
                fund.schemename = $scope.getFundName(fund._schemeId);
                if (fund.lumpsum) {
                    $scope.lumpSumAvailable = true;
                    lumpSumArray.push(fund);
                }
                if (fund.sip) {
                    $scope.sipAvailable = true;
                    sipArray.push(fund);
                }
            });
            $scope.goal.lumpSumAvailable = $scope.lumpSumAvailable;
            $scope.goal.sipAvailable = $scope.sipAvailable;
            $scope.goal.sipArray = sipArray;
            $scope.goal.lumpSumArray = lumpSumArray;

            if($scope.goal.sipTopUp){
                if($scope.goal.sipCycle && $scope.goal.sipStartDate){
                    $scope.showSIPOptions = false;
                } else {
                    $scope.showSIPOptions = true;
                }
            } else {
                $scope.showSIPOptions = $scope.sipAvailable;
            }
        }, function errorCallback(response) {

        });
    };
    $scope.dynamicChartId = 'pie-plot1-chart';
    $scope.dynamicSIPChartId = 'pie-sip-chart';
    $scope.chartType = {};
    $scope.funds = [];
    $scope.data = {
        columns: chartData,
        type: 'pie'
    };
    $scope.init = function () {
        $scope.sipOptions = {
            sipCycle: '',
            firstSipDate: "firstPref"
        };
        loadSchemeAllocation();
        getACHDetails();
    };
    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };

    $scope.sipCycleChange = function (val) {
        var fromDate = getSIPStartDates(val, $scope.ACH_Status);
        $scope.firstPref = fromDate.firstPref.format('DD-MMM-YYYY');
        $scope.secondPref = fromDate.secondPref.format('DD-MMM-YYYY');
    };
    $scope.executeGoals = function (goalId) {

        var data = {
            _userid: getUserId(),
            state: $scope.goal.state === 'save'?'execute':'executeTopUp'
        };
        if ($scope.sipOptions.sipCycle) {
            data.fromDate = $scope.sipOptions.firstSipDate === "firstPref" ? $scope.firstPref : $scope.secondPref;
            data.sipCycle = $scope.sipOptions.sipCycle;
        }
        $http({
            method: 'POST',
            url: window.link.create_goal + "/" + goalId,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var isSipAvailable = false;
            response.data.forEach(function (fund) {
                if (fund.hasOwnProperty('sip') && fund.sip > 0) isSipAvailable = true;
            });
            $state.go("dashboards.nschandover", {sip: isSipAvailable, lumpsum: true});
        }, function errorCallback(response) {
            $state.go("dashboards.transaction-view");
        });
    };

    $scope.getTotal = function (array, key) {
        var total = 0;
        for (var i = 0; i < array.length; i++) {
            var product = array[i];
            total += product[key];
        }
        return total;
    };
    function getACHDetails() {
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
}

angular.module('finatwork').controller('fundlistcontroller', ['$scope', '$state', '$http', '$window', 'fundData', 'c3ChartService', fundlistcontroller]);
