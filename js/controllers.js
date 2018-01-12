/**
 * Finatwork - Rights reserved to finatwork
 * Functions (controllers)
 *  - MainCtrl
 *  - dashboardFlotFive
 *  - dashboardMap
 *  - wizardCtrl
 *  - chartistCtrl
 *  - datatablesCtrl

 *
 *
 */

/**
 * wizardCtrl - Controller for wizard functions
 * used in Wizard view
 */
function wizardCtrl($scope, $rootScope) {
    // All data will be store in this object
    $scope.formData = {};

    // After process wizard
    $scope.processForm = function () {
        //alert('Wizard completed');
    };

}
function regModalCtrl($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function registerCtrl($scope, $state, $stateParams, $http, $window, toaster,$uibModal) {

    //Register --
    $scope.init = function (){
        $scope.register = [];
        $scope.register.firstname = "";
        $scope.register.lastname = "";
        $scope.register.password = "";
        $scope.register.email = "";
        $scope.register.phone = "";
        $scope.register.agreeTerms = false;
    };
    $scope.doRegister = function () {
        var userdetails = {
            password: $scope.register.password,
            firstname: $scope.register.firstname,
            lastname: $scope.register.lastname,
            username: $scope.register.email,
            mobile: $scope.register.phone
        };

        if ($scope.register.cpassword != $scope.register.password) {
            toaster.error({body: "Password doesn't match"});
            return false;
        }

        var url = window.link.user_register;
        $http({
            method: 'POST',
            url: url,
            data: $.param(userdetails),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(data) {
            toaster.success({body: 'Registered successfully!'});
            window.localStorage.setItem("user_details", JSON.stringify(userdetails));
            $state.go("verify_otp");
        }, function errorCallback(response) {
            //toaster.error({body: response.data.err.message});

        });
    };
    $scope.showTerms = function(){
        $scope.register.agreeTerms = false;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/register_modal_privacy.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    $scope.showTermsOfUse = function(){
        $scope.register.agreeTerms = false;
        var modalInstance = $uibModal.open({
            templateUrl: 'views/register_modal_terms_of_use.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
}
function verifyOTPCtrl($scope, $state, $stateParams, $http, $window, toaster) {

    //Register --
    $scope.register = [];
    $scope.register.otp = "";

    $scope.doRegisterOTP = function () {
        var user_details = JSON.parse(window.localStorage.getItem("user_details"));

        var otpData = {
            otp: $scope.register.otp,
            username: user_details.username,
            mobile: user_details.mobile
        };
        var url = window.link.verify_otp;
        $http({
            method: 'POST',
            url: url,
            data: $.param(otpData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            toaster.success({body: 'OTP Verified!'});
            $state.go("login");
        }, function errorCallback(response) {
            toaster.error({body: response.data.error});

        });
    }
}
function topNavigationCtrl($location, $scope, $window, $state, commonServices, toaster) {

    $scope.isEdit = commonServices.getIsEditable();

    $scope.logout = function () {
        toaster.success({body: 'Have a nice day !'});
        $window.localStorage.clear();
        $location.path("/login");
    };

    $scope.openSubscription = function(){
        $state.go('forms.subscription.serviceCart');
    };
    $scope.OpenProfile = function(){
        /*var state_machine =  $window.localStorage.getItem("state_machine");
        state_machine = JSON.parse(state_machine);

        var isActive = false;

        for(var i=0; i<state_machine.registration.length;i++){
            if(state_machine.registration[i].status == "active"){
                isActive = true;
            }
        }

        if (isActive) {
            $window.CanEditProfile = false;
        } else {
            $window.CanEditProfile = true;
        }*/
        if(IsAdmin()){
            if(window.currentUesrId != "" && window.currentUesrId !== undefined)
                $state.go('forms.wizard.basic_info');
            else
                toaster.error({body: "Please load any one of profile!"});
        }else {
            $state.go('forms.wizard.basic_info');
        }
    };
}

function navigationCtrl($location, $scope, $window, $rootScope, commonServices,fintaxService,$state,finGpsService) {

    $scope.isEdit = commonServices.getIsEditable();
    $scope.user_name = getFullUserName();
    if ($rootScope.name) $scope.user_name = $rootScope.name;

    if (IsAdmin()) {
        $("#Clients").show();
        $("#Operations").show();
        $("#Research").show();
        $("#Reversefeed").show();
    } else {
        $("#Clients").hide();
        $("#Operations").hide();
        $("#Research").hide();
        $("#Reversefeed").hide();
    }


    //TODO: code to set engagements - need to revisit it.
    $scope.VisitSVC = function(svc){
       var state_machine =  $window.localStorage.getItem("state_machine");
        state_machine = JSON.parse(state_machine);

        var isService = false;

        for(var i=0; i<state_machine.serviceAvailed.length;i++){
            if(state_machine.serviceAvailed[i].status == svc){
                isService = true;
            }
        }

        if (!isService) {
            //visit service
        }else{
            //dashboard
        }
    };

    $scope.openFinTax = function () {
        console.log("navigationCtrl openFinTax");
        fintaxService.getSubscriptionStatus('finTax').then(function (response) {
            if(response){
                fintaxService.getBasicInfo().then(function (response) {
                    if(response != null){
                        $state.go("dashboards.fintax");
                    } else {
                        $state.go("dashboards.fintaxOptimization");
                    }
                }, function(reason){
                    console.log(reason);
                });
            } else {
                $state.go("dashboards.finTax");
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.openFinGps = function () {
        finGpsService.getSubscriptionStatus('finGps').then(function (response) {
            if (response) {
                if (response != null) {
                    $state.go("forms.finGps.personal&Work.personal");
                } else {
                    $state.go("dashboards.finGpsGuideLines");
                }
            } else {
                $state.go("dashboards.finGps");
            }
        }, function (reason) {
            console.log(reason);
        });
    };

}


function formWizardCtrl($http, $scope, commonServices, formEditService, Scopes) {
    Scopes.store('formWizardCtrl', $scope);
    $scope.isEdit = commonServices.getIsEditable();
    $scope.isFormEdit = formEditService.getIsEditable();
    $scope.currentFinancialYear = currentFinancialYear();
    $scope.prevFinancialYear = prevFinancialYear();
    if (IsAdmin()) {
        $("#account_verify").show();
    } else {
        $("#account_verify").hide();
    }
}

function reverseFeedUploadCtrl($scope, $state, $http, $q, toaster) {
    if (IsAdmin) {
        $scope.uploadReverseFeed = function () {
            var reversefeed = $scope.reversefeed;
            if (typeof (reversefeed) == 'undefined') return;

            uploadFile(reversefeed).then(function (file_id) {
                toaster.success({body: "Uploaded successfully!"});
            });

            function uploadFile(file) {
                var deferred = $q.defer();

                var fd = new FormData();

                fd.append('file', file);

                $http.post(window.link.reverseFeed, fd, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function (file_id) {
                        deferred.resolve(file_id);
                    })
                    .error(function (error) {
                        console.log(error);
                    });

                return deferred.promise;
            }
        };

    }
}
function forgotPasswordCtrl($scope, $state, $stateParams, $http, $window, toaster) {

    $scope.email = "";
    $scope.forgotPassword=true;
    $scope.displayMessage=false;
    $scope.resetPassword = function () {
        $http({
            method: 'POST',
            url: window.link.password_forgot,
            data: {username: $scope.email, frontend: FRONTEND_URL}
        }).then(function successCallback(response) {
            $scope.displayMessage=true;
            $scope.forgotPassword=false;
        }, function errorCallback(response) {
            //toaster.error({body: response.data.err});
        });
    }
}

function resetPasswordCtrl($scope, $state, $stateParams, $http, $window, toaster) {

    $scope.validToken = true;

    $http({
        method: 'GET',
        url: window.link.password_reset + '/' + $stateParams.token
    }).then(function successCallback(response) {
        console.log(response);
    }, function errorCallback(response) {
        $state.go("forgot_password");
        $scope.validToken = false;
    });


    $scope.confirmPassword = function () {

        if(!$scope.validToken){
            return false;
        }
        if ($scope.newConfirmPassword != $scope.newPassword) {
            toaster.error({body: "Password doesn't match"});
            return false;
        }
        $http({
            method: 'POST',
            url: window.link.password_reset + '/' + $stateParams.token,
            data: {password: $scope.newPassword}
        }).then(function successCallback(response) {
            toaster.success({body: 'Password updated!'});
            $state.go("login");
        }, function errorCallback(response) {
            toaster.error({body: response.data.err});

        });
    }
}

function finalFormCtrl($scope, $state, $stateParams, $http, $window, toaster) {

    //TODO: need to move it success handler once api is ready

    $("#finalURL").attr('src',"http://docs.google.com/gview?url=http://infolab.stanford.edu/pub/papers/google.pdf&embedded=true");

    // $http({
    //     method: 'GET',
    //     url: window.link.finalForm + "/" + window.localStorage.getItem("userid"),
    //     headers: {'x-access-token': window.localStorage.getItem('token')}
    // }).then(function successCallback(response) {
    //
    // }, function errorCallback(response) {
    //     console.log(response);
    // });

}

/**
 *
 * Pass all functions into module
 */
angular
    .module('finatwork')
    .controller('wizardCtrl', wizardCtrl)
    .controller('finHealthCtrl', finHealthCtrl)
    .controller('topNavigationCtrl', topNavigationCtrl)
    .controller('navigationCtrl', navigationCtrl)
    .controller('formWizardCtrl', formWizardCtrl)
    .controller('reverseFeedUploadCtrl',reverseFeedUploadCtrl)
    .controller('registerCtrl', registerCtrl)
    .controller('forgotPasswordCtrl', forgotPasswordCtrl)
    .controller('finalFormCtrl', finalFormCtrl)
    .controller('resetPasswordCtrl', resetPasswordCtrl)
    .controller('regModalCtrl', regModalCtrl);