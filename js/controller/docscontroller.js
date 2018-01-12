function fileUploadCtrl($scope, $state, $http, $q, toaster, $uibModal) {

    $scope.init = function(){
        formStatus();
        getUserStatus();
    };

    $scope.acctRegnFormAvailable = false;
    $scope.downloadLink = "";
    $scope.isPanViewLinkExists = false;
    $scope.isAddressViewLinkExists = false;
    $scope.isPanChequeLinkExists = false;
    $scope.viewPan = "";
    $scope.viewAddress = "";
    $scope.viewCancelledcheque = "";

    $scope.uploadPan = function () {
        var file_pan = $scope.pan;
        if (typeof (file_pan) == 'undefined'){
            toaster.error({body: 'Please choose a file to upload'});
            return;
        }
        uploadFile(file_pan,"Pan").then(function (response) {
            var count = checkDocsStatus(response);
            if(count === 3){
                showModalWindow();
                updateProfileStatus().then(function (response) {
                    console.log("done")
                }, function () {

                });
            }else{
                toaster.success({body: "PAN uploaded Successfully!"});
            }
        }, function() {
            toaster.error({body: "Pan upload failed!"});
        });
    };

        $scope.uploadAddress = function () {
            var file_address = $scope.address;
            if (typeof (file_address) == 'undefined'){
                toaster.error({body: 'Please choose a file to upload'});
                return;
            }

        uploadFile(file_address,"Address").then(function (response) {
            var count = checkDocsStatus(response);
            if(count === 3) {
                showModalWindow();
                updateProfileStatus().then(function (response) {
                    console.log("done")
                }, function () {

                });
            }else{
                toaster.success({body: "Address proof uploaded successfully!"});
            }
        }, function() {
            toaster.error({body: "Address proof upload failed!"});
        });
    };

        $scope.uploadCancelledCheque = function () {
            var cancelled_cheque = $scope.cancelledcheque;
            if (typeof (cancelled_cheque) == 'undefined') {
                toaster.error({body: 'Please choose a file to upload'});
                return;
            }

        uploadFile(cancelled_cheque,"CancelledCheque").then(function (response) {
            var count = checkDocsStatus(response);
            if(count === 3){
                showModalWindow();
                updateProfileStatus().then(function(response){
                    console.log("done")
                },function () {

                });
            }else{
                toaster.success({body: "Cancelled cheque uploaded successfully!"});
            }
        }, function() {
            toaster.error({body: "Cancelled cheque upload failed!"});
        });
    };

   // }

    function uploadFile(file,filetype) {
        var deferred = $q.defer();

        var fd = new FormData();
        var url = window.link.file_upload;
        var customFileName = getUserId()+"_"+filetype+"_"+file.name;
        fd.append('file', file, customFileName);

        if($scope.formEditStatus || IsAdmin()){
            url = window.link.file_upload+"/"+getUserId();
        }

        $http.post(url, fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined,
                'x-access-token': window.localStorage.getItem('token')}
            })
            .success(function (file_id) {
                deferred.resolve(file_id);
            })
            .error(function (error) {
                //count++;
                console.log(error);
            });

        return deferred.promise;
    }

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.file_upload + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var google = "https://docs.google.com/viewer?url=";
            if(response.data != null) {
                angular.forEach(response.data.doc, function (docs) {
                    if (docs.doc_type === "Pan") {
                        $scope.viewPan = google + docs.s3_url_data;
                        $scope.isPanViewLinkExists = true;
                    }
                    if (docs.doc_type === "Address") {
                        $scope.viewAddress = google + docs.s3_url_data;
                        $scope.isAddressViewLinkExists = true;
                    }
                    if (docs.doc_type === "CancelledCheque") {
                        $scope.viewCancelledcheque = google + docs.s3_url_data;
                        $scope.isPanChequeLinkExists = true;
                    }
                    if (docs.doc_type === "acctRegnForm") {
                        $scope.viewAcctRegnForm = google + docs.s3_url_data;
                        if(IsAdmin()){
                            $scope.acctRegnFormAvailable = false;
                        } else{
                            $scope.acctRegnFormAvailable = true;
                        }
                    }
                });
            }

        }, function errorCallback(response) {

        });
    }

    function getUserStatus(){
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "active") {
                        isActive = true;
                    }
                }
                if (isActive && !IsAdmin()) {
                    $(".docs-disabled").attr("disabled", true);
                }
            } catch (e) {

            }
        }, function errorCallback(response) {
            console.log(JSON.stringify(response));
        });
    }

    function checkDocsStatus(response){
        var count = 0;
        angular.forEach(response.doc, function (docs) {
            var google = "https://docs.google.com/viewer?url=";
            if (docs.doc_type === "Pan") {
                $scope.viewPan = google+docs.s3_url_data;
                $scope.isPanViewLinkExists = true;
                count = count + 1;
            }
            if (docs.doc_type === "Address") {
                $scope.viewAddress = google+docs.s3_url_data;
                $scope.isAddressViewLinkExists = true;
                count = count + 1;
            }
            if (docs.doc_type === "CancelledCheque") {
                $scope.viewCancelledcheque = google+docs.s3_url_data;
                $scope.isPanChequeLinkExists = true;
                count = count + 1;
            }
        });
        return count;
    }

    function showModalWindow(){
        var modalInstance = $uibModal.open({
            templateUrl: 'views/modal_upload_doc.html',
            controller: modelButtonController,
            windowClass: "animated fadeIn"
        });
    }

    function updateProfileStatus() {
        var deferred = $q.defer();
        var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
        var data = {
            registration: {
                status: "acct_info_provided",
                notes:{
                    text:"done"
                }
            }
        };

        $http({
            method: 'POST',
            url: window.link.engagement+"/"+userId ,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem("token")}
        }).then(function successCallback(response) {
            deferred.resolve();
        }, function errorCallback(response) {

        });

        return deferred.promise;
    }
}
angular.module('finatwork').controller('fileUploadCtrl', fileUploadCtrl);