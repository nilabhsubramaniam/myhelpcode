/**
 * Created by Finatwork on 31-03-2017.
 */
function invstmntFinTaxCtrl($scope, $state, fintaxService,convertDigitsIntoWords) {

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

    $scope.init = function () {
        fintaxService.getInfo().then(function (response) {
            var currentVal = response.investments;
            if (currentVal) {
                if (!IsAdmin())formStatus(response.state);
                if (currentVal.taxSavingFDAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingFD = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingFDAmt = currentVal.taxSavingFDAmt;
                }
                if (currentVal.taxSavingMFAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingMF = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingMFAmt = currentVal.taxSavingMFAmt;
                }
                if (currentVal.taxSavingPFAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingPF = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingPFAmt = currentVal.taxSavingPFAmt;
                }
                if (currentVal.taxSavingNSCAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingNSC = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingNSCAmt = currentVal.taxSavingNSCAmt;
                }
                if (currentVal.taxSavingLIAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingLI = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingLIAmt = currentVal.taxSavingLIAmt;
                }
                if (currentVal.taxSavingSSYAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingSSY = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingSSYAmt = currentVal.taxSavingSSYAmt;
                }
                if (currentVal.taxSavingTutFeeAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingTutFee = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt = currentVal.taxSavingTutFeeAmt;
                }
                if (currentVal.taxSavingNPSAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingNPS = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingNPSAmt = currentVal.taxSavingNPSAmt;
                }
                if (currentVal.otherInvst.length) {
                    $scope.finTaxInvestmentFormData.other = 'yes';
                    $scope.finTaxInvestmentFormData.name1 = currentVal.otherInvst[0].name;
                    $scope.finTaxInvestmentFormData.amt1 = currentVal.otherInvst[0].amt;
                    if (typeof(currentVal.otherInvst[1]) != "undefined") {
                        $scope.finTaxInvestmentFormData.name2 = currentVal.otherInvst[1].name;
                        $scope.finTaxInvestmentFormData.amt2 = currentVal.otherInvst[1].amt;
                    }
                    if (typeof(currentVal.otherInvst[2]) != "undefined") {
                        $scope.finTaxInvestmentFormData.name3 = currentVal.otherInvst[2].name;
                        $scope.finTaxInvestmentFormData.amt3 = currentVal.otherInvst[2].amt;
                    }
                }
            }
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.submitInvstmntInfo = function () {
        var investmentInfo = {};
        investmentInfo.otherInvst =[];
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
            if($scope.finTaxInvestmentFormData.name1 && $scope.finTaxInvestmentFormData.amt1) investmentInfo.otherInvst.push({name:$scope.finTaxInvestmentFormData.name1,amt:$scope.finTaxInvestmentFormData.amt1});
            if($scope.finTaxInvestmentFormData.name2 && $scope.finTaxInvestmentFormData.amt2) investmentInfo.otherInvst.push({name:$scope.finTaxInvestmentFormData.name2,amt:$scope.finTaxInvestmentFormData.amt2});
            if($scope.finTaxInvestmentFormData.name3 && $scope.finTaxInvestmentFormData.amt3) investmentInfo.otherInvst.push({name:$scope.finTaxInvestmentFormData.name3,amt:$scope.finTaxInvestmentFormData.amt3})
        }

        fintaxService.setInfo('investments', investmentInfo);
        $state.go("forms.fintax.healthInsurance");
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
            $("#finTaxInvestment :input").attr("disabled", true);
            $("#finTaxInvestment :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('invstmntFinTaxCtrl', invstmntFinTaxCtrl);
