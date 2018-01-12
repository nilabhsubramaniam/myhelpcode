/**
 * Created by Finatwork on 22-04-2017.
 */
function filingHealthCtrl($scope, $state, fintaxFilingService, fintaxService, convertDigitsIntoWords) {
    $scope.healthInsuranceFormData = {
        corporateSelf: 'no',
        corporate: 'no',
        parents: 'no',
        private: 'no',
        pvtParents: 'no',
        criticalIllness: 'no',
        eduLoan: 'no',
        dependentDisability: 'no',
        donation: 'no'

    };
    $scope.formEditable = true;
    $scope.healthInfoOptAvailable = false;
    $scope.init = function () {
        fintaxFilingService.getInfo('healthInsurance').then(function (response) {
            if (response != null) {
                if (!IsAdmin())formStatus(response.state);
                if($scope.formEditable){
                    fintaxService.getInfo().then(function (response) {
                        if (response != null && response.healthInsurance != null) {
                            $scope.healthInfoOptAvailable = true;
                            $scope.healthInfoOpt = response.healthInsurance;
                        } else {
                            console.log(response)
                        }
                    });
                }
                $scope.healthInfo = response.healthInsurance;
                if ($scope.healthInfo) populateInfo();
            } else {
                console.log("employment empty");
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.copyHealthOptimization = function () {
        $scope.healthInfo = $scope.healthInfoOpt;
        if ($scope.healthInfo) populateInfo();
    };

    $scope.submitHealthInfo = function () {
        var healthInfo = {};
        healthInfo.corporateSelf = $scope.healthInsuranceFormData.corporateSelf;
        if ($scope.healthInsuranceFormData.corporate == 'yes') {
            healthInfo.corporateAmt = $scope.healthInsuranceFormData.corporateAmt;
        }
        if ($scope.healthInsuranceFormData.parents == 'yes') {
            healthInfo.parentsAmt = $scope.healthInsuranceFormData.parentsAmt;
        }
        if ($scope.healthInsuranceFormData.private == 'yes') {
            healthInfo.privateAmt = $scope.healthInsuranceFormData.privateAmt;
        }
        if ($scope.healthInsuranceFormData.pvtParents == 'yes') {
            healthInfo.pvtParentsAmt = $scope.healthInsuranceFormData.pvtParentsAmt;
        }
        if ($scope.healthInsuranceFormData.criticalIllness == 'yes') {
            healthInfo.criticalIllnessAmt = $scope.healthInsuranceFormData.criticalIllnessAmt;
        }
        if ($scope.healthInsuranceFormData.eduLoan == 'yes') {
            healthInfo.eduLoanIntAmt = $scope.healthInsuranceFormData.eduLoanIntAmt;
        }
        if ($scope.healthInsuranceFormData.dependentDisability == 'yes') {
            healthInfo.disabilityInfo = $scope.healthInsuranceFormData.disabilityInfo;
        }
        if ($scope.healthInsuranceFormData.donation == 'yes') {
            healthInfo.donationAmt = $scope.healthInsuranceFormData.donationAmt;
        }
        fintaxFilingService.setInfo("healthInsurance", healthInfo);
        $state.go("forms.returnFiling.filingUploadDocs");
    };
    $scope.$watch('healthInsuranceFormData.corporateAmt', function (val) {
        if (val && val > 0) {
            $scope.corporateAmtInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.corporateAmtInWords = "";
        }
    });
    $scope.$watch('healthInsuranceFormData.parentsAmt', function (val) {
        if (val && val > 0) {
            $scope.parentsInsuranceAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.parentsInsuranceAmntInWords = "";
        }
    });
    $scope.$watch('healthInsuranceFormData.privateAmt', function (val) {
        if (val && val > 0) {
            $scope.selfInsuranceAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.selfInsuranceAmntInWords = "";
        }
    });
    $scope.$watch('healthInsuranceFormData.pvtParentsAmt', function (val) {
        if (val && val > 0) {
            $scope.parentPersonalInsuranceAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.parentPersonalInsuranceAmntInWords = "";
        }
    });
    $scope.$watch('healthInsuranceFormData.criticalIllnessAmt', function (val) {
        if (val && val > 0) {
            $scope.illnessInsuranceAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.illnessInsuranceAmntInWords = "";
        }
    });
    $scope.$watch('healthInsuranceFormData.eduLoanIntAmt', function (val) {
        if (val && val > 0) {
            $scope.educationLoanAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.educationLoanAmntInWords = "";
        }
    });
    $scope.$watch('healthInsuranceFormData.donationAmt', function (val) {
        if (val && val > 0) {
            $scope.financialClaimAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.financialClaimAmntInWords = "";
        }
    });
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingHealthInsurance :input").attr("disabled", true);
            $("#filingHealthInsurance :submit").attr("disabled", true);
        }
    }

    function populateInfo() {
        $scope.healthInsuranceFormData.corporateSelf = $scope.healthInfo.corporateSelf;
        if ($scope.healthInfo.corporateAmt) {
            $scope.healthInsuranceFormData.corporate = 'yes';
            $scope.healthInsuranceFormData.corporateAmt = $scope.healthInfo.corporateAmt;
        }
        if ($scope.healthInfo.parentsAmt) {
            $scope.healthInsuranceFormData.parents = 'yes';
            $scope.healthInsuranceFormData.parentsAmt = $scope.healthInfo.parentsAmt;
        }
        if ($scope.healthInfo.privateAmt) {
            $scope.healthInsuranceFormData.private = 'yes';
            $scope.healthInsuranceFormData.privateAmt = $scope.healthInfo.privateAmt;
        }
        if ($scope.healthInfo.pvtParentsAmt) {
            $scope.healthInsuranceFormData.pvtParents = 'yes';
            $scope.healthInsuranceFormData.pvtParentsAmt = $scope.healthInfo.pvtParentsAmt;
        }
        if ($scope.healthInfo.criticalIllnessAmt) {
            $scope.healthInsuranceFormData.criticalIllness = 'yes';
            $scope.healthInsuranceFormData.criticalIllnessAmt = $scope.healthInfo.criticalIllnessAmt;
        }
        if ($scope.healthInfo.eduLoanIntAmt) {
            $scope.healthInsuranceFormData.eduLoan = 'yes';
            $scope.healthInsuranceFormData.eduLoanIntAmt = $scope.healthInfo.eduLoanIntAmt;
        }
        if ($scope.healthInfo.disabilityInfo) {
            $scope.healthInsuranceFormData.dependentDisability = 'yes';
            $scope.healthInsuranceFormData.disabilityInfo = $scope.healthInfo.disabilityInfo;
        }
        if ($scope.healthInfo.donationAmt) {
            $scope.healthInsuranceFormData.donation = 'yes';
            $scope.healthInsuranceFormData.donationAmt = $scope.healthInfo.donationAmt;
        }
    }
}
angular.module('finatwork').controller('filingHealthCtrl', filingHealthCtrl);