/*** Created by Nilabh on 04-05-2017.*/
function filingSalaryIncomeCtrl($scope, $state, fintaxFilingService, fintaxService, convertDigitsIntoWords, ModalService, toaster) {
    $scope.salaryFormData = {
        salaried: 'no',
        changedJob: 'no',
        prevEmploymentDetails: [{
            PrevEmployer: '',
            PrevEmploymentFromDate: startPrevFiscalYear(),
            PrevEmploymentEndDate: endPrevFiscalYear()
        }]
    };
    $scope.startFiscalYear = startPrevFiscalYear();
    $scope.endFiscalYear = endPrevFiscalYear();
    $scope.formEditable = true;
    $scope.init = function () {
        fintaxFilingService.getInfo('salary').then(function (response) {
            if (response != null && response.salary !== undefined && response.salary.salaried != undefined) {
                if (!IsAdmin())formStatus(response.state);
                $scope.salaryFormData.salaried = response.salary.salaried;
                if ($scope.salaryFormData.salaried) {
                    $scope.salaryFormData.employer = response.salary.employer;
                    $scope.salaryFormData.employmentFromDate = moment(response.salary.employmentFromDate);
                    $scope.salaryFormData.employmentEndDate = moment(response.salary.employmentEndDate);
                    $scope.salaryFormData.changedJob = response.salary.changedJob;
                    if($scope.salaryFormData.changedJob){
                        response.salary.prevEmploymentDetails.forEach(function (prevEmp,index) {
                            if(index===0) {
                                $scope.salaryFormData.prevEmploymentDetails[index].PrevEmployer = prevEmp.PrevEmployer;
                                $scope.salaryFormData.prevEmploymentDetails[index].PrevEmploymentFromDate = moment(prevEmp.PrevEmploymentFromDate);
                                $scope.salaryFormData.prevEmploymentDetails[index].PrevEmploymentEndDate = moment(prevEmp.PrevEmploymentEndDate);
                            } else{
                                $scope.salaryFormData.prevEmploymentDetails.push({
                                    PrevEmployer: prevEmp.PrevEmployer,
                                    PrevEmploymentFromDate: moment(prevEmp.PrevEmploymentFromDate),
                                    PrevEmploymentEndDate: moment(prevEmp.PrevEmploymentEndDate)
                                })
                            }
                        });
                    }
                }
            } else {
                fintaxService.getBasicInfo().then(function (response) {
                    $scope.salaryFormData.salaried = response.salaried;
                    $scope.salaryFormData.changedJob = response.changedJob;
                    $scope.salaryFormData.employmentFromDate = startPrevFiscalYear();
                    $scope.salaryFormData.employmentEndDate = endPrevFiscalYear();
                });
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.addEmployer = function (index) {
        $scope.salaryFormData.prevEmploymentDetails[1] = {
            PrevEmployer: '',
            PrevEmploymentFromDate: startPrevFiscalYear(),
            PrevEmploymentEndDate: endPrevFiscalYear()
        };
    };
    $scope.deleteEmployer = function (index) {
        $scope.salaryFormData.prevEmploymentDetails.splice(index, 1);
    };
    $scope.submitSalaryIncomeInfo = function () {
        fintaxFilingService.setInfo("salary", $scope.salaryFormData);
        $state.go("forms.returnFiling.filingHouseProperty");
    };
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingSalaryIncome :input").attr("disabled", true);
            $("#filingSalaryIncome :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork')
    .controller('filingSalaryIncomeCtrl', filingSalaryIncomeCtrl);

