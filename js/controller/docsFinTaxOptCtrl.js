/**
 * Created by Asad on 07/04/17.
 */

function docsFinTaxOptCtrl($scope, $state, $http, $q, toaster, $uibModal, fintaxService) {

    $scope.init = function () {
        currentValue();
    };

    $scope.uploadAllowed = true;
    $scope.submitAllowed = false;
    $scope.outputDocUploadAllowed = false;
    $scope.outputDocAvailable = false;
    $scope.downloadLink = "";
    $scope.payslipLinkExists = false;
    $scope.ctcLinkExists = false;
    $scope.taxstmtLinkExists = false;
    $scope.outputDocLinkExists = false;
    $scope.viewPayslip = "";
    $scope.viewCTC = "";
    $scope.viewTaxStmt = "";
    $scope.viewOutputDoc = "";

    $scope.uploadPayslip = function () {
        var file = $scope.payslip;
        if (typeof (file) == 'undefined') {
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file, "payslip").then(function (response) {
            checkDocsStatus(response.doc);
            toaster.success({body: "Payslip uploaded Successfully!"});
        }, function () {
            toaster.error({body: "Payslip upload failed!"});
        });
    };

    $scope.uploadCTC = function () {
        var file = $scope.ctc;
        if (typeof (file) == 'undefined') {
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file, "ctc").then(function (response) {
            checkDocsStatus(response.doc);
            toaster.success({body: "CTC uploaded successfully!"});
        }, function () {
            toaster.error({body: "CTC upload failed!"});
        });
    };

    $scope.uploadTaxStmt = function () {
        var file = $scope.taxstmt;
        if (typeof (file) == 'undefined') {
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file, "taxstmt").then(function (response) {
            toaster.success({body: "Tax Statement uploaded successfully!"});
        }, function () {
            toaster.error({body: "Tax Statement upload failed!"});
        });
    };

    $scope.uploadOutputDoc = function () {
        var file = $scope.outputdoc;
        if (typeof (file) == 'undefined') {
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file, "finTaxOptOutput").then(function (response) {
            toaster.success({body: "Tax Optimisation report uploaded successfully!"});
        }, function () {
            toaster.error({body: "Tax Optimisation upload failed!"});
        });
    };

    function uploadFile(file, filetype) {
        var deferred = $q.defer();

        var fd = new FormData();
        var url = window.link.fintaxopt + '/upload/' + getUserId();
        var customFileName = getUserId() + "_" + filetype + "_" + file.name;
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
            url: window.link.fintaxopt + '/upload/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                checkDocsStatus(response.data.doc);
            }
        }, function errorCallback(response) {
            console.log(response.data);
        });
    }

    function checkDocsStatus(docs){
        var google = "https://docs.google.com/viewer?url=";
        angular.forEach(docs, function (doc) {
            if (doc.doc_type === "payslip") {
                $scope.viewPayslip = google + doc.s3_url_data;
                $scope.payslipLinkExists = true;
            }
            if (doc.doc_type === "ctc") {
                $scope.viewCTC = google + doc.s3_url_data;
                $scope.ctcLinkExists = true;
            }
            if (doc.doc_type === "taxstmt") {
                $scope.viewTaxStmt = google + doc.s3_url_data;
                $scope.taxstmtLinkExists = true;
            }
            if (doc.doc_type === "finTaxOptInput") {
                //$scope.viewAcctRegnForm = google + doc.s3_url_data;
                $scope.uploadAllowed = false;
                if(IsAdmin()) $scope.outputDocUploadAllowed = true;
            }
            if (doc.doc_type === "finTaxOptOutput") {
                $scope.viewOutputDoc = google + doc.s3_url_data;
                // $scope.outputDocAvailable = true;
                $scope.outputDocLinkExists = true;
            }
        });
        $scope.submitAllowed = $scope.uploadAllowed == false ? false : $scope.payslipLinkExists && $scope.ctcLinkExists;
    }

    $scope.initiatePdfReport = function(){
        $http({
            method: 'POST',
            url: window.link.fintaxopt + '/submit/' +  getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            toaster.success({body: "Thanks for providing the information. This is done for now. Our tax advisor will shortly reach out to your on your registered mobile number to fix an appointment for a telephonic call. The purpose of the call is for our advisor to clarify any doubts on the information submitted. "});
            fintaxService.formSubmitted();
            $scope.uploadAllowed = false;
            $scope.submitAllowed = false;
        }, function errorCallback(response) {
            toaster.error({body: "Please Upload paySlip and CTC or Salary Structure "});
            console.log(response)
        });
    }
}
angular.module('finatwork').controller('docsFinTaxOptCtrl', docsFinTaxOptCtrl);
