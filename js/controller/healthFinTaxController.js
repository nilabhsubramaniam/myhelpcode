/* Created by Nilabh on 31-03-2017.*/
function healthInsuranceCtrl($scope, $state, fintaxService,convertDigitsIntoWords) {
    $scope.healthInsuranceFormData = {
        corporateSelf :'no',
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

    $scope.init = function () {
        fintaxService.getInfo().then(function (response) {
            var currentValue = response.healthInsurance;
            if (currentValue) {
                if (!IsAdmin())formStatus(response.state);
                $scope.healthInsuranceFormData.corporateSelf = currentValue.corporateSelf;
                if (currentValue.corporateAmt) {
                    $scope.healthInsuranceFormData.corporate = 'yes';
                    $scope.healthInsuranceFormData.corporateAmt = currentValue.corporateAmt;
                }
                if (currentValue.parentsAmt) {
                    $scope.healthInsuranceFormData.parents = 'yes';
                    $scope.healthInsuranceFormData.parentsAmt = currentValue.parentsAmt;
                }
                if (currentValue.privateAmt) {
                    $scope.healthInsuranceFormData.private = 'yes';
                    $scope.healthInsuranceFormData.privateAmt = currentValue.privateAmt;
                }
                if (currentValue.pvtParentsAmt) {
                    $scope.healthInsuranceFormData.pvtParents = 'yes';
                    $scope.healthInsuranceFormData.pvtParentsAmt = currentValue.pvtParentsAmt;
                }
                if (currentValue.criticalIllnessAmt) {
                    $scope.healthInsuranceFormData.criticalIllness = 'yes';
                    $scope.healthInsuranceFormData.criticalIllnessAmt = currentValue.criticalIllnessAmt;
                }
                if(currentValue.eduLoanIntAmt){
                    $scope.healthInsuranceFormData.eduLoan = 'yes';
                    $scope.healthInsuranceFormData.eduLoanIntAmt = currentValue.eduLoanIntAmt;
                }
                if(currentValue.disabilityInfo){
                    $scope.healthInsuranceFormData.dependentDisability = 'yes';
                    $scope.healthInsuranceFormData.disabilityInfo = currentValue.disabilityInfo;
                }
                if(currentValue.donationAmt){
                    $scope.healthInsuranceFormData.donation = 'yes';
                    $scope.healthInsuranceFormData.donationAmt = currentValue.donationAmt;
                }
            }
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.submitHealthInsurance = function () {
        var healthInfo = {};
         healthInfo.corporateSelf =$scope.healthInsuranceFormData.corporateSelf;
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
        fintaxService.setInfo('healthInsurance', healthInfo);
        $state.go("forms.fintax.fintaxDoc_upload");
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
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#healthInsurance :input").attr("disabled", true);
            $("#healthInsurance :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('healthInsuranceCtrl', healthInsuranceCtrl);

