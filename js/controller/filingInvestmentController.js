/**
 * Created by Finatwork on 22-04-2017.
 */
/**
 * Created by Nilabh on 19-04-2017.
 */
function filingInvestmentCtrl($scope, $state, fintaxFilingService, fintaxService, convertDigitsIntoWords) {
    $scope.finTaxInvestmentFormData = {
        taxSavingFD: 'no',
        taxSavingMF: 'no',
        taxSavingPF: 'no',
        taxSavingNSC: 'no',
        taxSavingLI: 'no',
        taxSavingSSY: 'no',
        taxSavingTutFee: 'no',
        taxSavingNPS: 'no',
        other: 'no'
    };
    $scope.formEditable = true;
    $scope.investmentInfoAvailable = false;
    $scope.init = function () {
        fintaxFilingService.getInfo('investments').then(function (response) {
            if (response != null) {
                if (!IsAdmin()) formStatus(response.state);
                if ($scope.formEditable) {
                    fintaxService.getInfo().then(function (response) {
                    if (response != null && response.investments != null) {
                        $scope.investmentInfoAvailable = true;
                        $scope.investmentInfoOpt = response.investments;
                    } else {
                        console.log(response)
                    }
                })
            }
                $scope.investmentInfo = response.investments;
                if ($scope.investmentInfo) populateInvestmentInfo()
            } else {
                console.log("Investment empty");
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.copyOptimization = function () {
        $scope.investmentInfo = $scope.investmentInfoOpt;
        if ($scope.investmentInfo) populateInvestmentInfo()
    };
    $scope.submitInvstmnt = function () {
        var investmentInfo = {};
        investmentInfo.otherInvst = [];
        if ($scope.finTaxInvestmentFormData.taxSavingFD == 'yes') {
            investmentInfo.taxSavingFDAmt = $scope.finTaxInvestmentFormData.taxSavingFDAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingMF == 'yes') {
            investmentInfo.taxSavingMFAmt = $scope.finTaxInvestmentFormData.taxSavingMFAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingPF == 'yes') {
            investmentInfo.taxSavingPFAmt = $scope.finTaxInvestmentFormData.taxSavingPFAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingNSC == 'yes') {
            investmentInfo.taxSavingNSCAmt = $scope.finTaxInvestmentFormData.taxSavingNSCAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingLI == 'yes') {
            investmentInfo.taxSavingLIAmt = $scope.finTaxInvestmentFormData.taxSavingLIAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingSSY == 'yes') {
            investmentInfo.taxSavingSSYAmt = $scope.finTaxInvestmentFormData.taxSavingSSYAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingTutFee == 'yes') {
            investmentInfo.taxSavingTutFeeAmt = $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingNPS == 'yes') {
            investmentInfo.taxSavingNPSAmt = $scope.finTaxInvestmentFormData.taxSavingNPSAmt;
        }
        if ($scope.finTaxInvestmentFormData.other == 'yes') {
            if ($scope.finTaxInvestmentFormData.name1 && $scope.finTaxInvestmentFormData.amt1) investmentInfo.otherInvst.push({
                name: $scope.finTaxInvestmentFormData.name1,
                amt: $scope.finTaxInvestmentFormData.amt1
            });
            if ($scope.finTaxInvestmentFormData.name2 && $scope.finTaxInvestmentFormData.amt2) investmentInfo.otherInvst.push({
                name: $scope.finTaxInvestmentFormData.name2,
                amt: $scope.finTaxInvestmentFormData.amt2
            });
            if ($scope.finTaxInvestmentFormData.name3 && $scope.finTaxInvestmentFormData.amt3) investmentInfo.otherInvst.push({
                name: $scope.finTaxInvestmentFormData.name3,
                amt: $scope.finTaxInvestmentFormData.amt3
            })
        }
        fintaxFilingService.setInfo('investments', investmentInfo);
        $state.go("forms.returnFiling.filingHealthInsurance");
    };
    $scope.$watch('finTaxInvestmentFormData.taxSavingFDAmt', function (val) {
        if (val && val > 0) {
            $scope.taxSavingFDAmtInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.taxSavingFDAmtInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingMFAmt', function (val) {
        if (val && val > 0) {
            $scope.mutualFundAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mutualFundAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingPFAmt', function (val) {
        if (val && val > 0) {
            $scope.ppfAmountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.ppfAmountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingNSCAmt', function (val) {
        if (val && val > 0) {
            $scope.nationalSavingInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.nationalSavingInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingLIAmt', function (val) {
        if (val && val > 0) {
            $scope.licAmountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.licAmountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingSSYAmt', function (val) {
        if (val && val > 0) {
            $scope.sukanyaYojnaAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.sukanyaYojnaAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingTutFeeAmt', function (val) {
        if (val && val > 0) {
            $scope.childFeesAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.childFeesAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingNPSAmt', function (val) {
        if (val && val > 0) {
            $scope.pensionSchemeAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.pensionSchemeAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt1', function (val) {
        if (val && val > 0) {
            $scope.amountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt2', function (val) {
        if (val && val > 0) {
            $scope.amountdesInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountdesInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt3', function (val) {
        if (val && val > 0) {
            $scope.amountOtherInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountOtherInWords = "";
        }
    });
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingInvestment :input").attr("disabled", true);
            $("#filingInvestment :submit").attr("disabled", true);
        }
    }

    function populateInvestmentInfo() {
        if ($scope.investmentInfo.taxSavingFDAmt) {
            $scope.finTaxInvestmentFormData.taxSavingFD = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingFDAmt = $scope.investmentInfo.taxSavingFDAmt;
        }
        if ($scope.investmentInfo.taxSavingMFAmt) {
            $scope.finTaxInvestmentFormData.taxSavingMF = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingMFAmt = $scope.investmentInfo.taxSavingMFAmt;
        }
        if ($scope.investmentInfo.taxSavingPFAmt) {
            $scope.finTaxInvestmentFormData.taxSavingPF = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingPFAmt = $scope.investmentInfo.taxSavingPFAmt;
        }
        if ($scope.investmentInfo.taxSavingNSCAmt) {
            $scope.finTaxInvestmentFormData.taxSavingNSC = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingNSCAmt = $scope.investmentInfo.taxSavingNSCAmt;
        }
        if ($scope.investmentInfo.taxSavingLIAmt) {
            $scope.finTaxInvestmentFormData.taxSavingLI = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingLIAmt = $scope.investmentInfo.taxSavingLIAmt;
        }
        if ($scope.investmentInfo.taxSavingSSYAmt) {
            $scope.finTaxInvestmentFormData.taxSavingSSY = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingSSYAmt = $scope.investmentInfo.taxSavingSSYAmt;
        }
        if ($scope.investmentInfo.taxSavingTutFeeAmt) {
            $scope.finTaxInvestmentFormData.taxSavingTutFee = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt = $scope.investmentInfo.taxSavingTutFeeAmt;
        }
        if ($scope.investmentInfo.taxSavingNPSAmt) {
            $scope.finTaxInvestmentFormData.taxSavingNPS = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingNPSAmt = $scope.investmentInfo.taxSavingNPSAmt;
        }
        if ($scope.investmentInfo.otherInvst.length) {
            $scope.finTaxInvestmentFormData.other = 'yes';
            $scope.finTaxInvestmentFormData.name1 = $scope.investmentInfo.otherInvst[0].name;
            $scope.finTaxInvestmentFormData.amt1 = $scope.investmentInfo.otherInvst[0].amt;
            if (typeof($scope.investmentInfo.otherInvst[1]) != "undefined") {
                $scope.finTaxInvestmentFormData.name2 = $scope.investmentInfo.otherInvst[1].name;
                $scope.finTaxInvestmentFormData.amt2 = $scope.investmentInfo.otherInvst[1].amt;
            }
            if (typeof($scope.investmentInfo.otherInvst[2]) != "undefined") {
                $scope.finTaxInvestmentFormData.name3 = $scope.investmentInfo.otherInvst[2].name;
                $scope.finTaxInvestmentFormData.amt3 = $scope.investmentInfo.otherInvst[2].amt;
            }
        }
    }
}
angular.module('finatwork').controller('filingInvestmentCtrl', filingInvestmentCtrl);