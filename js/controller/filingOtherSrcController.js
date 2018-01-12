/**
 * Created by Finatwork on 27-04-2017.
 */
function filingOtherSrcInfoCtrl($scope, $state, fintaxFilingService, fintaxService, convertDigitsIntoWords) {
    $scope.otherSrcForm = {
        otherIncomeSrc: 'no',
        incomeInterest: 'no',
        unaccountedIncome: 'no'
    };
    $scope.formEditable = true;
    $scope.init = function () {
        fintaxFilingService.getInfo('otherSource').then(function (response) {
            if(response != null && response.otherSource != null && response.otherSource.otherIncomeSrc !== undefined){
                if (!IsAdmin())formStatus(response.state);
                $scope.otherSrcForm.otherIncomeSrc = response.otherSource.otherIncomeSrc;
                if($scope.otherSrcForm.otherIncomeSrc) {
                    $scope.otherSourceInfo = response.otherSource;
                    if ($scope.otherSourceInfo) {
                        if ($scope.otherSourceInfo.amountSB) {
                            $scope.otherSrcForm.otherIncomeSrc = 'yes';//temp change, will be removed once value is received from basicInfo.
                            $scope.otherSrcForm.incomeInterest = 'yes';
                            $scope.otherSrcForm.amountSB = $scope.otherSourceInfo.amountSB;
                        }
                        if ($scope.otherSourceInfo.interestSB) {
                            $scope.otherSrcForm.interestSB = $scope.otherSourceInfo.interestSB;
                        }
                        if ($scope.otherSourceInfo.otherAmt) {
                            $scope.otherSrcForm.unaccountedIncome = 'yes';
                            $scope.otherSrcForm.otherAmt = $scope.otherSourceInfo.otherAmt;
                            $scope.otherSrcForm.otherDescr = $scope.otherSourceInfo.otherDescr;
                        }
                    }
                }
            } else {
                fintaxService.getBasicInfo().then(function (response) {
                    $scope.otherSrcForm.otherIncomeSrc = response.otherIncomeSrc;
                });
            }
        }, function(reason){
            console.log(reason);
        });


    };
    $scope.submitOtherSrcInfo = function () {
        var otherSourceInfo = {};
        otherSourceInfo.otherIncomeSrc = $scope.otherSrcForm.otherIncomeSrc;
        if ($scope.otherSrcForm.incomeInterest == 'yes') {
            otherSourceInfo.amountSB = $scope.otherSrcForm.amountSB;
        }
        if ($scope.otherSrcForm.unaccountedIncome == 'yes') {
            otherSourceInfo.otherAmt = $scope.otherSrcForm.otherAmt;
            otherSourceInfo.otherDescr = $scope.otherSrcForm.otherDescr;
        }
        otherSourceInfo.interestSB = $scope.otherSrcForm.interestSB;
        fintaxFilingService.setInfo('otherSource', otherSourceInfo);
        $state.go("forms.returnFiling.filingInvestment");
    };

    $scope.$watch('otherSrcForm.amountSB', function (val) {
        if (val && val > 0) {
            $scope.otherSrcAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.otherSrcAmntInWords = "";
        }
    });

    $scope.$watch('otherSrcForm.interestSB', function (val) {
        if (val && val > 0) {
            $scope.intrstCreditAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.intrstCreditAmntInWords = "";
        }
    });

    $scope.$watch('otherSrcForm.otherAmt', function (val) {
        if (val && val > 0) {
            $scope.descriptionAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.descriptionAmntInWords = "";
        }
    });
    $scope.$watch('otherSrcForm.otherIncomeSrc', function (val) {
        if(val == 'no'){
            $scope.otherSrcForm.incomeInterest = 'no';
            $scope.otherSrcForm.unaccountedIncome = 'no';
        }
    });
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingOtherSrc :input").attr("disabled", true);
            $("#filingOtherSrc :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingOtherSrcInfoCtrl', filingOtherSrcInfoCtrl);
