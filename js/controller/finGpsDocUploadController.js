/*** Created by Nilabh on 13-09-2017.*/
function confirmationModalController($scope, close) {
    $scope.close = function (result) {
        close(result, 200);
    };
}
function docListModalController($scope, docList,finGpsService, close) {
    var google = "https://docs.google.com/viewer?url=";
    angular.forEach(docList, function (docs) {
        switch (docs.doc_type) {
            case 'salaryStatement':
                $scope.viewSalaryStatement = google + docs.s3_url_data;
                break;
            case 'mutualFundStatement':
                $scope.viewMutualFundStatement = google + docs.s3_url_data;
                break;
            case 'insurancePolicies':
                $scope.viewInsurancePolicies = google + docs.s3_url_data;
                break;
            case 'miscDoc':
                $scope.viewMiscDoc = google + docs.s3_url_data;
                break;
        }
    });

    $scope.close = function (result) {
        close(result, 200);
    };
}
function finGpsDocUploadCtrl($scope, $state, $http, $q, toaster, $uibModal, ModalService, finGpsService) {
    $scope.uploadAllowed = true;
    $scope.submitAllowed = false;
    $scope.outputDocUploadAllowed = false;
    $scope.outputDocAvailable = false;
    $scope.docTypeMapping = {
        salaryStatement: "Salary Statement",// optional
        mutualFundStatement: "Mutual Fund Statement",//optional
        insurancePolicies: "Insurance Policies",//optional
        miscDoc:'Miscellaneous '// optional
    };

    $scope.init = function () {
        currentValue();
    };
    $scope.uploadDoc = function () {
        var file = $scope.finGpsDoc;
        if (typeof (file) == 'undefined') {
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file, $scope.finGpsDoc).then(function (response) {
            checkDocsStatus(response.doc);
            /*To reset file*/
            $scope.finGpsDoc = '';
            angular.element("input[type='file']").val(null);
            toaster.success({body: "Document uploaded successfully!"});
        }, function () {
            toaster.error({body: "Document upload failed!"});
        });
    };
    function uploadFile(file, fileType) {
        var deferred = $q.defer();
        var fd = new FormData();
        var url = window.link.finGps + '/upload/' + getUserId();
        var customFileName = getUserId() + "_" + fileType + "_" + file.name;
        fd.append('file', file, customFileName);

        $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {
                    'Content-Type': undefined,
                    'x-access-token': window.localStorage.getItem('token')
                }
            }
        ).success(function (file_id) {
            deferred.resolve(file_id);
        }).error(function (error) {
            console.log(error);
        });

        return deferred.promise;
    }

    function currentValue() {
        $http({
            method: 'GET',
            url: window.link.finGps + '/upload/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.docList = response.data.doc;
                checkDocsStatus(response.data.doc);
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    }
    function checkDocsStatus(docs){
        angular.forEach(docs, function (doc) {
            switch (doc.doc_type) {
                case 'salaryStatement':
                    $scope.viewSalaryStatement = true;
                    break;
                case 'mutualFundStatement':
                    $scope.viewMutualFundStatement = true;
                    break;
                case 'insurancePolicies':
                    $scope.viewInsurancePolicies = true;
                    break;
                case 'miscDoc':
                    $scope.viewMiscDoc = true;
                    break;
                case 'finTaxFilingInput':
                    $scope.uploadAllowed = false;
                    if(IsAdmin()) $scope.outputDocUploadAllowed = true;
                    break;
                case 'finTaxFilingOutput':
                    $scope.viewOutputDoc = google + doc.s3_url_data;
                    $scope.outputDocLinkExists = true;
                    break;
            }
        });
        //$scope.submitAllowed = $scope.uploadAllowed == false ? false : $scope.viewPAN && $scope.viewForm26AS && $scope.viewForm16; -> this line is not req - remove
    }
    $scope.checkUploadedDocuments = function () {
        ModalService.showModal({
            templateUrl: "views/finGpsDocLinkModalWindow.html",
            controller: "docListModalController",
            inputs: {
                docList : $scope.docList
            }
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                console.log(result)
            });
        });
    };
    $scope.initiateExcelReport = function () {
        ModalService.showModal({
            templateUrl: "views/finGpsDocConfirmationModal.html",
            controller: "confirmationModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $http({
                        method: 'POST',
                        url: window.link.finGps + '/submit/' + getUserId(),
                        headers: {'x-access-token': window.localStorage.getItem('token')}
                    }).then(function successCallback(response) {
                        toaster.success({body: "Thanks for providing the information. This is done for now. Our Finance advisor will shortly reach out to your on your registered mobile number to fix an appointment for a telephonic call. The purpose of the call is for our advisor to clarify any doubts on the information submitted. "});
                        finGpsService.getInfo(null,null,true).then(function (response) {
                            if (response != null) {
                                $scope.uploadAllowed = false;
                                $scope.submitAllowed = false;
                            }
                        }, function () {
                            console.log(reason);
                        });
                    }, function errorCallback(response) {
                        console.log(response);
                        // toaster.error({body: "Please Upload PAN and 26AS Tax Credit Statement or Form 16 "});
                    });
                }
            });
        });
    }

}
angular.module('finatwork')
    .controller('finGpsDocUploadCtrl', finGpsDocUploadCtrl)
    .controller('confirmationModalController', confirmationModalController)
    .controller('docListModalController', docListModalController);
