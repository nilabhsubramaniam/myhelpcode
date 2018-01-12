/**
 * Created by FinAtWork on 27-04-2017.
 */
function filingCapitalGainsCtrl($scope, $state, fintaxFilingService, fintaxService, convertDigitsIntoWords) {
    $scope.capitalGainsFormData = {
        investment: 'no',
        share: 'no',
        mutualFund: 'no',
        securities: 'no',
        propTransaction: 'no',
        propTransactionDetails: [{
            _id: 0,
            delete: false,
            propNature: '',
            propPurDate: moment(),
            propPurCost: '',
            improvementCost: '',
            propSaleDate: moment(),
            propSaleVal: '',
            costIncurred: ''
        }]
    };
    $scope.formEditable = true;
    var uid = 0;
    $scope.isOpen = true;
    $scope.idToName = {
        0: "Property 1",
        1: "Property 2"
    };

    $scope.startFiscalYear = startFiscalYear();
    $scope.endFiscalYear = endFiscalYear();
    $scope.todayDate = moment().hours(23).minutes(59).seconds(59).milliseconds(0);


    $scope.init = function () {
        fintaxFilingService.getInfo('capGain').then(function (response) {
            if (response != null && response.capGain !== undefined && response.capGain.investment != undefined) {
                if (!IsAdmin())formStatus(response.state);
                $scope.capitalGainsFormData.investment = response.capGain.investment;
                if ($scope.capitalGainsFormData.investment) {
                    if (response.capGain.shareLTCG) {
                        $scope.capitalGainsFormData.share = 'yes';
                        $scope.capitalGainsFormData.shareLTCG = response.capGain.shareLTCG;
                    }
                    if (response.capGain.shareSTCG) {
                        $scope.capitalGainsFormData.share = 'yes';
                        $scope.capitalGainsFormData.shareSTCG = response.capGain.shareSTCG;
                    }
                    if (response.capGain.mfLTCGEquity) {
                        $scope.capitalGainsFormData.mutualFund = 'yes';
                        $scope.capitalGainsFormData.mfLTCGEquity = response.capGain.mfLTCGEquity;
                    }
                    if (response.capGain.mfSTCGEquity) {
                        $scope.capitalGainsFormData.mutualFund = 'yes';
                        $scope.capitalGainsFormData.mfSTCGEquity = response.capGain.mfSTCGEquity;
                    }
                    if (response.capGain.mfLTCGDebt) {
                        $scope.capitalGainsFormData.mutualFund = 'yes';
                        $scope.capitalGainsFormData.mfLTCGDebt = response.capGain.mfLTCGDebt;
                    }
                    if (response.capGain.mfSTCGDebt) {
                        $scope.capitalGainsFormData.mutualFund = 'yes';
                        $scope.capitalGainsFormData.mfSTCGDebt = response.capGain.mfSTCGDebt;
                    }
                    if (response.capGain.securitiesBond) {
                        $scope.capitalGainsFormData.securities = 'yes';
                        $scope.capitalGainsFormData.securitiesBond = response.capGain.securitiesBond;
                    }
                    if (response.capGain.securitiesGold) {
                        $scope.capitalGainsFormData.securities = 'yes';
                        $scope.capitalGainsFormData.securitiesGold = response.capGain.securitiesGold;
                    }
                    if (response.capGain.securitiesOther) {
                        $scope.capitalGainsFormData.securities = 'yes';
                        $scope.capitalGainsFormData.securitiesOther = response.capGain.securitiesOther;
                    }
                    if (response.capGain.propTransactionDetails !== undefined && response.capGain.propTransactionDetails.length != 0 ) {
                        $scope.capitalGainsFormData.propTransaction = 'yes';
                        response.capGain.propTransactionDetails.forEach(function (prop, index) {
                            prop.propPurDate = moment(prop.propPurDate);
                            prop.propSaleDate = moment(prop.propSaleDate);
                            uid = Math.max(uid, prop._id);
                            prop.delete = true;
                        });
                        $scope.capitalGainsFormData.propTransactionDetails = response.capGain.propTransactionDetails;
                    }
                }
            } else {
                fintaxService.getBasicInfo().then(function (response) {
                    $scope.capitalGainsFormData.investment = response.investment;
                    $scope.capitalGainsFormData.propTransactionDetails.propPurDate = moment();
                    $scope.capitalGainsFormData.propTransactionDetails.propSaleDate = moment();
                });
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.getIdToName = function (index) {
        return $scope.idToName[index];
    };
    $scope.addCapitalInfo = function (capital) {
        var tmp = {
            propNature: '',
            propPurDate: moment(),
            propPurCost: '',
            improvementCost: '',
            propSaleDate: moment(),
            propSaleVal: '',
            costIncurred: ''
        };
        tmp._id = uid + 1;
        tmp.delete = false;
        capital.delete = true;
        $scope.capitalGainsFormData.propTransactionDetails.push(tmp);

    };
    $scope.deleteCapitalInfo = function (index) {
        if(index === 0){
            var tmp = {
                propNature: '',
                propPurDate: moment(),
                propPurCost: '',
                improvementCost: '',
                propSaleDate: moment(),
                propSaleVal: '',
                costIncurred: ''
            };
            tmp._id = uid + 1;
            tmp.delete = false;
            $scope.capitalGainsFormData.propTransactionDetails[index] = tmp;
            $scope.submitCapitalGains(false);
        } else {
            $scope.capitalGainsFormData.propTransactionDetails.splice(index, 1);
        }

    };
    $scope.cancelCapitalInfo = function (index) {
        if(index === 1){
            $scope.capitalGainsFormData.propTransactionDetails.splice(index, 1);
        }
        $scope.isOpen = false;
    };
    $scope.updateCapitalInfo = function (index) {
        console.log('updateCapitalInfo' + index);
        $scope.submitCapitalGains(false);
    };
    $scope.submitCapitalGains = function (jumptoNextTab) {
        var capitalGainsInfo = {};
        capitalGainsInfo.investment = $scope.capitalGainsFormData.investment;
        if ($scope.capitalGainsFormData.share == 'yes') {
            capitalGainsInfo.shareLTCG = $scope.capitalGainsFormData.shareLTCG;
            capitalGainsInfo.shareSTCG = $scope.capitalGainsFormData.shareSTCG;
        }
        if ($scope.capitalGainsFormData.mutualFund == 'yes') {
            capitalGainsInfo.mfLTCGEquity = $scope.capitalGainsFormData.mfLTCGEquity;
            capitalGainsInfo.mfSTCGEquity = $scope.capitalGainsFormData.mfSTCGEquity;
            capitalGainsInfo.mfLTCGDebt = $scope.capitalGainsFormData.mfLTCGDebt;
            capitalGainsInfo.mfSTCGDebt = $scope.capitalGainsFormData.mfSTCGDebt;
        }
        if ($scope.capitalGainsFormData.securities == 'yes') {
            capitalGainsInfo.securitiesBond = $scope.capitalGainsFormData.securitiesBond;
            capitalGainsInfo.securitiesGold = $scope.capitalGainsFormData.securitiesGold;
            capitalGainsInfo.securitiesOther = $scope.capitalGainsFormData.securitiesOther;
        }
        if($scope.capitalGainsFormData.propTransaction == 'yes') {
            if($scope.capitalGainsFormData.propTransactionDetails.length){
                capitalGainsInfo.propTransactionDetails =$scope.capitalGainsFormData.propTransactionDetails;
            }
        }
        fintaxFilingService.setInfo("capGain", capitalGainsInfo);
        if(jumptoNextTab) $state.go("forms.returnFiling.filingOtherSources");
    };
    $scope.$watch('capitalGainsFormData.shareLTCG', function (val) {
        if (val && val > 0) {
            $scope.LTCGInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.LTCGInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.shareSTCG', function (val) {
        if (val && val > 0) {
            $scope.STCGInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.STCGInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.mfLTCGEquity', function (val) {
        if (val && val > 0) {
            $scope.mfLTCGEInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mfLTCGEInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.mfSTCGEquity', function (val) {
        if (val && val > 0) {
            $scope.mfSTCInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mfSTCInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.mfLTCGDebt', function (val) {
        if (val && val > 0) {
            $scope.mfLTCGDInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mfLTCGDInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.mfSTCGDebt', function (val) {
        if (val && val > 0) {
            $scope.mfSTCDInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mfSTCDInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.securitiesBond', function (val) {
        if (val && val > 0) {
            $scope.SecBondInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.SecBondInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.securitiesGold', function (val) {
        if (val && val > 0) {
            $scope.SecGoldInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.SecGoldInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.securitiesOther', function (val) {
        if (val && val > 0) {
            $scope.SecOtherInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.SecOtherInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.propPurCost', function (val) {
        if (val && val > 0) {
            $scope.purCostInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.purCostInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.improvementCost', function (val) {
        if (val && val > 0) {
            $scope.ImproveCostInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.ImproveCostInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.propSaleVal', function (val) {
        if (val && val > 0) {
            $scope.saleValueInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.saleValueInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.costIncurred', function (val) {
        if (val && val > 0) {
            $scope.costInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.costInWords = "";
        }
    });
    $scope.$watch('capitalGainsFormData.propTransactionDetails[0]', function (val) {
        console.log(val);
    });
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingCapitalGain :input").attr("disabled", true);
            $("#filingCapitalGain :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingCapitalGainsCtrl', filingCapitalGainsCtrl);