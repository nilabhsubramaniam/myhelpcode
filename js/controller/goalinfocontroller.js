/**
 * NomineeInfo - Controller for NomineeInfo Form
 */
function goalInfo($scope, $state, $http, $window, c3ChartService, convertDigitsIntoWords, thousandSeparator, goalData, $uibModal, $rootScope, toaster) {
    $scope.type = $state.params.type;
    $scope.pageStatus = $state.params.pagestatus;
    $scope.goalName = "";
    $scope.requestpage = true;
    $scope.responsepage = false;
    $scope.graphResponse = {};
    $scope.percentateFrom = 1;
    var goal_id = "";
    //$scope.goalInfoFormData_loan = 1;
    $scope.goalInfoFormData_year = 1;
    //$scope.goalInfoFormData_month = 1;
    //$scope.goalInfoFormData_achievemonth = 1;
    $scope.isLoanPercentRequired = "";
    $scope.tenureMin = 0;
    $scope.tenureMax = 50;
    $scope.FDtoRealDiff = 0;
    $scope.areaChartFeaturePrice = 0;
    $scope.goalLabel = {
        currentprice: "Current Cost of Goal",
        investibleAmtMonth: "Investible amount per month",
        investibleAmtLumsum: "Investible amount in lumpsum ",
        year: "Number of Years ",
        percentage: "Percentage of Loan",
        isRequiredGoalByName: true,
        isRequiredPercentage: true,
        goalNamePlaecHolder: "Personalise your goal by naming it ",
        currentPricePlaecHolder: "Current price of the house that you want to purchase",
        yearPlaecHolder: "Years to achieve this goal",
        loanPercentagePlaecHolder: "Percentage of the house funded by a home loan",
        amountMaxLength: 2,
        todaycost: "Today's cost",
        featurecost: "Future Cost",
        corpusLabel: "Corpus required for downpayment ",
        corpustooltip: "Downpayment you will need to make",
        investmentLabel: "Monthly Investment required ",
        investmenttooltip: " Monthly Investment required for downpaymnet",
        guagenote: "",
        areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
        accumulateText: "Accumulate"
    };
    if ($state.params.type === "vehicle")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal ",
            year: "Number of Years ",
            percentage: "Percentage of Loan",
            isRequiredGoalByName: true,
            isRequiredPercentage: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Cost of the vehicle that you want to purchase",
            yearPlaecHolder: " years to achieve this goal",
            loanPercentagePlaecHolder: "percentage of the vehicle cost will be funded by loan",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            corpustooltip: "Downpayment you will need to make",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for downpaymnet",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "contingency")
        $scope.goalLabel = {
            currentprice: "Monthly Expenses",
            year: "Contingency Fund",
            percentage: "Amount percentage",
            isRequiredGoalByName: true,
            isRequiredPercentage: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Total monthly expenses excluding avoidable lifestyle expenses ",
            yearPlaecHolder: "Months of expenses would you like to cover through a contingency fund",
            loanPercentagePlaecHolder: "Enter the amount lying in savings bank accounts",
            amountMaxLength: 2,
            lyingamount: "Savings a/c Balance",
            lyingAmountPlaecHolder: "Amount lying in savings bank accounts",
            achieveMonth: "Time to build",
            todaycost: "Monthly Expenses",
            featurecost: "Contingency corpus required",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "retirement") {
        $scope.goalLabel = {
            currentprice: "Current Monthly Expenses",
            year: "Retirement Age ",
            percentage: "Please enter the amount lying in savings bank accounts",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Current monthly expenses which will continue in retirement",
            yearPlaecHolder: " Age  you wish to retire",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Current Annual Expenses",
            featurecost: "Expenses in 1st yr of Retirement",
            corpusLabel: "Retirement Corpus Required",
            corpustooltip: "Corpus required at retirement to sustain living expenses until life expectancy",
            investmentLabel: "Monthly Investment required",
            investmenttooltip: "You could exclude the investment you are already making through other Retirement avenues (EPF, NPS, SA etc)",
            guagenote: "Goal achievement calculation does not include the investments you are already making through other Retirement avenues (EPF, NPS, SA etc)",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate a corpus of"
        };
        $scope.tenureMin = 30;
        $scope.tenureMax = 80;
        $scope.goalInfoFormData_year = 30;
    }
    if ($state.params.type === "marriage")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal",
            year: "Number of Years ",
            percentage: "",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Current cost of marriage",
            yearPlaecHolder: " years to achieve this goal",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "education")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal",
            year: "Number of Years ",
            percentage: "",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: " Current cost of education",
            yearPlaecHolder: "years to achieve this goal",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "other")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal",
            year: "Number of Years ",
            percentage: "",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: " Current value of your goal",
            yearPlaecHolder: "years to achieve this goal",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    //for crorepati
    if ($state.params.type === "crorepati")
        $scope.goalLabel = {
            currentprice: "Amount",
            year: "Number of Years ",
            isRequiredGoalByName: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: " How many crores would you like to accumulate?",
            yearPlaecHolder: "years to achieve this goal",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    //for Wealth Creation
    if ($state.params.type === "wealthCreation")
        $scope.goalLabel = {
            investibleAmtMonth: "Investible amount per month",
            investibleAmtLumsum: "Lumpsum amount (if any)",
            year: "Number of Years ",
            isRequiredGoalByName: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            investibleAmtMonthplaceholder: "Amount that can be invested per month",
            investibleAmtLumsumplaceholder: "Amount that you want to invest immediately ",
            yearPlaecHolder: "years to achieve this goal",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Invest"
        };
    //for Tax Planing
    if ($state.params.type === "taxPlanning")
        $scope.goalLabel = {
            currentprice: "Existing claim under Sec 80C",
            currentPricePlaecHolder: " Amount that can be claimed under Section 80C",
            lyingamount: "Shortfall in Sec 80C deduction",
            investibleAmtMonth: "Investible amount per month",
            investibleAmtLumsum: "Investible amount in lumpsum ",
            year: "Number of Years ",
            isRequiredGoalByName: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            investibleAmtMonthplaceholder: "Amount that can be invested per month",
            investibleAmtLumsumplaceholder: "Amount that you want to invest immediately ",
            yearPlaecHolder: "years to achieve this goal",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Recommended investment in Equity Linked Savings Scheme (ELSS)",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over PPF in a Realistic scenario : ",
            accumulateText: "Invest"
        };
    $scope.goalimagesrc = "/img/goal_" + $state.params.type + "_m.png";
    $scope.monthstoinvestmentList = ["Immediately", "2 months", "3 months", "4 months", "12 months"];
    $scope.goalInfoFormData_monthstoinvestment = "Immediately";
    $scope.modelPopupData = {status: true};

    $scope.init = function () {

    };
    $scope.submitGoalInfoForm = function () {
        var loanPercentage = 0;
        if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired()) {
            loanPercentage = $scope.percentageSliderOptions.value / 100;
        }
        if ($scope.type === "taxPlanning") {
            $scope.goalInfoFormData_goalName = "Tax Planning (" + $scope.getFinancialYear() + ")";
        }
        $scope.goalName = $scope.goalInfoFormData_goalName;
        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            type: $scope.type,
            name: $scope.goalInfoFormData_goalName,
            loanPercentage: loanPercentage,
            tenure: $scope.yearSliderOptions.value,
            currentPrice: $scope.goalInfoFormData_currentprice,
            state: "create"
        };
        if ($scope.type === "contingency") {
            var tmp = ($scope.goalInfoFormData_currentprice * $scope.monthSliderOptions.value - $scope.goalInfoFormData_lyingamount) / $scope.achieveMonthSliderOptions.value;
            if (tmp < 1000) {
                toaster.error({body: "You already have more balance in savings fund than required for contingency."});
                return;
            }
            data.contTenure = $scope.monthSliderOptions.value;
            data.tenure = $scope.achieveMonthSliderOptions.value;
            data.contSavings = $scope.goalInfoFormData_lyingamount;
        }
        if ($scope.type === "crorepati") {
            data.futurePrice = $scope.crorepatiSliderOptions.value * 10000000;
        }
        if ($scope.type === "wealthCreation") {
            data.sipRequired = $scope.goalInfoFormData_sip;
            data.lumpsumRequired = $scope.goalInfoFormData_lumpsum;
        }
        if ($scope.type === "retirement") {
            data.retirementAge = $scope.yearSliderOptions.value;
        }
        if ($scope.type === "taxPlanning") {
            if ($scope.goalInfoFormData_lyingamount < 5000) {
                toaster.error({body: "Minimum investment required in Tax Saving Mutual Fund is Five Thousand"});
                return;
            }
            data.currentPrice = (150000 - $scope.goalInfoFormData_taxcurrentprice);
        }

        $http({
            method: 'POST',
            url: window.link.create_goal,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.requestpage = false;
            $scope.responsepage = true;
            $scope.currentPrice = $scope.goalInfoFormData_currentprice;
            $scope.tenure = response.data.tenure;
            var currentDate = new Date();
            $scope.accumulatedYear = response.data.maturity;
            $scope.areaChartFeaturePrice = response.data.futurePrice;
            $scope.accumulatedAmt = response.data.futurePrice;
            if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired())
                $scope.futurePrice = Math.round(response.data.futurePrice * 100 / (100 - $scope.percentageSliderOptions.value));
            else
                $scope.futurePrice = response.data.futurePrice;

            if ($state.params.type === "retirement") {
                $scope.areaChartFeaturePrice = response.data.retCorpus;
                $scope.retCorpus = response.data.retCorpus;
                $scope.accumulatedAmt = response.data.retCorpus;
            } else {
                $scope.retCorpus = response.data.futurePrice;
            }

            $scope.monthlyInvestment = response.data.sipRequired;
            if ($scope.type === "wealthCreation") {
                $scope.lumpsumAmount = response.data.lumpsumRequired
            } else {
                $scope.lumpsumAmount = 0;
            }
            goal_id = response.data._goalid;
            $scope.chart.data.columns = [['data', 100]];
            $scope.graphResponse = response.data.graph;
            $scope.inflation = Math.round(response.data.inflation * 100);
            if ($state.params.type === "taxPlanning") {
                $scope.lumpsumAmount = response.data.lumpsumRequired;
                $scope.futurePrice = response.data.futurePrice;
                $scope.resMonthlyInvestment = response.data.sipRequired;
                $scope.currentPrice = response.data.futurePrice;
            } else {
                $scope.resMonthlyInvestment = response.data.sipRequired;
            }
            if ($scope.type === "crorepati" || $scope.type === "wealthCreation") {
                $scope.next();
            }
        }, function errorCallback(response) {
            toaster.error({body: response.data.err});
        });
    };

    $scope.next = function () {
        $scope.requestpage = false;
        $scope.responsepage = false;
        $scope.setgoalpage = true;
        var tempArry = [];
        var columns = [];
        if ($state.params.type === "taxPlanning") {
            tempArry.push("PPF");
            for (var i in $scope.graphResponse.PPF)
                tempArry.push($scope.graphResponse.PPF[i]);
            columns.push(tempArry);
            tempArry = [];
        } else {
            tempArry.push("FD");
            for (var i in $scope.graphResponse.FD)
                tempArry.push($scope.graphResponse.FD[i]);
            columns.push(tempArry);
            tempArry = [];
        }
        tempArry.push("Optimistic");
        for (var i in $scope.graphResponse.Optimist)
            tempArry.push($scope.graphResponse.Optimist[i]);
        columns.push(tempArry);
        tempArry = [];
        tempArry.push("Pessimistic");
        for (var i in $scope.graphResponse.Pessimist)
            tempArry.push($scope.graphResponse.Pessimist[i]);
        columns.push(tempArry);
        tempArry = [];
        tempArry.push("Realistic");
        for (var i in $scope.graphResponse.Real)
            tempArry.push($scope.graphResponse.Real[i]);
        columns.push(tempArry);
        var types = {};
        if ($state.params.type === "taxPlanning") {
            types = {
                "PPF": "area-spline",
                "Optimist": "area-spline",
                "Pessimist": "area-spline",
                "Real": "area-spline"
            };
        } else {
            types = {"FD": "area-spline", "Optimist": "area-spline", "Pessimist": "area-spline", "Real": "area-spline"};
        }
        var currentValue = 0;
        if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired())
            currentValue = Math.round($scope.currentPrice * (100 - $scope.percentageSliderOptions.value) / 100);
        else
            currentValue = $scope.currentPrice;
        if ($state.params.type === "taxPlanning") {
            $scope.areachart.grid.x.lines[0].value = 3;
            $scope.areachart.grid.x.lines[0].text = "Lock-in period ends";
            $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.PPF[$scope.graphResponse.PPF.length - 1];
        } else {
            $scope.areachart.grid.y.lines[0].value = $scope.areaChartFeaturePrice;
            $scope.areachart.grid.y.lines[0].text = "Future Value : " + $scope.thousandseparator($scope.areaChartFeaturePrice);
            if (($state.params.type != "retirement") && ($state.params.type != "wealthCreation") && ($state.params.type != "crorepati")) {
                $scope.areachart.grid.y.lines[1].value = currentValue;
                $scope.areachart.grid.y.lines[1].text = "Current Value : " + $scope.thousandseparator(currentValue);
            }
            $scope.areachart.grid.x.lines = [];
            $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.FD[$scope.graphResponse.FD.length - 1];
        }
        $scope.areachart.data = {columns: columns, types: types};
    };

    $scope.back = function () {
        $scope.requestpage = true;
        $scope.responsepage = false;
    };

    $scope.backtoResponsePage = function () {
        if ($scope.type === "crorepati" || $scope.type === "wealthCreation") {
            $scope.requestpage = true;
            $scope.responsepage = false;
            $scope.setgoalpage = false;
        } else {
            $scope.requestpage = false;
            $scope.responsepage = true;
            $scope.setgoalpage = false;
        }
    };

    $scope.setMyGoal = function () {
        var lumpmsumAmount = parseInt($scope.lumpsumAmount);
        var monthlyInvestment = parseInt($scope.monthlyInvestment);

        if (lumpmsumAmount <= 0 || isNaN(lumpmsumAmount)) lumpmsumAmount = 0;
        if (monthlyInvestment <= 0 || isNaN(monthlyInvestment)) monthlyInvestment = 0;

        if (!(validateAmount(lumpmsumAmount, monthlyInvestment, $scope.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpsum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }

        // if (!(validateInvestmentCategory(lumpmsumAmount, monthlyInvestment))) {
        //     toaster.error({body: "The investment in lumpsum and SIP should be in specific proportion (5:1), please make two separate investments in case the difference in significant."});
        //     return;
        // }

        if ($scope.type === "taxPlanning") {
            if (( $scope.currentPrice < (($scope.tenure * monthlyInvestment) + lumpmsumAmount))) {
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }


        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            lumpsum: $scope.lumpsumAmount,
            sip: $scope.monthlyInvestment,
            state: "save"
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $state.go("dashboards.goal_list");
        }, function errorCallback(response) {

        });
    };

    $scope.setGoalInit = function () {
        //$scope.setGoalFormData.lumpsumAmount = 0;
        //$scope.setGoalFormData.monthlyInvestment = resMonthlyInvestment;
        //$scope.resMonthlyInvestment = resMonthlyInvestment;
    };

    $scope.submitSetGoalForm = function () {
        var formObj = document.getElementById("setGoalForm");
        var lumpmsumAmount = parseInt($scope.lumpsumAmount);
        var monthlyInvestment = parseInt($scope.monthlyInvestment);

        if (lumpmsumAmount <= 0 || isNaN(lumpmsumAmount)) lumpmsumAmount = 0;
        if (monthlyInvestment <= 0 || isNaN(monthlyInvestment)) monthlyInvestment = 0;

        if (!(validateAmount(lumpmsumAmount, monthlyInvestment, $scope.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpsum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }

        // if (!(validateInvestmentCategory(lumpmsumAmount, monthlyInvestment))) {
        //     toaster.error({body: "The investment in lumpsum and SIP should be in specific proportion (5:1), please make two separate investments in case the difference in significant."});
        //     return;
        // }

        if ($scope.type === "taxPlanning") {
            if (( $scope.currentPrice < (($scope.tenure * monthlyInvestment) + lumpmsumAmount))){
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }

        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            lumpsum: $scope.lumpsumAmount,
            sip: $scope.monthlyInvestment,
            state: "cal"
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            var percentage = response.data.percentAchievable * 100;
            $scope.chart.data.columns = [['data', percentage.toFixed(2)]];
            var tempArry = [];
            var columns = [];
            if ($state.params.type === "taxPlanning") {
                tempArry.push("PPF");
                for (var i in response.data.graph.PPF)
                    tempArry.push(response.data.graph.PPF[i]);
                columns.push(tempArry);
                tempArry = [];
            } else {
                tempArry.push("FD");
                for (var i in response.data.graph.FD)
                    tempArry.push(response.data.graph.FD[i]);
                columns.push(tempArry);
                tempArry = [];
            }
            tempArry.push("Optimist");
            for (var i in response.data.graph.Optimist)
                tempArry.push(response.data.graph.Optimist[i]);
            columns.push(tempArry);
            tempArry = [];
            tempArry.push("Pessimist");
            for (var i in response.data.graph.Pessimist)
                tempArry.push(response.data.graph.Pessimist[i]);
            columns.push(tempArry);
            tempArry = [];
            tempArry.push("Real");
            for (var i in response.data.graph.Real)
                tempArry.push(response.data.graph.Real[i]);
            columns.push(tempArry);
            var types = {};
            if ($state.params.type === "taxPlanning") {
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
                    "Real": "area-spline"
                };
            }
            var currentValue = 0;
            if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired())
                currentValue = Math.round($scope.currentPrice * 100 / (100 - $scope.percentageSliderOptions.value));
            else
                currentValue = $scope.currentPrice;
            if ($state.params.type === "taxPlanning") {
                $scope.areachart.grid.x.lines[0].value = 3;
                $scope.areachart.grid.x.lines[0].text = "Lock-in period ends";
                $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.PPF[$scope.graphResponse.PPF.length - 1];
            } else {
                $scope.areachart.grid.y.lines[0].value = $scope.areaChartFeaturePrice;
                $scope.areachart.grid.y.lines[0].text = "Future Value :" + $scope.thousandseparator($scope.areaChartFeaturePrice);
                if (($state.params.type != "retirement") && ($state.params.type != "wealthCreation") && ($state.params.type != "crorepati")) {
                    $scope.areachart.grid.y.lines[1].value = currentValue;
                    $scope.areachart.grid.y.lines[1].text = "Current Value : " + $scope.thousandseparator(currentValue);
                }
                $scope.areachart.grid.x.lines = [];
                $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.FD[$scope.graphResponse.FD.length - 1];
            }
            $scope.areachart.data = {columns: columns, types: types};
        }, function errorCallback(response) {

        });
    };

    //Chart code
    $scope.dynamicChartId = 'chart';
    $scope.chartType = {};

    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };

    $scope.chart = {
        data: {
            type: 'gauge',
            columns: [['data', 100]],
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
        },
    };
    //Area chart
    $scope.areaChartId = 'areachart';
    $scope.areachart = {
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
    $scope.isLoanRequired = function () {
        var status = false;
        if ($scope.isLoanPercentRequired === "yes") {
            status = true;
        }
        if ($scope.isLoanPercentRequired === "no") {
            $scope.percentateFrom = 1;
        }
        return status;
    };
    $scope.isLoanCheckRequired = function () {
        var status = false;
        if ($scope.goalLabel.isRequiredPercentage && ($state.params.type === "vehicle" || $state.params.type === "home")) {
            status = true;
        }
        return status;
    };
    $scope.$watch('goalInfoFormData_currentprice', function (val) {
        if (val && val > 0) {
            $scope.currentpriceinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.currentpriceinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_crorepaticurrentprice', function (val) {
        if (val && val > 0) {
            $scope.currentpriceinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.currentpriceinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_taxcurrentprice', function (val) {
        if (val && val > 0) {
            $scope.taxcurrentpriceinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.taxcurrentpriceinwords = "";
        }
        $scope.goalInfoFormData_lyingamount = 150000 - val;
    });
    $scope.$watch('lumpsumAmount', function (val) {
        if (val && val > 0) {
            $scope.lumpsumAmountinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.lumpsumAmountinwords = "";
        }
    });
    $scope.$watch('monthlyInvestment', function (val) {
        if (val && val > 0) {
            $scope.monthlyInvestmentinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.monthlyInvestmentinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_lyingamount', function (val) {
        if (val && val > 0) {
            $scope.lyingamountinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.lyingamountinwords = "";
        }
    });

    $scope.$watch('goalInfoFormData_sip', function (val) {
        if (val && val > 0) {
            $scope.investibleamntinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.investibleamntinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_lumpsum', function (val) {
        if (val && val > 0) {
            $scope.investibleamntlumpinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.investibleamntlumpinwords = "";
        }
    });
    $scope.thousandseparator = thousandSeparator.thousandSeparator;

    $scope.converttoWords = convertDigitsIntoWords.inWords;

    /*$scope.yearSliderOptions = {
     min: $scope.tenureMin,
     max: $scope.tenureMax,
     from: 1,
     postfix: " year",
     prettify: false,
     hasGrid: true,
     onChange: function(data){
     $scope.goalInfoFormData_year = data.fromNumber;
     }
     };*/
    $scope.yearSliderOptions = {
        value: $scope.goalInfoFormData_year,
        options: {
            floor: $scope.tenureMin,
            ceil: $scope.tenureMax,
            step: 1,
            minLimit: $scope.tenureMin,
            maxLimit: $scope.tenureMax,
            showTicks: 10,
            showTicksValues: true,
        }
    };
    /*$scope.percentageSliderOptions = {
     min: 0,
     max: 100,
     from: $scope.percentateFrom,
     postfix: " %",
     prettify: false,
     hasGrid: true,
     onChange: function(data){
     $scope.goalInfoFormData_loan = data.fromNumber;
     }
     };*/
    $scope.percentageSliderOptions = {
        value: 1,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            minLimit: 1,
            maxLimit: 99,
            showTicks: 10,
            showTicksValues: true,
        }
    };
    $scope.monthSliderOptions = {
        value: 6,
        options: {
            floor: 3,
            ceil: 12,
            step: 1,
            minLimit: 1,
            maxLimit: 12,
            translate: function (value) {
                return value + ' months'
            },
            showTicks: 3,
            ticksTooltip: function (v) {
                return 'A fund created to meet any emergency needs. Fund can be equal to 3 to 12 months expenses. Select how many months of expenses would you like to provide for as contingency fund.';
            }
        }
    };
    $scope.achieveMonthSliderOptions = {
        value: 12,
        options: {
            floor: 6,
            ceil: 36,
            step: 1,
            translate: function (value) {
                return value + ' months'
            },
            minLimit: 6,
            maxLimit: 36,
            showTicks: 6,
            ticksTooltip: function (v) {
                return 'Select the number of months over which you would like to build your contingency fund.';
            }
        }
    };
    $scope.crorepatiSliderOptions = {
        value: 0.5,
        options: {
            floor: 0,
            ceil: 50,
            step: 0.5,
            translate: function (value) {
                return value + ' crore'
            },
            showTicks: 8,
            precision: 1
        }
    };

    $scope.isCorpusRequired = function () {
        var status = false;
        if ($scope.isLoanPercentRequired === "yes" || $state.params.type === "retirement") {
            status = true;
        }
        return status;
    };

    $scope.getCurrentPrice = function (currentPrice) {
        if ($state.params.type === "retirement") {
            currentPrice = currentPrice * 12;
        }
        return $scope.thousandseparator(currentPrice);
    };
    $scope.isContingency = function () {
        return ($state.params.type === "contingency");
    };
    // $scope.isWealthCreation = function(){
    //     return ($state.params.type === "wealthCreation");
    // };
    if ($state.params.pagestatus === "fromdashboard") {
        var goalData = goalData.getGoalData();
        $scope.requestpage = false;
        $scope.responsepage = false;
        $scope.setgoalpage = true;
        $scope.currentPrice = goalData.currentPrice;
        $scope.tenure = goalData.tenure;
        var currentDate = new Date();
        $scope.accumulatedYear = goalData.maturity;
        $scope.accumulatedAmt = goalData.futurePrice;
        $scope.areaChartFeaturePrice = goalData.futurePrice;
        if (($scope.type === "home" || $scope.type === "vehicle"))
            $scope.futurePrice = Math.round(goalData.futurePrice * 100 / (100 - 15));
        else
            $scope.futurePrice = goalData.futurePrice;
        if ($scope.type === "crorepati") {
            $scope.responsepage = false;
            $scope.setgoalpage = true;
        }
        if ($scope.type === "wealthCreation") {
            $scope.responsepage = false;
            $scope.setgoalpage = true;
        }
        if ($state.params.type === "retirement") {
            $scope.areaChartFeaturePrice = goalData.retCorpus;
            $scope.retCorpus = goalData.retCorpus;
            $scope.accumulatedAmt = goalData.retCorpus;
        } else {
            $scope.retCorpus = goalData.futurePrice;
        }
        if ($state.params.type === "taxPlanning") {
            $scope.lumpsumAmount = goalData.lumpsum;
            $scope.futurePrice = goalData.lumpsum;
            $scope.resMonthlyInvestment = goalData.lumpsum;
        } else {
            $scope.resMonthlyInvestment = goalData.sipRequired;
        }
        $scope.monthlyInvestment = goalData.sip;
        $scope.lumpsumAmount = goalData.lumpsum;
        goal_id = goalData._goalid;
        $scope.chart.data.columns = [['data', Math.round(goalData.percentAchievable * 100)]];
        $scope.graphResponse = goalData.graph;
        $scope.inflation = Math.round(goalData.inflation * 100);
        $scope.next();
    }

    $scope.taxCalculation = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/modal_tax_planing.html',
            controller: taxPlaningModelController,
            windowClass: "animated fadeIn",
            scope: $scope
        });
        var test = 90;
    };
    $rootScope.$on('taxPlaningTotal', function (event, data) {
        $scope.modelPopupData = data;
        if (data.Total > 0) {
            $scope.goalInfoFormData_taxcurrentprice = data.Total;
            $scope.goalInfoFormData_lyingamount = 150000 - data.Total;
        }
    });

    $scope.currentCostRequired = function () {
        var status = true;
        if ($scope.type === "taxPlanning" || $scope.type === "crorepati" || $scope.type === "wealthCreation") {
            status = false;
        }
        return status;
    };

    $scope.getFinancialYear = function() {
        return currentFinancialYear();
     }

}
angular.module('finatwork').controller('goalInfo', ['$scope', '$state', '$http', '$window', 'c3ChartService', 'convertDigitsIntoWords', 'thousandSeparator', 'goalData', '$uibModal', '$rootScope', 'toaster', goalInfo]);

function taxPlaningModelController($scope, $uibModalInstance) {
    $scope.ok = function () {
        $scope.modelPopupData.EPF = ($scope.EPF) ? $scope.EPF : 0;
        $scope.modelPopupData.VPF = ($scope.VPF) ? $scope.VPF : 0;
        $scope.modelPopupData.LIC = ($scope.LIC) ? $scope.LIC : 0;
        $scope.modelPopupData.PPF = ($scope.PPF) ? $scope.PPF : 0;
        $scope.modelPopupData.HLP = ($scope.HLP) ? $scope.HLP : 0;
        $scope.modelPopupData.QBD = ($scope.QBD) ? $scope.QBD : 0;
        $scope.modelPopupData.SSS = ($scope.SSS) ? $scope.SSS : 0;
        $scope.modelPopupData.CTF = ($scope.CTF) ? $scope.CTF : 0;
        $scope.modelPopupData.OTI = ($scope.OTI) ? $scope.OTI : 0;
        $scope.modelPopupData.Total = $scope.Total;
        $scope.$emit('taxPlaningTotal', $scope.modelPopupData);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if ($scope.modelPopupData.status) {
        $scope.modelPopupData.status = false;
    } else {
        $scope.EPF = ($scope.modelPopupData.EPF > 0) ? $scope.modelPopupData.EPF : '';
        $scope.VPF = ($scope.modelPopupData.VPF > 0) ? $scope.modelPopupData.VPF : '';
        $scope.LIC = ($scope.modelPopupData.LIC > 0) ? $scope.modelPopupData.LIC : '';
        $scope.PPF = ($scope.modelPopupData.PPF > 0) ? $scope.modelPopupData.PPF : '';
        $scope.HLP = ($scope.modelPopupData.HLP > 0) ? $scope.modelPopupData.HLP : '';
        $scope.QBD = ($scope.modelPopupData.QBD > 0) ? $scope.modelPopupData.QBD : '';
        $scope.SSS = ($scope.modelPopupData.SSS > 0) ? $scope.modelPopupData.SSS : '';
        $scope.CTF = ($scope.modelPopupData.CTF > 0) ? $scope.modelPopupData.CTF : '';
        $scope.OTI = ($scope.modelPopupData.OTI > 0) ? $scope.modelPopupData.OTI : '';
    }
    $scope.$watch('EPF', function (val) {
        setTotal();
    });
    $scope.$watch('VPF', function (val) {
        setTotal();
    });
    $scope.$watch('LIC', function (val) {
        setTotal();
    });
    $scope.$watch('PPF', function (val) {
        setTotal();
    });
    $scope.$watch('HLP', function (val) {
        setTotal();
    });
    $scope.$watch('QBD', function (val) {
        setTotal();
    });
    $scope.$watch('SSS', function (val) {
        setTotal();
    });
    $scope.$watch('CTF', function (val) {
        setTotal();
    });
    $scope.$watch('OTI', function (val) {
        setTotal();
    });
    function setTotal() {
        $scope.Total = (($scope.EPF) ? $scope.EPF : 0) + (($scope.VPF) ? $scope.VPF : 0) + (($scope.LIC) ? $scope.LIC : 0) + (($scope.PPF) ? $scope.PPF : 0) +
            (($scope.HLP) ? $scope.HLP : 0) + (($scope.QBD) ? $scope.QBD : 0) + (($scope.SSS) ? $scope.SSS : 0) + (($scope.CTF) ? $scope.CTF : 0) + (($scope.OTI) ? $scope.OTI : 0);
    }
}
angular.module('finatwork').controller('taxPlaningModelController', taxPlaningModelController);