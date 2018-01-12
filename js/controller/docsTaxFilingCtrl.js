function confirmationModalController($scope, close) {
    $scope.close = function (result) {
        close(result, 200);
    };
}
function docListModalController($scope, docList,fintaxFilingService, close) {
    var google = "https://docs.google.com/viewer?url=";
    angular.forEach(docList, function (docs) {
        switch (docs.doc_type) {
            case 'pan':
                $scope.viewPAN = google + docs.s3_url_data;
                break;
            case 'form26AS':
                $scope.viewForm26AS = google + docs.s3_url_data;
                break;
            case 'prevYearReturn':
                $scope.viewPrevYearReturn = google + docs.s3_url_data;
                break;
            case 'form16':
                $scope.viewForm16 = google + docs.s3_url_data;
                break;
            case 'interestCert':
                $scope.viewInterestCert = google + docs.s3_url_data;
                break;
            case 'capGainShare':
                $scope.viewCapGainShare = google + docs.s3_url_data;
                break;
            case 'capGainMF':
                $scope.viewCapGainMF = google + docs.s3_url_data;
                break;
            case 'capGainOther':
                $scope.viewCapGainOther = google + docs.s3_url_data;
                break;
            case 'proofSec80C':
                $scope.viewProofSec80C = google + docs.s3_url_data;
                break;
            case 'proofSec80D':
                $scope.viewProofSec80D = google + docs.s3_url_data;
                break;
            case 'proofSec80G':
                $scope.viewProofSec80G = google + docs.s3_url_data;
                break;
            case 'proofSec80E':
                $scope.viewProofSec80E = google + docs.s3_url_data;
                break;
            case 'savingAcctInterest':
                $scope.viewSavingAcctInterest = google + docs.s3_url_data;
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
function docsTaxFilingCtrl($scope, $state, $http, $q, toaster, $uibModal, ModalService, fintaxFilingService) {
    $scope.uploadAllowed = true;
    $scope.submitAllowed = false;
    $scope.outputDocUploadAllowed = false;
    $scope.outputDocAvailable = false;
    $scope.docTypeMapping = {
        pan: "PAN",//1 mandatory
        form26AS: "26AS Tax Credit Statement",//1 mandatory
        prevYearReturn: "Previous year's return",//1 optional
        form16: "Form 16",//1 Mandatory + 3 optional
        interestCert: "Interest Certificate",//3 optional
        capGainShare: "Capital Gain/Losses Shares",//1 optional
        capGainMF: "Capital Gain/Losses Mutual Funds",//1 optional
        capGainOther: "Capital Gain/Losses Others",//1 optional
        proofSec80C: 'Investment Proofs under Sec 80C',//2 optional
        proofSec80D: 'Health Insurance under Sec 80D',//2 optional
        proofSec80G: 'Donation under Sec 80G',//2 optional
        proofSec80E: 'Interest Education Loan under Sec 80E',//1 optional
        savingAcctInterest:'Statement of savings account interest  ',// optional
        miscDoc:'Miscellaneous '// optional
    };

    $scope.init = function () {
        currentValue();
    };

    $scope.uploadDoc = function () {
        var file = $scope.filingDoc;
        if (typeof (file) == 'undefined') {
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file, $scope.taxFiling).then(function (response) {
            checkDocsStatus(response.doc);
            /*To reset file*/
            $scope.taxFiling = '';
            angular.element("input[type='file']").val(null);
            toaster.success({body: "Document uploaded successfully!"});
        }, function () {
            toaster.error({body: "Document upload failed!"});
        });
    };

    function uploadFile(file, fileType) {
        var deferred = $q.defer();
        var fd = new FormData();
        var url = window.link.fintaxfiling + '/upload/' + getUserId();
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
            url: window.link.fintaxfiling + '/upload/' + getUserId(),
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
                case 'pan':
                    $scope.viewPAN = true;
                    break;
                case 'form26AS':
                    $scope.viewForm26AS = true;
                    break;
                case 'prevYearReturn':
                    $scope.viewPrevYearReturn = true;
                    break;
                case 'form16':
                    $scope.viewForm16 = true;
                    break;
                case 'interestCert':
                    $scope.viewInterestCert = true;
                    break;
                case 'capGainShare':
                    $scope.viewCapGainShare = true;
                    break;
                case 'capGainMF':
                    $scope.viewCapGainMF = true;
                    break;
                case 'capGainOther':
                    $scope.viewCapGainOther = true;
                    break;
                case 'proofSec80C':
                    $scope.viewProofSec80C = true;
                    break;
                case 'proofSec80D':
                    $scope.viewProofSec80D = true;
                    break;
                case 'proofSec80G':
                    $scope.viewProofSec80G = true;
                    break;
                case 'proofSec80E':
                    $scope.viewProofSec80E = true;
                    break;
                case 'savingAcctInterest':
                    $scope.viewSavingAcctInterest = true;
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
        $scope.submitAllowed = $scope.uploadAllowed == false ? false : $scope.viewPAN && $scope.viewForm26AS && $scope.viewForm16;
    }
    $scope.checkUploadedDocuments = function () {
        ModalService.showModal({
            templateUrl: "views/docLinkModalWindow.html",
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
    $scope.initiatePdfReport = function () {
        ModalService.showModal({
            templateUrl: "views/confirmationModalWindow.html",
            controller: "confirmationModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $http({
                        method: 'POST',
                        url: window.link.fintaxfiling + '/submit/' + getUserId(),
                        headers: {'x-access-token': window.localStorage.getItem('token')}
                    }).then(function successCallback(response) {
                        toaster.success({body: "Thanks for providing the information. This is done for now. Our tax advisor will shortly reach out to your on your registered mobile number to fix an appointment for a telephonic call. The purpose of the call is for our advisor to clarify any doubts on the information submitted. "});
                        fintaxFilingService.getInfo(null,null,true).then(function (response) {
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
    .controller('docsTaxFilingCtrl', docsTaxFilingCtrl)
    .controller('confirmationModalController', confirmationModalController)
    .controller('docListModalController', docListModalController);
