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

function navigationCtrl($location, $scope, $window, $rootScope, commonServices,fintaxService,$state) {

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
        fintaxService.getSubscriptionStatus('finGps').then(function (response) {
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
function loginCtrl($scope, $state, $timeout, $http, $window, toaster, commonServices, formEditService, fintaxService, fintaxFilingService) {

    $scope.login = [];
    $scope.login.username = "";
    $scope.login.password = "";

    $scope.doLogin = function () {
        var credentials = {
            username: $scope.login.username,
            password: $scope.login.password
        };

        var url = window.link.user_login;

        $http({
            method: 'POST',
            url: url,
            data: $.param(credentials),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            toaster.success({body: 'Welcome' +'   ' + response.data.firstname +'  ' +'!'});
            fintaxService.reset();
            fintaxFilingService.reset();
            $window.localStorage.setItem("token", response.data.token);
            $window.localStorage.setItem("username", response.data.username);
            $window.localStorage.setItem("userid", response.data.userid);
            $window.localStorage.setItem("role", response.data.role);
            $window.localStorage.setItem("firstname", response.data.firstname);
            $window.localStorage.setItem("lastname", response.data.lastname);

            if(response.data.role === "admin") {
                $state.go('admin.clients');
            }else{
                $http({
                    method: 'GET',
                    url: window.link.engagement + "/" + response.data.userid,
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    $window.localStorage.setItem("state_machine", JSON.stringify(response.data));
                    if (response.data == 0) {
                        return false;
                    }
                    try {
                        var isActive = false;

                        for (var i = 0; i < response.data.registration.length; i++) {
                            if (response.data.registration[i].status == "active") {
                                isActive = true;
                            }
                        }
                        var isEditable = false;
                        var isFormEdit = {
                            personal: true,
                            bank: true,
                            nominee: true,
                            kyc: true,
                            docs: true,
                            service: true
                        };
                        for (var i = 0; i < response.data.accountInfo.length; i++) {
                            if (response.data.accountInfo[i].state == "basicInfo") {
                                isEditable = true;
                                isFormEdit.personal = false;
                            }
                            if (response.data.accountInfo[i].state == "personalInfo")
                                isFormEdit.bank = false;
                            if (response.data.accountInfo[i].state == "bankInfo")
                                isFormEdit.nominee = false;
                            if (response.data.accountInfo[i].state == "nomineeInfo")
                                isFormEdit.kyc = false;
                            if (response.data.accountInfo[i].state == "KYC")
                                isFormEdit.docs = false;
                            if (response.data.accountInfo[i].state == "docs")
                                isFormEdit.service = false;
                            if (isActive)
                                isFormEdit.service = false;
                        }
                        commonServices.setIsEditable(!isEditable);
                        formEditService.setIsEditable(isFormEdit);
                        if (isActive) {
                                $state.go('forms.my_finatwork');
                        } else {
                            var currentState = "";
                            var state = "";
                            var nextState = "";
                            switch (response.data.state) {
                                case "notRegistered":
                                    state = "notRegistered";
                                    nextState = "notRegistered";
                                    break;
                                case "registered":
                                    state = "registered";
                                    nextState = "registered";
                                    break;
                                case "OTPVerified":
                                    state = "OTPVerified";
                                    nextState = "OTPVerified";
                                    break;
                                case "loggedIn":
                                    state = "loggedIn";
                                    nextState = "dashboards.basic_info";
                                    break;
                                case "basicInfo":
                                    state = "forms.wizard.basic_info";
                                    nextState = "forms.my_finatwork";
                                    break;
                                case "healthOrRisk":/*Not a possible state*/
                                    state = "dashboards.risk_health";
                                    nextState = "notRegistered";
                                    break;
                                case "finHealth":
                                    state = "forms.fin_health";
                                    nextState = "dashboards.goals_home";
                                    break;
                                case "riskProfile":
                                    state = "forms.risk_profile";
                                    nextState = "dashboards.goals_home";
                                    break;
                                case "personalInfo":
                                    state = "forms.wizard.personal-info";
                                    nextState = "forms.wizard.bank-info";
                                    break;
                                case "bankInfo":
                                    state = "forms.wizard.bank-info";
                                    nextState = "forms.wizard.nominee-info";
                                    break;
                                case "KYC":
                                    state = "forms.wizard.kyc-fatca";
                                    nextState = "forms.wizard.file_upload";
                                    break;
                                case "nomineeInfo":
                                    state = "forms.wizard.nominee-info";
                                    nextState = "forms.wizard.kyc-fatca";
                                    break;
                                case "dashboard":
                                    state = "forms.my_finatwork";
                                    nextState = "forms.my_finatwork";
                                    break;
                                case "savedGoal":
                                    state = "dashboards.goal-dashboard";
                                    nextState = "dashboards.goal-dashboard";
                                    break;
                                case "createGoal":/*not possible state*/
                                    state = "dashboards.goals_home";
                                    nextState = "dashboards.goal-dashboard";
                                    break;
                            }
                            (nextState != "") ? $state.go(nextState) : $state.go("/dashboards/my_finatwork");
                        }

                    } catch (e) {
                        //TODO: we need to remove it later.
                        console.log("State name is incorrect!" + response.data.state);
                    }
                }, function errorCallback(response) {
                    console.log(JSON.stringify(response));
                });
            }
        }, function errorCallback(response) {
            /*if(response.data.err.message.message == null){//TODO temp fix, should be corrected in BE
                toaster.error({body: response.data.err.message});
            } else {
                toaster.error({body: response.data.err.message.message});
            }*/
        });
    }
}

angular.module('finatwork').controller('loginCtrl', loginCtrl);

/**
 * personalInfo - Controller for personalInfo Form
 */
angular.module('finatwork').controller('modelButtonController', modelButtonController);
function personalInfo($scope, $http, toaster, $state, $uibModal, formEditService, Scopes) {
    $scope.formStatus = false;
    $scope.formEditStatus = false;
    function get_age(born, now) {
        var birthday = new Date(born.getFullYear(), born.getMonth(), born.getDate());
        if (now >= birthday)
            return now.getFullYear() - born.getFullYear();
        else
            return now.getFullYear() - born.getFullYear() - 1;
    }

    $scope.personalInfoFormData = {
        KYC: 0,
        token: window.localStorage.getItem("token"),
        _userid: getUserId()
    };
    $scope.submitText = "Save";

    $scope.init = function () {
        if (!IsAdmin()) {
            formStatus();
        }
        getDefaultValue();
        $scope.occupationList = [];
        $scope.taxStatusList = [];
        var options = {
            types: ['(cities)']
        };
        var input = document.getElementById('geo-location');
        new google.maps.places.Autocomplete(input, options);

        input = document.getElementById('nri-geo-location');
        new google.maps.places.Autocomplete(input, options);

        loadOccupationList();
        loadTaxStatusList();

    };

    $scope.otherOccupationdetails = function () {
        $scope.otherOccupation = $scope.personalInfoFormData.occupation == "8";
    };

    var loadOccupationList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.occupation
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.occupationList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
        $scope.otherOccupation = false;
    };

    var loadTaxStatusList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.tax_status
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.taxStatusList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    var explodeLocation = function (location) {
        var locationArray = location.split(', ');
        return {
            city: locationArray[0],
            state: locationArray.length == 3 ? locationArray[1] : locationArray[0],
            country: locationArray.length == 3 ? locationArray[2] : locationArray.length == 2 ? locationArray[1] : locationArray[0]
        };
    };

    var explodeNRILocation = function (location) {
        var locationArray = location.split(', ');
        return {
            nri_city: locationArray[0],
            nri_state: locationArray.length == 3 ? locationArray[1] : locationArray[0],
            nri_country: locationArray.length == 3 ? locationArray[2] : locationArray.length == 2 ? locationArray[1] : locationArray[0]
        };
    };

    var getDefaultValue = function () {
        $http({
            method: 'GET',
            url: window.link.personal + '/' + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.personalInfoFormData = {
                    firstName: response.data.firstName,
                    middleName: response.data.middleName,
                    lastName: response.data.lastName,
                    maidenFirstName: response.data.maidenFirstName,
                    maidenMiddleName: response.data.maidenMiddleName,
                    maidenLastName: response.data.maidenLastName,
                    dob: moment(response.data.dob, "YYYY-MM-DD").format('YYYY-MM-DD'),
                    occupation: response.data.occupation,
                    PAN: response.data.PAN,
                    confirmPAN: response.data.PAN,
                    KYC: (response.data.KYC) ? '1' : '0',
                    KIN: response.data.KIN,
                    tax_status: response.data.tax_status,
                    fatherFirstName: response.data.fatherFirstName,
                    fatherMiddleName: response.data.fatherMiddleName,
                    fatherLastName: response.data.fatherLastName,
                    motherFirstName: response.data.motherFirstName,
                    motherMiddleName: response.data.motherMiddleName,
                    motherLastName: response.data.motherLastName,
                    addressProofType: response.data.addressProofType,
                    addr1: response.data.addr1,
                    addr2: response.data.addr2,
                    state: response.data.state,
                    country: response.data.country,
                    pincode: response.data.pincode,
                    NRI: response.data.NRI,
                    nri_addr1: response.data.nri_addr1,
                    nri_addr2: response.data.nri_addr2,
                    nri_pincode: response.data.nri_pincode,
                    nri_state: response.data.nri_state,
                    nri_country: response.data.nri_country
                };
                if ($scope.personalInfoFormData.occupation == "8") {
                    $scope.otherOccupation = true;
                    $scope.personalInfoFormData.occupation_other = response.data.occupation_other;
                }
                if (response.data.city === response.data.state && response.data.state === response.data.country) {
                    $scope.personalInfoFormData.location = response.data.city;
                } else if (response.data.city === response.data.state) {
                    $scope.personalInfoFormData.location = response.data.city + ', ' + response.data.country;
                } else {
                    $scope.personalInfoFormData.location = response.data.city + ', ' + response.data.state + ', ' + response.data.country;
                }
                if (response.data.nri_city === response.data.nri_state && response.data.nri_state === response.data.nri_country) {
                    $scope.personalInfoFormData.nri_location = response.data.nri_city;
                } else if (response.data.nri_city === response.data.nri_state) {
                    $scope.personalInfoFormData.nri_location = response.data.nri_city + ', ' + response.data.nri_country;
                } else {
                    $scope.personalInfoFormData.nri_location = response.data.nri_city + ', ' + response.data.nri_state + ', ' + response.data.nri_country;
                }
            } else {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/personal_modal.html',
                    controller: modelButtonController,
                    windowClass: "animated fadeIn"
                });
                $http({
                    method: 'GET',
                    url: window.link.basics + '/' + getUserId(),
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    if (response.data != null) {
                        $scope.personalInfoFormData.NRI = response.data.NRI;
                        $scope.personalInfoFormData.dob = moment(response.data.dob, "YYYY-MM-DD").format('YYYY-MM-DD');
                    } else {
                        return false;
                    }
                }, function errorCallback(response) {
                    console.log("basic query error:" + response);
                });
            }
        }, function errorCallback(response) {
            console.log("personal query error :" + response);
        });
    };

    $scope.submitPersonalInfoForm = function () {
        if ($scope.formStatus) {
            $state.go('forms.wizard.service_request');
        } else {
            var formObj = document.getElementById("personalInfoForm");
            var now = moment().startOf('day');
            var dob = moment(formObj.dob.value).startOf('day');
            if (now.diff(dob, 'years', true) <= 18) {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/basic_modal.html',
                    controller: modelButtonController,
                    windowClass: "animated fadeIn"
                });
                return;
            }
            $scope.personalInfoFormData.dob = moment.utc(formObj.dob.value).format();
            $scope.personalInfoFormData.location = formObj.location.value;
            $scope.personalInfoFormData.nri_location = formObj.nri_location.value;
            $scope.personalInfoFormData = angular.extend($scope.personalInfoFormData, explodeLocation($scope.personalInfoFormData.location), explodeNRILocation($scope.personalInfoFormData.nri_location));

            if ($scope.personalInfoFormData.confirmPAN != $scope.personalInfoFormData.PAN) {
                toaster.error({body: "PAN Number doesn't match"});
                return false;
            }

            var url = window.link.personal;
            if ($scope.formEditStatus || IsAdmin()) {
                url = window.link.personal + "/" + getUserId();
            }
            $http({
                method: 'POST',
                url: url,
                data: $scope.personalInfoFormData,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                toaster.success("Saved");
                if (!$scope.formEditStatus) {
                    var isFormEdit = {
                        personal: false,
                        bank: false,
                        nominee: true,
                        kyc: true,
                        docs: true,
                        service: true
                    };
                    formEditService.setIsEditable(isFormEdit);
                    Scopes.get('formWizardCtrl').isFormEdit.bank = false;
                }
                $state.go("forms.wizard.bank-info");
            }, function errorCallback(response) {
                //toaster.error({body: response.data.reason});

            });
        }
    };

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + window.localStorage.getItem("userid"),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "acct_verified") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
                if (isActive) {
                    $("#personalInfoForm :input").attr("disabled", true);
                    $("#personalInfoForm :submit").attr("disabled", false);
                }
                var isEditable = false;
                for (var i = 0; i < response.data.accountInfo.length; i++) {
                    if (response.data.accountInfo[i].state == "personalInfo") {
                        isEditable = true;
                    }
                }
                if (isEditable)
                    $scope.submitText = "Update";
                $scope.formEditStatus = isEditable;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('personalInfo', personalInfo);
/**
 * bankInfo - Controller for bankInfo Form
 */
function modelButtonController($scope, $uibModalInstance) {
    $scope.ok = function () {
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}
angular.module('finatwork').controller('modelButtonController', modelButtonController);
function bankInfo($scope, $http, toaster, $uibModal, $state, formEditService, Scopes) {
    $scope.formStatus = false;
    $scope.formEditStatus = false;
    $scope.submitText = "Save";
    $scope.showFullForm = false;
    $scope.bankInfoFormData = {
        token: window.localStorage.getItem("token"),
        _userid: window.localStorage.getItem("userid")
    };
    $scope.accountTypeList = [];
    $scope.ifscFlag = false;
    $scope.invalidIfscCode = false;

    var loadAccountTypeList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.account_type,
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.accountTypeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    var loadBillDeskBankList = function () {
        $http({
            method: 'GET',
            url: window.link.billdeskbank + '?activeflag=Y&bank_category=Net Banking',
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            (response.data).push({"bd_bank_code": "non_billdesk", "bd_bank_name": "Other Bank"});
            $scope.BillDeskBankList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.init = function () {
        if (!IsAdmin())fourmStatus();
        loadAccountTypeList();
        loadBillDeskBankList();
        getDefaultValue();
    };
    $scope.otherBankDetails = function () {
        $scope.otherBank = $scope.bd_bank == "non_billdesk";
        if ($scope.bd_bank == "non_billdesk") {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_otherbank_info.html',
                controller: modelButtonController,
                windowClass: "animated fadeIn"
            });
        }
    };
    $scope.getBankDetails = function () {
        if ($scope.ifscFlag) {
            return false;
        }

        $scope.ifscFlag = true;
        $scope.invalidIfscCode = false;
        $http({
            method: 'GET',
            url: window.link.ifsc + '/' + $scope.bankInfoFormData.ifsc_code,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            $scope.ifscFlag = false;
            if (typeof response.data == 'string') {
                $scope.invalidIfscCode = true;
                return false;
            }
            $scope.showFullForm = true;
            $scope.bankInfoFormData.name = response.data.BANK;
            $scope.bankInfoFormData.branch = response.data.BRANCH;
            $scope.bankInfoFormData.addr = response.data.ADDRESS;
            $scope.bankInfoFormData.city = response.data.CITY;
            $scope.bankInfoFormData.country = "India";
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.submitBankInfoForm = function () {
        if ($scope.formStatus) {
            $state.go('forms.wizard.service_request');
        } else {
            if ($scope.ifscFlag || $scope.invalidIfscCode) {
                return false;
            }
            if ($scope.bankInfoFormData.confirm_account_number != $scope.bankInfoFormData.account_number) {
                toaster.error({body: "Account Number doesn't match"});
                return false;
            }
            var pincodeIndex = $scope.bankInfoFormData.addr.search(/[1-9][0-9]{5}$/);
            if (pincodeIndex > 0) {
                $scope.bankInfoFormData.pincode = $scope.bankInfoFormData.addr.substring(pincodeIndex);
            }
            $scope.bankInfoFormData.code = $scope.bd_bank;
            $scope.bankInfoFormData.bankType = ($scope.bd_bank == "non_billdesk") ? "non_billdesk" : "billdesk";

            var formObj = document.getElementById("bankInfoForm");
            var url = window.link.bank;
            var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
            if ($scope.formEditStatus || IsAdmin()) {
                url = window.link.bank + "/" + userId;
            }
            $http({
                method: 'POST',
                url: url,
                data: $.param($scope.bankInfoFormData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                toaster.success("Saved");
                if (!$scope.formEditStatus) {
                    var isFormEdit = {
                        personal: false,
                        bank: false,
                        nominee: false,
                        kyc: false,
                        docs: true,
                        service: true
                    };
                    formEditService.setIsEditable(isFormEdit);
                    Scopes.get('formWizardCtrl').isFormEdit.nominee = false;
                }
                $state.go("forms.wizard.nominee-info");
            }, function errorCallback(response) {
                //toaster.error({body: response.data.err});
            });
        }
    };
    function getDefaultValue() {
        var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url: window.link.bank + "/" + userId,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.bankInfoFormData = {
                    token: window.localStorage.getItem("token"),
                    _userid: (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid"),
                    acctName: response.data.acctName,
                    name: response.data.name,
                    code: response.data.code,
                    ifsc_code: response.data.ifsc_code,
                    branch: response.data.branch,
                    addr: response.data.addr,
                    account_number: response.data.account_number,
                    confirm_account_number: response.data.account_number,
                    account_type: response.data.account_type,
                    otherBankText: (response.data.bankType === "non_billdesk") ? response.data.name : ""
                };
                $scope.bd_bank = (response.data.bankType === "non_billdesk") ? response.data.bankType : response.data.code;
                $scope.otherBank = ($scope.bd_bank == "non_billdesk") ? true : false;
                $scope.showFullForm = true;
            }
        }, function errorCallback(response) {
            $scope.bankInfoFormData = {
                token: window.localStorage.getItem("token"),
                _userid: (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid")
            };
        });
    }

    function fourmStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + window.localStorage.getItem("userid"),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "acct_verified") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
                if (isActive) {
                    $("#bankInfoForm :input").attr("disabled", true);
                    $("#bankInfoForm :submit").attr("disabled", false);
                }
                var isEditable = false;
                for (var i = 0; i < response.data.accountInfo.length; i++) {
                    if (response.data.accountInfo[i].state == "bankInfo") {
                        isEditable = true;
                    }
                }
                if (isEditable)
                    $scope.submitText = "Update";
                $scope.formEditStatus = isEditable;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('bankInfo', bankInfo);

/**
 * basicInfo - Controller for basicInfo Form
 */
function basicInfo($scope, $http, toaster, $state, $window, $uibModal, commonServices, formEditService) {
    $scope.formStatus = false;
    $scope.formEditStatus = false;
    $scope.submitText = "Save";
    function get_age(born, now) {
        var birthday = new Date(born.getFullYear(), born.getMonth(), born.getDate());
        if (now >= birthday)
            return now.getFullYear() - born.getFullYear();
        else
            return now.getFullYear() - born.getFullYear() - 1;
    }


    $scope.basicInfoFormData = {
        gender: 'male',
        NRI: 'RI',
        is_married: 'single',
        spouse_age: '',
        children: 0,
        dependents: 0,
        token: window.localStorage.getItem("token"),
        _userid: (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid")
    };
    $scope.init = function () {
        if(!IsAdmin()){formStatus();}
        var options = {
            types: ['(cities)']
        };
        var input = document.getElementById('geo-location');
        new google.maps.places.Autocomplete(input, options);
        getDefaultValue();
    };

    var explodeLocation = function (location) {
        var locationArray = location.split(', ');
        return {
            city: locationArray[0],
            state: locationArray.length == 3 ? locationArray[1] : locationArray[0],
            country: locationArray.length == 3 ? locationArray[2] : locationArray.length == 2 ? locationArray[1] : locationArray[0]
        };
    };

    $scope.submitBasicInfoForm = function () {
        var formObj = document.getElementById("basicInfoForm");

        var now = moment().startOf('day');
        var dob = moment(formObj.dob.value).startOf('day');
        if (now.diff(dob, 'years', true) < 18){
            var modalInstance = $uibModal.open({
                templateUrl: 'views/basic_modal.html',
                controller: modelButtonController,
                windowClass: "animated fadeIn"
            });
            return;
        }
       if($scope.basicInfoFormData.is_married === 'married') {
            if ($scope.basicInfoFormData.spouse_age < 18 || $scope.basicInfoFormData.spouse_age > 100) {
                toaster.error({body: "Spouse age should be between 18 years and 100 years"});
                return false;
            }
        }
        if($scope.formStatus){
            $state.go('forms.wizard.service_request');
        }else{
            $scope.basicInfoFormData.dob = moment.utc(formObj.dob.value).format();
            $scope.basicInfoFormData.location = formObj.location.value;
            $scope.basicInfoFormData = angular.extend($scope.basicInfoFormData, explodeLocation($scope.basicInfoFormData.location));
            var url = window.link.basics;
            var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
            if($scope.formEditStatus || IsAdmin()){
                url = window.link.basics+"/"+userId;
            }
            $http({
                method: 'POST',
                url: url,
                data: $.param($scope.basicInfoFormData),
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            }).then(function successCallback(response) {
                toaster.success("Saved");
                if(!$scope.formEditStatus) {
                    var isFormEdit = {
                        personal: false,
                        bank: true,
                        nominee: true,
                        kyc: true,
                        docs: true,
                        service: true
                    };
                    commonServices.setIsEditable(false);
                    formEditService.setIsEditable(isFormEdit);
                }
                if($scope.formEditStatus){
                    $state.go("forms.wizard.personal-info");
                } else {
                    $state.go("forms.my_finatwork");
                }
            }, function errorCallback(response) {
                //toaster.error({body: response.data.err});
            });
        }
    };

    function getDefaultValue(){
        var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url:  window.link.basics+"/"+userId,
            headers : { 'x-access-token': window.localStorage.getItem('token') }
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.basicInfoFormData = {
                    gender: response.data.gender,
                    NRI: response.data.NRI,
                    is_married:response.data.is_married,
                    spouse_age: response.data.spouse_age,
                    children: response.data.children,
                    dependents: response.data.dependents,
                    dob: moment(response.data.dob, "YYYY-MM-DD").format('YYYY-MM-DD'),
                    token: window.localStorage.getItem("token"),
                    _userid: userId
                };
                if(response.data.city === response.data.state && response.data.state === response.data.country){
                   $scope.basicInfoFormData.location = response.data.city;
                } else if(response.data.city === response.data.state) {
                   $scope.basicInfoFormData.location = response.data.city +', ' + response.data.country;
                } else {
                    $scope.basicInfoFormData.location = response.data.city +', ' + response.data.state +', ' + response.data.country;
                }
            }
        }, function errorCallback(response) {
            $scope.basicInfoFormData = {
                gender: 'male',
                NRI: 'RI',
                location: '',
                is_married: 'single',
                spouse_age: 0,
                children: 0,
                dependents: 0,
                token: window.localStorage.getItem("token"),
                _userid: userId
            };
        });
    }

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + window.localStorage.getItem("userid"),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "acct_verified") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
                if(isActive) {
                    $("#basicInfoForm :input").attr("disabled", true);
                    $("#basicInfoForm :submit").attr("disabled", false);
                }
                var isEditable = false;
                for (var i = 0; i < response.data.accountInfo.length; i++) {
                    if (response.data.accountInfo[i].state == "basicInfo") {
                        isEditable = true;
                    }
                }
                if(isEditable)
                    $scope.submitText = "Update";
                $scope.formEditStatus = isEditable;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('basicInfo', basicInfo);

/**
 * NomineeInfo - Controller for NomineeInfo Form
 */
function nomineeInfo($scope, $http, toaster, formEditService, Scopes, $state) {
    var uid = 1;
    $scope.relationshiplist = ["Father", "Mother", "Wife", "Husband", "Son", "Daughter", "Father-in-law",
        "Mother-in-law", "Son-in- law", "Daughter-in-law", "Aunt", "Uncle", "Niece", "Nephew", "Brother",
        "Sister", "Grand Father", "Grand Mother", "Others"];
    $scope.isnomineeminor = false;
    $scope.nomineeList = [];
    $scope.nomineeInfoFormData = {};
    $scope.isAddForm = true;
    $scope.submitText = "Submit";
    $scope.formStatus = false;
    $scope.formEditStatus = false;
    $scope.ignoreNominee = false;

    $scope.init = function () {
        var options = {
            types: ['(cities)']
        };
        var input = document.getElementById('geo-location');
        new google.maps.places.Autocomplete(input, options);
        getDefaultValue();
        if (!IsAdmin())formStatus();
    };
    var explodeLocation = function (location) {
        var locationArray = location.split(', ');
        return {
            city: locationArray[0],
            state: locationArray.length == 3 ? locationArray[1] : locationArray[0],
            country: locationArray.length == 3 ? locationArray[2] : locationArray.length == 2 ? locationArray[1] : locationArray[0]
        };
    };
    $scope.copyMyAddress = function () {
        if ($scope.isSelected) {
            $http({
                method: 'GET',
                url: window.link.personal + '/' + getUserId(),
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data != null) {
                    $scope.nomineeInfoFormData.addr1 = response.data.addr1;
                    $scope.nomineeInfoFormData.addr2 = response.data.addr2;
                } else {
                    console.log("ERROR: address can't be empty");
                }
            }, function errorCallback(response) {
                console.log("Personal query error:" + response);
            });
        } else {
            if ($scope.nomineeInfoFormData.addr1 != null) {
                $scope.nomineeInfoFormData.addr1 = "";
            }
            if ($scope.nomineeInfoFormData.addr2 != null) {
                $scope.nomineeInfoFormData.addr2 = "";
            }
        }
    };
    $scope.submitNomineeInfoForm = function () {
        if ($scope.ignoreNominee === false) {
            var formObj = document.getElementById("nomineeInfoForm");
            $scope.nomineeInfoFormData.city = formObj.city.value;
            $scope.nomineeInfoForm = angular.extend($scope.nomineeInfoForm, explodeLocation($scope.nomineeInfoFormData.city));
            var newNominee = {
                name: formObj.name.value,
                dob: moment(formObj.dob.value).format('YYYY-MM-DD'),
                relation: formObj.relation.value,
                guardian_name: formObj.guardian_name.value,
                guardian_pan: formObj.guardianPAN.value,
                percent: $scope.percentageSliderOptions.value,
                addr1: formObj.addr1.value,
                addr2: formObj.addr2.value,
                addr3: "",
                city: $scope.nomineeInfoForm.city,
                state: $scope.nomineeInfoForm.state,
                pincode: formObj.pincode.value,
                _id: $scope.nomineeInfoFormData._id

            };

            if (newNominee._id == null) {
                newNominee._id = uid++;
                $scope.nomineeList.push(newNominee);
            } else {
                for (var i in $scope.nomineeList) {
                    if ($scope.nomineeList[i]._id == newNominee._id) {
                        $scope.nomineeList[i] = newNominee;
                    }
                }
            }
        }
        $scope.nomineeInfoFormData = {};
        $scope.isAddForm = false;
    };

    $scope.addNominee = function () {
        $scope.percentageSliderOptions.value = 1;
        $scope.isAddForm = true;
        $scope.ignoreNominee = false;
    };
    $scope.cancelNominee = function () {
        if ($scope.nomineeList.length) {
            $scope.isAddForm = false;
            $scope.ignoreNominee = true;
        }
    };

    $scope.$watch("nomineeInfoFormData.dob", function (newValue, oldValue) {
        var born = new Date(newValue);
        var now = new Date();
        var age = get_age(born, now);
        $scope.isnomineeminor = (age < 18);
    });

    function get_age(born, now) {
        var birthday = new Date(now.getFullYear(), born.getMonth(), born.getDate());
        if (now >= birthday)
            return now.getFullYear() - born.getFullYear();
        else
            return now.getFullYear() - born.getFullYear() - 1;
    }


    $scope.chk_allocation = function () {
        var nomineeList = $scope.nomineeList;
        var totalPercent = 0;
        for (var i in nomineeList) {
            var percent = nomineeList[i].percent;
            if (percent != undefined)
                totalPercent = parseInt(totalPercent) + parseInt(percent);
        }
        return (totalPercent !== 100);
    };

    $scope.submitNominee = function () {
        if ($scope.formStatus) {
            $state.go('forms.wizard.service_request');
        } else {
            if ($scope.chk_allocation()) {
                toaster.error({body: "Total Nominee Percentage should be 100"});
                return;
            }
            for (var i = 0; i < $scope.nomineeList.length; i++) {
                if (Number.isInteger($scope.nomineeList[i]._id)) {
                    delete $scope.nomineeList[i]._id;
                }
            }
            var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
            var data = {
                _userid: userId,
                details: $scope.nomineeList
            };
            var url = window.link.nominee;
            if ($scope.formEditStatus || IsAdmin()) {
                url = window.link.nominee + "/" + userId;
            }
            $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                toaster.success("Saved");
                if (!$scope.formEditStatus) {
                    var isFormEdit = {
                        personal: false,
                        bank: false,
                        nominee: false,
                        kyc: false,
                        docs: true,
                        service: true
                    };
                    formEditService.setIsEditable(isFormEdit);
                    Scopes.get('formWizardCtrl').isFormEdit.kyc = false;
                }
                $state.go("forms.wizard.kyc-fatca");
            }, function errorCallback(response) {
                //toaster.error({body: response.data.reason});

            });
        }
    };
    $scope.percentageSliderOptions = {
        value: 1,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            minLimit: 1,
            maxLimit: 100,
            showTicks: 20,
            showTicksValues: true
        }
    };


    function getDefaultValue() {
        var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url: window.link.nominee + "/" + userId,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                for (var i = 0; i < response.data.details.length; i++) {
                    response.data.details[i].dob = moment(response.data.details[i].dob).format('YYYY-MM-DD');
                    if (response.data.details[i].city !== response.data.details[i].state) {
                        response.data.details[i].city = response.data.details[i].city + ', ' + response.data.details[i].state;
                    }
                }
                $scope.nomineeList = response.data.details;
                $scope.isAddForm = false;
            }
        }, function errorCallback(response) {

        });
    }

    $scope.delete = function (id) {
        for (var i in $scope.nomineeList) {
            if ($scope.nomineeList[i]._id == id) {
                $scope.nomineeList.splice(i, 1);
                $scope.nomineeInfoFormData = {};
            }
        }
    };

    $scope.edit = function (id) {
        for (var i in $scope.nomineeList) {
            if ($scope.nomineeList[i]._id == id) {
                $scope.nomineeInfoFormData = angular.copy($scope.nomineeList[i]);
                $scope.percentageSliderOptions.value = $scope.nomineeInfoFormData.percent;
            }
        }
        $scope.isAddForm = true;
        $scope.ignoreNominee = false;
    };

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + window.localStorage.getItem("userid"),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "acct_verified") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
                var isEditable = false;
                for (var i = 0; i < response.data.accountInfo.length; i++) {
                    if (response.data.accountInfo[i].state == "nomineeInfo") {
                        isEditable = true;
                    }
                }
                if (isEditable)
                    $scope.submitText = "Update";
                $scope.formEditStatus = isEditable;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('nomineeInfo', nomineeInfo);
function stopGoalModal($scope, close) {
    $scope.close = function (result) {
        close(result, 500);
    };
}
function goalDashboardCtrl($scope, DTOptionsBuilder, $http, thousandSeparator, goalData, $state, toaster, ModalService, $window) {
    var resData;
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            {extend: 'excel', title: 'Goal_List'},
            {
                extend: 'pdf',
                customize: function (win) {
                    $scope.pdfGenerator();
                }
            }
        ])
        .withOption('bFilter', false);

    $scope.init = function () {
        if (IsAdmin()) {
            if (window.currentUesrId != "" && window.currentUesrId !== undefined) {
                getGoalsList('all');
                getBankDetails();
            } else {
                toaster.error({body: "Please load any one of profile!"});
            }
        } else {
            getGoalsList('all');
            getBankDetails();
        }
    };

    function getGoalsList(status) {
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=" + status + "&view=goal&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data.length > 0) {
                resData = response.data;
                for (var i = 0; i < resData.length; i++) {
                    resData[i].updatedAt = moment(resData[i].updatedAt).format('DD-MM-YYYY');
                    resData[i].createdAt = moment(resData[i].createdAt).format('DD-MM-YYYY');
                    resData[i].percentAchievable = Math.round(resData[i].percentAchievable * 100);
                    resData[i].percentAchieved = Math.round(resData[i].percentAchieved * 100);
                    resData[i].marketValue = Math.round(resData[i].marketValue);
                    resData[i].investedCost = Math.round(resData[i].investedCost);
                }
                $scope.goals = resData;

                $scope.ExcelData = [];

                $.each(resData, function (index, val) {
                    var tempObj = {
                        PersonalizedName: val.name,
                        CreationDate: val.createdAt,
                        Value: val.currentPrice,
                        NumberOfYears: val.maturity,
                        ValueFuture: val.futurePrice,
                        MonthlyInvestmentRequired: val.sipRequired,
                        MonthlyInvestmentCommitted: val.sip,
                        AchieveablePercent: val.percentAchievable,
                        AchievedAmount: val.marketValue - val.investedCost
                    };
                    // debugger;
                    $scope.ExcelData.push(tempObj);
                });
                $scope.filename = "Goals_List";
                google.charts.load('current', {'packages': ['corechart']});
                google.charts.setOnLoadCallback(drawSeriesChart);
            } else {
                toaster.error({body: "There is no goals available"});
            }
        }, function errorCallback(response) {

        });
    }

    function getBankDetails() {
        $http({
            method: 'GET',
            url: window.link.bank + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data !== null) {
                $scope.ACH_Status = response.data.umrn ? true : false;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    $scope.pdfGenerator = function () {
        var doc = new jsPDF('p', 'pt');

        var header = function (data) {
            doc.setFontSize(20);
            doc.setTextColor(40);
            doc.setFont("helvetica");
            doc.addImage(headerImgData, 'JPEG', 0, 0, 595, 82);
            //doc.text("Report", data.settings.margin.left + 20, 60);
        };

        doc.autoTable(getColumns(), getData(5), {
            beforePageContent: header,
            startY: doc.autoTableEndPosY() + 100,
            margin: {horizontal: 40},
            styles: {overflow: 'linebreak'},
            headerStyles: {fillColor: [128, 0, 0], textColor: [255, 255, 255], fontSize: 8},
            bodyStyles: {valign: 'top', textColor: [128, 0, 0], fontSize: 8},
            columnStyles: {},
            tableWidth: 'auto'
        });
        doc.save("goals.pdf");
    };

    var getColumns = function () {
        return [
            {title: "Personalized Name", dataKey: "PersonalizedName"},
            {title: "Goal Year", dataKey: "NumberOfYears"},
            {title: "Goal Future Value", dataKey: "ValueFuture"},
            {title: "Reqd Monthly Investment", dataKey: "MonthlyInvestmentRequired"},
            {title: "Amount Committed Lumpsum", dataKey: "LumpsumInvestmentCommitted"},
            {title: "Amount Committed Monthly", dataKey: "MonthlyInvestmentCommitted"},
            {title: "Goal Achieveable %", dataKey: "AchieveablePercent"},
            {title: "Goal Achieved %", dataKey: "AchievedPercent"},
            {title: "Goal Achieved Amount", dataKey: "AchievedAmount"}
        ];
    };

    $scope.goalsDisplayName = {
        "home": "Home",
        "vehicle": "Vehicle",
        "education": "Education",
        "retirement": "Retirement",
        "marriage": "Marriage",
        "contingency": "Contingency",
        "taxPlanning": "Tax Planning",
        "crorepati": "Crorepati",
        "wealthCreation": "Wealth Creation",
        "other": "Other"
    };

    function getData(rowCount) {
        var data = [];
        $.each($scope.goals, function (index, val) {
            var tempObj = {
                // Type: val.type,
                PersonalizedName: val.name || $scope.goalsDisplayName[val.type],
                Value: val.currentPrice,
                NumberOfYears: val.maturity,
                ValueFuture: val.futurePrice,
                MonthlyInvestmentRequired: val.sipRequired,
                MonthlyInvestmentCommitted: val.sip,
                LumpsumInvestmentCommitted: val.lumpsum,
                AchieveablePercent: val.percentAchievable,
                AchievedPercent: val.percentAchieved,
                AchievedAmount: val.marketValue - val.investedCost
            };
            data.push(tempObj);
        });
        return data;

    }

    $scope.isExecuteState = function (state) {
        return state === "set" || state === 'save';
    };

    $scope.isActiveState = function (state) {
        return state === "active" || state === "fullyActive";
    };

    $scope.isTopUpState = function (goalid) {
        var isTopUpState = false;
        $scope.goals.findIndex(function (goal) {
            if (goal._goalid === goalid) {
                if (goal.type !== "wealthCreation" && goal.type !== "taxPlanning" && goal.state === "fullyActive" && $scope.ACH_Status) {
                    /*check for on going Topup*/
                    if (moment() >= moment(goal.sipTopUpEndDate) || goal.sipTopUpEndDate === undefined) {
                        /*check for goal End Date*/
                        if (goal.type === 'contingency' || moment() < moment(goal.toDate)) {
                            isTopUpState = true;
                        }
                    }
                }
            }
        });
        return isTopUpState;
    };

    $scope.getNumber = function (num) {
        return Math.round(num);
    };

    $scope.thousandseparator = thousandSeparator.thousandSeparator;

    function drawSeriesChart() {
        var dynamicData = [];
        dynamicData.push(['ID', 'Goal Year', 'Portfolio Value', ' % Achieved', 'Goal value(FV)']);
        $.each(resData, function (index, val) {
            dynamicData.push([val.name || $scope.goalsDisplayName[val.type], val.maturity, Math.round(val.marketValue), val.percentAchieved, val.futurePrice]);
        });
        var data = google.visualization.arrayToDataTable(dynamicData);
        var minY = d3.min(resData, function (d) {
            return d.marketValue;
        });
        if (minY < 10000) minY = 10000;
        var options = {
            title: 'Goal Dashboard',
            vAxis: {
                title: 'Portfolio Value',
                minValue: minY,
                maxValue: d3.max(resData, function (d) {
                    return d.marketValue;
                })
            },
            hAxis: {
                title: 'Goal Maturity Year',
                minValue: d3.min(resData, function (d) {
                    return moment(d.createdAt, 'DD-MM-YYYY').year();
                }),
                maxValue: d3.max(resData, function (d) {
                    return d.maturity;
                }),
                format: ''
            },
            colorAxis: {minValue: 0, maxValue: 100, colors: ['red', 'yellow', 'green']},
            bubble: {
                textStyle: {
                    fontSize: 12,
                    fontName: 'Times-Roman',
                    color: 'green',
                    bold: true,
                    italic: true
                },
                opacity: 1
            }
        };
        var chart = new google.visualization.BubbleChart(document.getElementById('series_chart_div'));
        chart.draw(data, options);
    }

    $scope.commitGoal = function (goalId) {
        $http({
            method: 'GET',
            url: window.link.create_goal + "/" + goalId + "?view=goal&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            goalData.setGoalData(response.data[0]);
            $state.go("dashboards.goal_info", {type: response.data[0].type, pagestatus: 'fromdashboard'});
        }, function errorCallback(response) {

        });
    };

    $scope.stopGoal = function (goalId) {
        ModalService.showModal({
            templateUrl: "views/terminateGoal_modal.html",
            controller: "stopGoalModal"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                modal.close.then(function (result) {
                    if (result) {
                        var data = {
                            _userid: getUserId(),
                            _goalid: goalId,
                            state: 'stop'
                        };
                        $http({
                            method: 'POST',
                            url: window.link.create_goal + "/" + goalId,
                            data: data,
                            headers: {'x-access-token': window.localStorage.getItem("token")}
                        }).then(function successCallback(response) {
                            toaster.success({body: "Thanks! Acknowledge email sent"});
                            getGoalsList('all');
                        }, function errorCallback(err) {
                            console.log(err);
                        });
                    }
                });

            });
        });
    };

    $scope.topUp = function (goalId) {
        $http({
            method: 'POST',
            url: window.link.create_goal + "/" + goalId,
            data: {state: 'createTopUp', _userid: getUserId()},
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            goalData.setGoalData(response.data);
            $state.go("dashboards.goal-top-up");
        }, function errorCallback(response) {

        });
    };

    $scope.deleteGoal = function (goalID) {
        ModalService.showModal({
            templateUrl: "views/goalDeletionModal.html",
            controller: "stopGoalModal"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    var data = {
                        token: window.localStorage.getItem("token"),
                        _userid: getUserId()
                    };
                    $http({
                        method: 'DELETE',
                        url: window.link.create_goal + '/' + goalID,
                        data: $.param(data),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    }).then(function successCallback(response) {
                        getGoalsList('all');
                    }, function errorCallback(response) {
                        //toaster.error({body: response.data.error.message});
                    });
                }
            });
        });
    };

    var headerImgData = 'data:image/png;base64,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';
}
angular.module('finatwork').factory('goalData', function () {
    var service = {};
    var _data = {};

    service.setGoalData = function (data) {
        _data = data;
    };
    service.getGoalData = function () {
        return _data;
    };
    return service;
});
angular.module('finatwork')
    .controller('goalDashboardCtrl', goalDashboardCtrl)
    .controller('stopGoalModal', stopGoalModal);
/**
 * NomineeInfo - Controller for NomineeInfo Form
 */
function goalsHome($scope, $state, $http) {
    $scope.formStatus = false;
    $scope.riskProfileStatus = false;

    $scope.goals = [
	    {name:"Home",src:"/img/goal_home_m.png", type: "home"},
	    {name:"Vehicle",src:"/img/goal_vehicle_m.png", type: "vehicle"},
	    {name:"Education",src:"/img/goal_education_m.png", type: "education"},
	    {name:"Retirement",src:"/img/goal_retirement_m.png", type: "retirement"},
	    {name:"Marriage",src:"/img/goal_marriage_m.png", type: "marriage"},
	    {name:"Contingency",src:"/img/goal_contingency_m.png", type: "contingency"},
        {name:"Tax Planning",src:"/img/goal_taxPlanning_m.png", type: "taxPlanning"},
        {name:"Crorepati",src:"/img/goal_crorepati_m.png", type: "crorepati"},
        {name:"Wealth Creation",src:"/img/goal_wealthCreation_m.png", type: "wealthCreation"},
        {name:"Other",src:"/img/goal_other_m.png", type: "other"}
    ];
    
    $scope.init = function(){
         riskProfileStatus();
    };

    $scope.goalDetails = function(type){
        if($scope.riskProfileStatus)
            $state.go("dashboards.goal_info", {type: type,pagestatus:'fromhome'});
        else
            $state.go("forms.risk_profile");
    };

    function riskProfileStatus()  {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" +getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if(response.data.riskProfile == null){
                $scope.riskProfileStatus = false;
            } else {
                $scope.riskProfileStatus = response.data.riskProfile;
            }
        }, function errorCallback(response) {
            console.log("Error" + response);
        });
    }
}
angular.module('finatwork').controller('goalsHome', goalsHome);
/**
 * NomineeInfo - Controller for NomineeInfo Form
 */
function goalInfo($scope, $state, $http, $window, c3ChartService, convertDigitsIntoWords, thousandSeparator, goalData, $uibModal, $rootScope, toaster) {
    $scope.type = $state.params.type;
    $scope.pageStatus = $state.params.pagestatus;
    $scope.goalName = "";
    $scope.requestpage = true;
    $scope.responsepage = false;
    $scope.graphResponse = {};
    $scope.percentateFrom = 1;
    var goal_id = "";
    //$scope.goalInfoFormData_loan = 1;
    $scope.goalInfoFormData_year = 1;
    //$scope.goalInfoFormData_month = 1;
    //$scope.goalInfoFormData_achievemonth = 1;
    $scope.isLoanPercentRequired = "";
    $scope.tenureMin = 0;
    $scope.tenureMax = 50;
    $scope.FDtoRealDiff = 0;
    $scope.areaChartFeaturePrice = 0;
    $scope.goalLabel = {
        currentprice: "Current Cost of Goal",
        investibleAmtMonth: "Investible amount per month",
        investibleAmtLumsum: "Investible amount in lumpsum ",
        year: "Number of Years ",
        percentage: "Percentage of Loan",
        isRequiredGoalByName: true,
        isRequiredPercentage: true,
        goalNamePlaecHolder: "Personalise your goal by naming it ",
        currentPricePlaecHolder: "Current price of the house that you want to purchase",
        yearPlaecHolder: "Years to achieve this goal",
        loanPercentagePlaecHolder: "Percentage of the house funded by a home loan",
        amountMaxLength: 2,
        todaycost: "Today's cost",
        featurecost: "Future Cost",
        corpusLabel: "Corpus required for downpayment ",
        corpustooltip: "Downpayment you will need to make",
        investmentLabel: "Monthly Investment required ",
        investmenttooltip: " Monthly Investment required for downpaymnet",
        guagenote: "",
        areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
        accumulateText: "Accumulate"
    };
    if ($state.params.type === "vehicle")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal ",
            year: "Number of Years ",
            percentage: "Percentage of Loan",
            isRequiredGoalByName: true,
            isRequiredPercentage: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Cost of the vehicle that you want to purchase",
            yearPlaecHolder: " years to achieve this goal",
            loanPercentagePlaecHolder: "percentage of the vehicle cost will be funded by loan",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            corpustooltip: "Downpayment you will need to make",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for downpaymnet",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "contingency")
        $scope.goalLabel = {
            currentprice: "Monthly Expenses",
            year: "Contingency Fund",
            percentage: "Amount percentage",
            isRequiredGoalByName: true,
            isRequiredPercentage: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Total monthly expenses excluding avoidable lifestyle expenses ",
            yearPlaecHolder: "Months of expenses would you like to cover through a contingency fund",
            loanPercentagePlaecHolder: "Enter the amount lying in savings bank accounts",
            amountMaxLength: 2,
            lyingamount: "Savings a/c Balance",
            lyingAmountPlaecHolder: "Amount lying in savings bank accounts",
            achieveMonth: "Time to build",
            todaycost: "Monthly Expenses",
            featurecost: "Contingency corpus required",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "retirement") {
        $scope.goalLabel = {
            currentprice: "Current Monthly Expenses",
            year: "Retirement Age ",
            percentage: "Please enter the amount lying in savings bank accounts",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Current monthly expenses which will continue in retirement",
            yearPlaecHolder: " Age  you wish to retire",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Current Annual Expenses",
            featurecost: "Expenses in 1st yr of Retirement",
            corpusLabel: "Retirement Corpus Required",
            corpustooltip: "Corpus required at retirement to sustain living expenses until life expectancy",
            investmentLabel: "Monthly Investment required",
            investmenttooltip: "You could exclude the investment you are already making through other Retirement avenues (EPF, NPS, SA etc)",
            guagenote: "Goal achievement calculation does not include the investments you are already making through other Retirement avenues (EPF, NPS, SA etc)",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate a corpus of"
        };
        $scope.tenureMin = 30;
        $scope.tenureMax = 80;
        $scope.goalInfoFormData_year = 30;
    }
    if ($state.params.type === "marriage")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal",
            year: "Number of Years ",
            percentage: "",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: "Current cost of marriage",
            yearPlaecHolder: " years to achieve this goal",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "education")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal",
            year: "Number of Years ",
            percentage: "",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: " Current cost of education",
            yearPlaecHolder: "years to achieve this goal",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    if ($state.params.type === "other")
        $scope.goalLabel = {
            currentprice: "Current Cost of Goal",
            year: "Number of Years ",
            percentage: "",
            isRequiredGoalByName: true,
            isRequiredPercentage: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: " Current value of your goal",
            yearPlaecHolder: "years to achieve this goal",
            loanPercentagePlaecHolder: "Amount",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    //for crorepati
    if ($state.params.type === "crorepati")
        $scope.goalLabel = {
            currentprice: "Amount",
            year: "Number of Years ",
            isRequiredGoalByName: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            currentPricePlaecHolder: " How many crores would you like to accumulate?",
            yearPlaecHolder: "years to achieve this goal",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Accumulate"
        };
    //for Wealth Creation
    if ($state.params.type === "wealthCreation")
        $scope.goalLabel = {
            investibleAmtMonth: "Investible amount per month",
            investibleAmtLumsum: "Lumpsum amount (if any)",
            year: "Number of Years ",
            isRequiredGoalByName: true,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            investibleAmtMonthplaceholder: "Amount that can be invested per month",
            investibleAmtLumsumplaceholder: "Amount that you want to invest immediately ",
            yearPlaecHolder: "years to achieve this goal",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Monthly Investment required ",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over Fixed Deposit in a Realistic scenario : ",
            accumulateText: "Invest"
        };
    //for Tax Planing
    if ($state.params.type === "taxPlanning")
        $scope.goalLabel = {
            currentprice: "Existing claim under Sec 80C",
            currentPricePlaecHolder: " Amount that can be claimed under Section 80C",
            lyingamount: "Shortfall in Sec 80C deduction",
            investibleAmtMonth: "Investible amount per month",
            investibleAmtLumsum: "Investible amount in lumpsum ",
            year: "Number of Years ",
            isRequiredGoalByName: false,
            goalNamePlaecHolder: "Personalise your goal by naming it",
            investibleAmtMonthplaceholder: "Amount that can be invested per month",
            investibleAmtLumsumplaceholder: "Amount that you want to invest immediately ",
            yearPlaecHolder: "years to achieve this goal",
            amountMaxLength: 2,
            todaycost: "Today's cost",
            featurecost: "Future Cost",
            corpusLabel: "Corpus required for downpayment ",
            investmentLabel: "Recommended investment in Equity Linked Savings Scheme (ELSS)",
            investmenttooltip: "Monthly Investment required for goal achievement ",
            guagenote: "",
            areachartLabel: "Additional returns over PPF in a Realistic scenario : ",
            accumulateText: "Invest"
        };
    $scope.goalimagesrc = "/img/goal_" + $state.params.type + "_m.png";
    $scope.monthstoinvestmentList = ["Immediately", "2 months", "3 months", "4 months", "12 months"];
    $scope.goalInfoFormData_monthstoinvestment = "Immediately";
    $scope.modelPopupData = {status: true};

    $scope.init = function () {

    };
    $scope.submitGoalInfoForm = function () {
        var loanPercentage = 0;
        if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired()) {
            loanPercentage = $scope.percentageSliderOptions.value / 100;
        }
        if ($scope.type === "taxPlanning") {
            $scope.goalInfoFormData_goalName = "Tax Planning (" + $scope.getFinancialYear() + ")";
        }
        $scope.goalName = $scope.goalInfoFormData_goalName;
        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            type: $scope.type,
            name: $scope.goalInfoFormData_goalName,
            loanPercentage: loanPercentage,
            tenure: $scope.yearSliderOptions.value,
            currentPrice: $scope.goalInfoFormData_currentprice,
            state: "create"
        };
        if ($scope.type === "contingency") {
            var tmp = ($scope.goalInfoFormData_currentprice * $scope.monthSliderOptions.value - $scope.goalInfoFormData_lyingamount) / $scope.achieveMonthSliderOptions.value;
            if (tmp < 1000) {
                toaster.error({body: "You already have more balance in savings fund than required for contingency."});
                return;
            }
            data.contTenure = $scope.monthSliderOptions.value;
            data.tenure = $scope.achieveMonthSliderOptions.value;
            data.contSavings = $scope.goalInfoFormData_lyingamount;
        }
        if ($scope.type === "crorepati") {
            data.futurePrice = $scope.crorepatiSliderOptions.value * 10000000;
        }
        if ($scope.type === "wealthCreation") {
            data.sipRequired = $scope.goalInfoFormData_sip;
            data.lumpsumRequired = $scope.goalInfoFormData_lumpsum;
        }
        if ($scope.type === "retirement") {
            data.retirementAge = $scope.yearSliderOptions.value;
        }
        if ($scope.type === "taxPlanning") {
            if ($scope.goalInfoFormData_lyingamount < 5000) {
                toaster.error({body: "Minimum investment required in Tax Saving Mutual Fund is Five Thousand"});
                return;
            }
            data.currentPrice = (150000 - $scope.goalInfoFormData_taxcurrentprice);
        }

        $http({
            method: 'POST',
            url: window.link.create_goal,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.requestpage = false;
            $scope.responsepage = true;
            $scope.currentPrice = $scope.goalInfoFormData_currentprice;
            $scope.tenure = response.data.tenure;
            var currentDate = new Date();
            $scope.accumulatedYear = response.data.maturity;
            $scope.areaChartFeaturePrice = response.data.futurePrice;
            $scope.accumulatedAmt = response.data.futurePrice;
            if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired())
                $scope.futurePrice = Math.round(response.data.futurePrice * 100 / (100 - $scope.percentageSliderOptions.value));
            else
                $scope.futurePrice = response.data.futurePrice;

            if ($state.params.type === "retirement") {
                $scope.areaChartFeaturePrice = response.data.retCorpus;
                $scope.retCorpus = response.data.retCorpus;
                $scope.accumulatedAmt = response.data.retCorpus;
            } else {
                $scope.retCorpus = response.data.futurePrice;
            }

            $scope.monthlyInvestment = response.data.sipRequired;
            if ($scope.type === "wealthCreation") {
                $scope.lumpsumAmount = response.data.lumpsumRequired
            } else {
                $scope.lumpsumAmount = 0;
            }
            goal_id = response.data._goalid;
            $scope.chart.data.columns = [['data', 100]];
            $scope.graphResponse = response.data.graph;
            $scope.inflation = Math.round(response.data.inflation * 100);
            if ($state.params.type === "taxPlanning") {
                $scope.lumpsumAmount = response.data.lumpsumRequired;
                $scope.futurePrice = response.data.futurePrice;
                $scope.resMonthlyInvestment = response.data.sipRequired;
                $scope.currentPrice = response.data.futurePrice;
            } else {
                $scope.resMonthlyInvestment = response.data.sipRequired;
            }
            if ($scope.type === "crorepati" || $scope.type === "wealthCreation") {
                $scope.next();
            }
        }, function errorCallback(response) {
            toaster.error({body: response.data.err});
        });
    };

    $scope.next = function () {
        $scope.requestpage = false;
        $scope.responsepage = false;
        $scope.setgoalpage = true;
        var tempArry = [];
        var columns = [];
        if ($state.params.type === "taxPlanning") {
            tempArry.push("PPF");
            for (var i in $scope.graphResponse.PPF)
                tempArry.push($scope.graphResponse.PPF[i]);
            columns.push(tempArry);
            tempArry = [];
        } else {
            tempArry.push("FD");
            for (var i in $scope.graphResponse.FD)
                tempArry.push($scope.graphResponse.FD[i]);
            columns.push(tempArry);
            tempArry = [];
        }
        tempArry.push("Optimistic");
        for (var i in $scope.graphResponse.Optimist)
            tempArry.push($scope.graphResponse.Optimist[i]);
        columns.push(tempArry);
        tempArry = [];
        tempArry.push("Pessimistic");
        for (var i in $scope.graphResponse.Pessimist)
            tempArry.push($scope.graphResponse.Pessimist[i]);
        columns.push(tempArry);
        tempArry = [];
        tempArry.push("Realistic");
        for (var i in $scope.graphResponse.Real)
            tempArry.push($scope.graphResponse.Real[i]);
        columns.push(tempArry);
        var types = {};
        if ($state.params.type === "taxPlanning") {
            types = {
                "PPF": "area-spline",
                "Optimist": "area-spline",
                "Pessimist": "area-spline",
                "Real": "area-spline"
            };
        } else {
            types = {"FD": "area-spline", "Optimist": "area-spline", "Pessimist": "area-spline", "Real": "area-spline"};
        }
        var currentValue = 0;
        if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired())
            currentValue = Math.round($scope.currentPrice * (100 - $scope.percentageSliderOptions.value) / 100);
        else
            currentValue = $scope.currentPrice;
        if ($state.params.type === "taxPlanning") {
            $scope.areachart.grid.x.lines[0].value = 3;
            $scope.areachart.grid.x.lines[0].text = "Lock-in period ends";
            $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.PPF[$scope.graphResponse.PPF.length - 1];
        } else {
            $scope.areachart.grid.y.lines[0].value = $scope.areaChartFeaturePrice;
            $scope.areachart.grid.y.lines[0].text = "Future Value : " + $scope.thousandseparator($scope.areaChartFeaturePrice);
            if (($state.params.type != "retirement") && ($state.params.type != "wealthCreation") && ($state.params.type != "crorepati")) {
                $scope.areachart.grid.y.lines[1].value = currentValue;
                $scope.areachart.grid.y.lines[1].text = "Current Value : " + $scope.thousandseparator(currentValue);
            }
            $scope.areachart.grid.x.lines = [];
            $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.FD[$scope.graphResponse.FD.length - 1];
        }
        $scope.areachart.data = {columns: columns, types: types};
    };

    $scope.back = function () {
        $scope.requestpage = true;
        $scope.responsepage = false;
    };

    $scope.backtoResponsePage = function () {
        if ($scope.type === "crorepati" || $scope.type === "wealthCreation") {
            $scope.requestpage = true;
            $scope.responsepage = false;
            $scope.setgoalpage = false;
        } else {
            $scope.requestpage = false;
            $scope.responsepage = true;
            $scope.setgoalpage = false;
        }
    };

    $scope.setMyGoal = function () {
        var lumpmsumAmount = parseInt($scope.lumpsumAmount);
        var monthlyInvestment = parseInt($scope.monthlyInvestment);

        if (lumpmsumAmount <= 0 || isNaN(lumpmsumAmount)) lumpmsumAmount = 0;
        if (monthlyInvestment <= 0 || isNaN(monthlyInvestment)) monthlyInvestment = 0;

        if (!(validateAmount(lumpmsumAmount, monthlyInvestment, $scope.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpsum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }

        // if (!(validateInvestmentCategory(lumpmsumAmount, monthlyInvestment))) {
        //     toaster.error({body: "The investment in lumpsum and SIP should be in specific proportion (5:1), please make two separate investments in case the difference in significant."});
        //     return;
        // }

        if ($scope.type === "taxPlanning") {
            if (( $scope.currentPrice < (($scope.tenure * monthlyInvestment) + lumpmsumAmount))) {
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }


        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            lumpsum: $scope.lumpsumAmount,
            sip: $scope.monthlyInvestment,
            state: "save"
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $state.go("dashboards.goal_list");
        }, function errorCallback(response) {

        });
    };

    $scope.setGoalInit = function () {
        //$scope.setGoalFormData.lumpsumAmount = 0;
        //$scope.setGoalFormData.monthlyInvestment = resMonthlyInvestment;
        //$scope.resMonthlyInvestment = resMonthlyInvestment;
    };

    $scope.submitSetGoalForm = function () {
        var formObj = document.getElementById("setGoalForm");
        var lumpmsumAmount = parseInt($scope.lumpsumAmount);
        var monthlyInvestment = parseInt($scope.monthlyInvestment);

        if (lumpmsumAmount <= 0 || isNaN(lumpmsumAmount)) lumpmsumAmount = 0;
        if (monthlyInvestment <= 0 || isNaN(monthlyInvestment)) monthlyInvestment = 0;

        if (!(validateAmount(lumpmsumAmount, monthlyInvestment, $scope.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpsum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }

        // if (!(validateInvestmentCategory(lumpmsumAmount, monthlyInvestment))) {
        //     toaster.error({body: "The investment in lumpsum and SIP should be in specific proportion (5:1), please make two separate investments in case the difference in significant."});
        //     return;
        // }

        if ($scope.type === "taxPlanning") {
            if (( $scope.currentPrice < (($scope.tenure * monthlyInvestment) + lumpmsumAmount))){
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }

        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            lumpsum: $scope.lumpsumAmount,
            sip: $scope.monthlyInvestment,
            state: "cal"
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            var percentage = response.data.percentAchievable * 100;
            $scope.chart.data.columns = [['data', percentage.toFixed(2)]];
            var tempArry = [];
            var columns = [];
            if ($state.params.type === "taxPlanning") {
                tempArry.push("PPF");
                for (var i in response.data.graph.PPF)
                    tempArry.push(response.data.graph.PPF[i]);
                columns.push(tempArry);
                tempArry = [];
            } else {
                tempArry.push("FD");
                for (var i in response.data.graph.FD)
                    tempArry.push(response.data.graph.FD[i]);
                columns.push(tempArry);
                tempArry = [];
            }
            tempArry.push("Optimist");
            for (var i in response.data.graph.Optimist)
                tempArry.push(response.data.graph.Optimist[i]);
            columns.push(tempArry);
            tempArry = [];
            tempArry.push("Pessimist");
            for (var i in response.data.graph.Pessimist)
                tempArry.push(response.data.graph.Pessimist[i]);
            columns.push(tempArry);
            tempArry = [];
            tempArry.push("Real");
            for (var i in response.data.graph.Real)
                tempArry.push(response.data.graph.Real[i]);
            columns.push(tempArry);
            var types = {};
            if ($state.params.type === "taxPlanning") {
                types = {
                    "PPF": "area-spline",
                    "Optimist": "area-spline",
                    "Pessimist": "area-spline",
                    "Real": "area-spline"
                };
            } else {
                types = {
                    "FD": "area-spline",
                    "Optimist": "area-spline",
                    "Pessimist": "area-spline",
                    "Real": "area-spline"
                };
            }
            var currentValue = 0;
            if (($scope.type === "home" || $scope.type === "vehicle") && $scope.isLoanRequired())
                currentValue = Math.round($scope.currentPrice * 100 / (100 - $scope.percentageSliderOptions.value));
            else
                currentValue = $scope.currentPrice;
            if ($state.params.type === "taxPlanning") {
                $scope.areachart.grid.x.lines[0].value = 3;
                $scope.areachart.grid.x.lines[0].text = "Lock-in period ends";
                $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.PPF[$scope.graphResponse.PPF.length - 1];
            } else {
                $scope.areachart.grid.y.lines[0].value = $scope.areaChartFeaturePrice;
                $scope.areachart.grid.y.lines[0].text = "Future Value :" + $scope.thousandseparator($scope.areaChartFeaturePrice);
                if (($state.params.type != "retirement") && ($state.params.type != "wealthCreation") && ($state.params.type != "crorepati")) {
                    $scope.areachart.grid.y.lines[1].value = currentValue;
                    $scope.areachart.grid.y.lines[1].text = "Current Value : " + $scope.thousandseparator(currentValue);
                }
                $scope.areachart.grid.x.lines = [];
                $scope.FDtoRealDiff = $scope.graphResponse.Real[$scope.graphResponse.Real.length - 1] - $scope.graphResponse.FD[$scope.graphResponse.FD.length - 1];
            }
            $scope.areachart.data = {columns: columns, types: types};
        }, function errorCallback(response) {

        });
    };

    //Chart code
    $scope.dynamicChartId = 'chart';
    $scope.chartType = {};

    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };

    $scope.chart = {
        data: {
            type: 'gauge',
            columns: [['data', 100]],
            onclick: function (d, i) {
                console.log("onclick", d, i);
            }
        },
        gauge: {
            label: {
                format: function (value, ratio) {
                    return value;
                },
                show: true // to turn off the min/max labels.
            },
            min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            max: 100, // 100 is default
            units: ' %   Goal achievable',
            width: 39 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return value + " % of goal achievable";
                }
            }
        },
    };
    //Area chart
    $scope.areaChartId = 'areachart';
    $scope.areachart = {
        data: {
            columns: [
                ['FD', 73877, 152592, 236462, 325824, 421038],
                ['Real', 74783, 156581, 246052, 343916, 450961],
                ['Optimist', 75566, 160085, 254618, 360352, 478614],
                ['Pessimist', 74010, 153173, 237848, 328419, 425296]
            ],
            types: {
                FD: 'area-spline',
                Real: 'area-spline',
                Optimist: 'area-spline',
                Pessimist: 'area-spline'
            }
        },
        size: {
            height: 380,
            width: 800
        },
        color: {
            pattern: ['#0000ff', '#008000', '#ff0000', '#ffa500']
        },
        legend: {
            position: 'right'
        },
        grid: {
            y: {
                lines: [
                    {value: 0, text: '', position: 'start'},
                    {value: 0, text: '', position: 'start'}
                ]
            },
            x: {
                lines: [
                    {value: 0, text: '', position: 'middle'}
                ]
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return $scope.thousandseparator(value);
                }
            }
        }
    };
    $scope.isLoanRequired = function () {
        var status = false;
        if ($scope.isLoanPercentRequired === "yes") {
            status = true;
        }
        if ($scope.isLoanPercentRequired === "no") {
            $scope.percentateFrom = 1;
        }
        return status;
    };
    $scope.isLoanCheckRequired = function () {
        var status = false;
        if ($scope.goalLabel.isRequiredPercentage && ($state.params.type === "vehicle" || $state.params.type === "home")) {
            status = true;
        }
        return status;
    };
    $scope.$watch('goalInfoFormData_currentprice', function (val) {
        if (val && val > 0) {
            $scope.currentpriceinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.currentpriceinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_crorepaticurrentprice', function (val) {
        if (val && val > 0) {
            $scope.currentpriceinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.currentpriceinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_taxcurrentprice', function (val) {
        if (val && val > 0) {
            $scope.taxcurrentpriceinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.taxcurrentpriceinwords = "";
        }
        $scope.goalInfoFormData_lyingamount = 150000 - val;
    });
    $scope.$watch('lumpsumAmount', function (val) {
        if (val && val > 0) {
            $scope.lumpsumAmountinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.lumpsumAmountinwords = "";
        }
    });
    $scope.$watch('monthlyInvestment', function (val) {
        if (val && val > 0) {
            $scope.monthlyInvestmentinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.monthlyInvestmentinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_lyingamount', function (val) {
        if (val && val > 0) {
            $scope.lyingamountinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.lyingamountinwords = "";
        }
    });

    $scope.$watch('goalInfoFormData_sip', function (val) {
        if (val && val > 0) {
            $scope.investibleamntinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.investibleamntinwords = "";
        }
    });
    $scope.$watch('goalInfoFormData_lumpsum', function (val) {
        if (val && val > 0) {
            $scope.investibleamntlumpinwords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.investibleamntlumpinwords = "";
        }
    });
    $scope.thousandseparator = thousandSeparator.thousandSeparator;

    $scope.converttoWords = convertDigitsIntoWords.inWords;

    /*$scope.yearSliderOptions = {
     min: $scope.tenureMin,
     max: $scope.tenureMax,
     from: 1,
     postfix: " year",
     prettify: false,
     hasGrid: true,
     onChange: function(data){
     $scope.goalInfoFormData_year = data.fromNumber;
     }
     };*/
    $scope.yearSliderOptions = {
        value: $scope.goalInfoFormData_year,
        options: {
            floor: $scope.tenureMin,
            ceil: $scope.tenureMax,
            step: 1,
            minLimit: $scope.tenureMin,
            maxLimit: $scope.tenureMax,
            showTicks: 10,
            showTicksValues: true,
        }
    };
    /*$scope.percentageSliderOptions = {
     min: 0,
     max: 100,
     from: $scope.percentateFrom,
     postfix: " %",
     prettify: false,
     hasGrid: true,
     onChange: function(data){
     $scope.goalInfoFormData_loan = data.fromNumber;
     }
     };*/
    $scope.percentageSliderOptions = {
        value: 1,
        options: {
            floor: 0,
            ceil: 100,
            step: 1,
            minLimit: 1,
            maxLimit: 99,
            showTicks: 10,
            showTicksValues: true,
        }
    };
    $scope.monthSliderOptions = {
        value: 6,
        options: {
            floor: 3,
            ceil: 12,
            step: 1,
            minLimit: 1,
            maxLimit: 12,
            translate: function (value) {
                return value + ' months'
            },
            showTicks: 3,
            ticksTooltip: function (v) {
                return 'A fund created to meet any emergency needs. Fund can be equal to 3 to 12 months expenses. Select how many months of expenses would you like to provide for as contingency fund.';
            }
        }
    };
    $scope.achieveMonthSliderOptions = {
        value: 12,
        options: {
            floor: 6,
            ceil: 36,
            step: 1,
            translate: function (value) {
                return value + ' months'
            },
            minLimit: 6,
            maxLimit: 36,
            showTicks: 6,
            ticksTooltip: function (v) {
                return 'Select the number of months over which you would like to build your contingency fund.';
            }
        }
    };
    $scope.crorepatiSliderOptions = {
        value: 0.5,
        options: {
            floor: 0,
            ceil: 50,
            step: 0.5,
            translate: function (value) {
                return value + ' crore'
            },
            showTicks: 8,
            precision: 1
        }
    };

    $scope.isCorpusRequired = function () {
        var status = false;
        if ($scope.isLoanPercentRequired === "yes" || $state.params.type === "retirement") {
            status = true;
        }
        return status;
    };

    $scope.getCurrentPrice = function (currentPrice) {
        if ($state.params.type === "retirement") {
            currentPrice = currentPrice * 12;
        }
        return $scope.thousandseparator(currentPrice);
    };
    $scope.isContingency = function () {
        return ($state.params.type === "contingency");
    };
    // $scope.isWealthCreation = function(){
    //     return ($state.params.type === "wealthCreation");
    // };
    if ($state.params.pagestatus === "fromdashboard") {
        var goalData = goalData.getGoalData();
        $scope.requestpage = false;
        $scope.responsepage = false;
        $scope.setgoalpage = true;
        $scope.currentPrice = goalData.currentPrice;
        $scope.tenure = goalData.tenure;
        var currentDate = new Date();
        $scope.accumulatedYear = goalData.maturity;
        $scope.accumulatedAmt = goalData.futurePrice;
        $scope.areaChartFeaturePrice = goalData.futurePrice;
        if (($scope.type === "home" || $scope.type === "vehicle"))
            $scope.futurePrice = Math.round(goalData.futurePrice * 100 / (100 - 15));
        else
            $scope.futurePrice = goalData.futurePrice;
        if ($scope.type === "crorepati") {
            $scope.responsepage = false;
            $scope.setgoalpage = true;
        }
        if ($scope.type === "wealthCreation") {
            $scope.responsepage = false;
            $scope.setgoalpage = true;
        }
        if ($state.params.type === "retirement") {
            $scope.areaChartFeaturePrice = goalData.retCorpus;
            $scope.retCorpus = goalData.retCorpus;
            $scope.accumulatedAmt = goalData.retCorpus;
        } else {
            $scope.retCorpus = goalData.futurePrice;
        }
        if ($state.params.type === "taxPlanning") {
            $scope.lumpsumAmount = goalData.lumpsum;
            $scope.futurePrice = goalData.lumpsum;
            $scope.resMonthlyInvestment = goalData.lumpsum;
        } else {
            $scope.resMonthlyInvestment = goalData.sipRequired;
        }
        $scope.monthlyInvestment = goalData.sip;
        $scope.lumpsumAmount = goalData.lumpsum;
        goal_id = goalData._goalid;
        $scope.chart.data.columns = [['data', Math.round(goalData.percentAchievable * 100)]];
        $scope.graphResponse = goalData.graph;
        $scope.inflation = Math.round(goalData.inflation * 100);
        $scope.next();
    }

    $scope.taxCalculation = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/modal_tax_planing.html',
            controller: taxPlaningModelController,
            windowClass: "animated fadeIn",
            scope: $scope
        });
        var test = 90;
    };
    $rootScope.$on('taxPlaningTotal', function (event, data) {
        $scope.modelPopupData = data;
        if (data.Total > 0) {
            $scope.goalInfoFormData_taxcurrentprice = data.Total;
            $scope.goalInfoFormData_lyingamount = 150000 - data.Total;
        }
    });

    $scope.currentCostRequired = function () {
        var status = true;
        if ($scope.type === "taxPlanning" || $scope.type === "crorepati" || $scope.type === "wealthCreation") {
            status = false;
        }
        return status;
    };

    $scope.getFinancialYear = function() {
        return currentFinancialYear();
     }

}
angular.module('finatwork').controller('goalInfo', ['$scope', '$state', '$http', '$window', 'c3ChartService', 'convertDigitsIntoWords', 'thousandSeparator', 'goalData', '$uibModal', '$rootScope', 'toaster', goalInfo]);

function taxPlaningModelController($scope, $uibModalInstance) {
    $scope.ok = function () {
        $scope.modelPopupData.EPF = ($scope.EPF) ? $scope.EPF : 0;
        $scope.modelPopupData.VPF = ($scope.VPF) ? $scope.VPF : 0;
        $scope.modelPopupData.LIC = ($scope.LIC) ? $scope.LIC : 0;
        $scope.modelPopupData.PPF = ($scope.PPF) ? $scope.PPF : 0;
        $scope.modelPopupData.HLP = ($scope.HLP) ? $scope.HLP : 0;
        $scope.modelPopupData.QBD = ($scope.QBD) ? $scope.QBD : 0;
        $scope.modelPopupData.SSS = ($scope.SSS) ? $scope.SSS : 0;
        $scope.modelPopupData.CTF = ($scope.CTF) ? $scope.CTF : 0;
        $scope.modelPopupData.OTI = ($scope.OTI) ? $scope.OTI : 0;
        $scope.modelPopupData.Total = $scope.Total;
        $scope.$emit('taxPlaningTotal', $scope.modelPopupData);
        $uibModalInstance.close();
    };
    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
    if ($scope.modelPopupData.status) {
        $scope.modelPopupData.status = false;
    } else {
        $scope.EPF = ($scope.modelPopupData.EPF > 0) ? $scope.modelPopupData.EPF : '';
        $scope.VPF = ($scope.modelPopupData.VPF > 0) ? $scope.modelPopupData.VPF : '';
        $scope.LIC = ($scope.modelPopupData.LIC > 0) ? $scope.modelPopupData.LIC : '';
        $scope.PPF = ($scope.modelPopupData.PPF > 0) ? $scope.modelPopupData.PPF : '';
        $scope.HLP = ($scope.modelPopupData.HLP > 0) ? $scope.modelPopupData.HLP : '';
        $scope.QBD = ($scope.modelPopupData.QBD > 0) ? $scope.modelPopupData.QBD : '';
        $scope.SSS = ($scope.modelPopupData.SSS > 0) ? $scope.modelPopupData.SSS : '';
        $scope.CTF = ($scope.modelPopupData.CTF > 0) ? $scope.modelPopupData.CTF : '';
        $scope.OTI = ($scope.modelPopupData.OTI > 0) ? $scope.modelPopupData.OTI : '';
    }
    $scope.$watch('EPF', function (val) {
        setTotal();
    });
    $scope.$watch('VPF', function (val) {
        setTotal();
    });
    $scope.$watch('LIC', function (val) {
        setTotal();
    });
    $scope.$watch('PPF', function (val) {
        setTotal();
    });
    $scope.$watch('HLP', function (val) {
        setTotal();
    });
    $scope.$watch('QBD', function (val) {
        setTotal();
    });
    $scope.$watch('SSS', function (val) {
        setTotal();
    });
    $scope.$watch('CTF', function (val) {
        setTotal();
    });
    $scope.$watch('OTI', function (val) {
        setTotal();
    });
    function setTotal() {
        $scope.Total = (($scope.EPF) ? $scope.EPF : 0) + (($scope.VPF) ? $scope.VPF : 0) + (($scope.LIC) ? $scope.LIC : 0) + (($scope.PPF) ? $scope.PPF : 0) +
            (($scope.HLP) ? $scope.HLP : 0) + (($scope.QBD) ? $scope.QBD : 0) + (($scope.SSS) ? $scope.SSS : 0) + (($scope.CTF) ? $scope.CTF : 0) + (($scope.OTI) ? $scope.OTI : 0);
    }
}
angular.module('finatwork').controller('taxPlaningModelController', taxPlaningModelController);
function goallistcontroller($scope, $state, $http, toaster, fundData) {
    $scope.disabled = function () {
        return true;
    };
    $scope.formStatus = false;

    $scope.goalsDisplayName = {
        "home": "Home",
        "vehicle": "Vehicle",
        "education": "Education",
        "retirement": "Retirement",
        "marriage": "Marriage",
        "contingency": "Contingency",
        "taxPlanning": "Tax Planning",
        "crorepati": "Crorepati",
        "wealthCreation": "Wealth Creation",
        "other": "Other"
    };

    $scope.init = function () {
        formStatus();
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=inactive&view=goal&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            response.data.forEach(function (goal) {
                goal.name = goal.name || $scope.goalsDisplayName[goal.type];
            });
            $scope.goallists = response.data;
        }, function errorCallback(response) {

        });
    };

    $scope.delete = function (index) {
        var goal_id = $scope.goallists[index]._goalid;
        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId()
        };

        $http({
            method: 'DELETE',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.goallists.splice(index, 1);
        }, function errorCallback(response) {
            //toaster.error({body: response.data.error.message});
        });
    };

    $scope.isEditable = function (index) {
        $scope.goallists[index].isEditable = !$scope.goallists[index].isEditable;
        $scope.goallists[index].isLumpsumEditable = !$scope.goallists[index].isLumpsumEditable;
        $scope.goallists[index].isSIPEditable = !$scope.goallists[index].isSIPEditable;
        return $scope.goallists[index].isEditable;
    };

    $scope.Submit = function () {
        var data = {};
        angular.forEach($scope.goallists, function (goal) {
            if (goal.isUpdated) {
                data = {
                    _userid:getUserId(),
                    _goalid:goal._goalid,
                    state: "set"
                };
            }
        });

        if (!data.state) {
            toaster.error({body: "Please select a goal would you like to commit"});
            return;
        }

        if ($scope.formStatus) {
            $http({
                method: 'POST',
                url: window.link.create_goal,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                fundData.setFundData(response.data);
                $state.go("dashboards.fund_list");
            }, function errorCallback(response) {
                toaster.error({body: 'We build a personalized portfolio for an investment more than threshold limit (lumpsum: 10 lakhs, SIP: 1.5 lakhs/month), our advisor will help you construct the same'});
            });
        } else {
            $state.go("forms.wizard.personal-info");
        }
    };

    $scope.updateGoal = function (index) {
        var goal_id = $scope.goallists[index]._goalid;

        var lumpmsumAmount = parseInt($scope.goallists[index].lumpsum);
        var monthlyInvestment = parseInt($scope.goallists[index].sip);
        var type = $scope.goallists[index].type;

        if (lumpmsumAmount <= 0 || isNaN(lumpmsumAmount)) lumpmsumAmount = 0;
        if (monthlyInvestment <= 0 || isNaN(monthlyInvestment)) monthlyInvestment = 0;

        if (!validateAmount(lumpmsumAmount, monthlyInvestment, type)) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpsum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            $scope.goallists[index].lumpsum = 0;
            $scope.goallists[index].sip = 0;
            $scope.goallists[index].isEditable = false;
            $scope.goallists[index].isLumpsumEditable = false;
            $scope.goallists[index].isSIPEditable = false;

            return;
        }

        if (type === "taxPlanning") {
            if(($scope.goallists[index].tenure * monthlyInvestment + lumpmsumAmount) > $scope.goallists[index].currentPrice){
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                $scope.goallists[index].lumpsum = 0;
                $scope.goallists[index].sip = 0;
                $scope.goallists[index].isEditable = false;
                $scope.goallists[index].isLumpsumEditable = false;
                $scope.goallists[index].isSIPEditable = false;
                return;
            }
        }

        var data = {
            token: window.localStorage.getItem("token"),
            _userid: getUserId(),
            lumpsum: (isNaN(parseInt($scope.goallists[index].lumpsum))) ? 0 : parseInt($scope.goallists[index].lumpsum),
            sip: (isNaN(parseInt($scope.goallists[index].sip))) ? 0 : parseInt($scope.goallists[index].sip),
            state: "cal"
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + goal_id,
            data: $.param(data),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            $scope.goallists[index].percentAchievable = response.data.percentAchievable;
        }, function errorCallback(response) {
            //toaster.error({body: response.data.err.message});
        });

        $scope.goallists[index].isEditable = !$scope.goallists[index].isEditable;
        $scope.goallists[index].isLumpsumEditable = !$scope.goallists[index].isLumpsumEditable;
        $scope.goallists[index].isSIPEditable = !$scope.goallists[index].isSIPEditable;
        return $scope.goallists[index].isEditable;
    };

    $scope.getPercentage = function (percentage) {
        return Math.round(percentage * 100);
    };

    $scope.addNewGoal = function () {
        $state.go("dashboards.goals_home");
    };

    $scope.updateSelection = function (position, goallists) {
        angular.forEach(goallists, function (goallist, index) {
            if (position != index)
                goallist.isUpdated = false;
        });
    };

    function formStatus() {
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
                $scope.formStatus = isActive;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').factory('fundData', function () {
    var service = {};
    var _data = {};

    service.setFundData = function (data) {
        _data = data;
    };
    service.getFundData = function () {
        return _data;
    };
    return service;
});
angular.module('finatwork').controller('goallistcontroller', goallistcontroller);
/*** Created by Nilabh on 29-06-2017. goalTopUpController*/
function goalTopUpController($scope, $state, $http, c3ChartService, convertDigitsIntoWords, thousandSeparator, toaster, goalData, fundData) {
    $scope.goalData = goalData.getGoalData();
    $scope.monthlyTopUp = $scope.goalData.sipRequiredTopUp;
    $scope.goalData.marketValue = Math.round( $scope.goalData.marketValue);
    $scope.accumulatedAmt = $scope.goalData.futurePrice;
    $scope.goalimagesrc = "/img/goal_" + $scope.goalData.type + "_m.png";
    $scope.thousandseparator = thousandSeparator.thousandSeparator;
    $scope.FDtoRealDiff = 0;
    $scope.areaChartFuturePrice = $scope.goalData.type === 'retirement' ? $scope.goalData.retCorpus:$scope.goalData.futurePrice;
    $scope.balanceYear = Math.floor(($scope.goalData.balMonths)/12);
    $scope.balanceMonth =($scope.goalData.balMonths)%12;
    $scope.monthlyTopUp = $scope.goalData.sipRequiredTopUp <= 0 ? 0:$scope.monthlyTopUp

    //Gauge
    $scope.dynamicChartId = 'chart';
    $scope.chartType = {};
    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };
    $scope.chart = {
        data: {
            type: 'gauge',
            columns: [['data', Math.round($scope.goalData.percentAchievable * 100)]],
            onclick: function (d, i) {//TODO check if it can be removed
                console.log("onclick", d, i);
            }
        },
        gauge: {
            label: {
                format: function (value, ratio) {
                    return value;
                },
                show: true // to turn off the min/max labels.
            },
            min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            max: 100, // 100 is default
            units: ' %   Goal achievable',
            width: 39 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return value + " % of goal achievable";
                }
            }
        }
    };

    $scope.topUpDynamicChartID = 'topUpChart';
    $scope.topUpchartType = {};
    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.topUpchartType[serie], serie);
    };
    $scope.topUpchart = {
        data: {
            type: 'gauge',
            columns: [['data', 100]],//check and change later
            onclick: function (d, i) {
                console.log("onclick", d, i);
            }
        },
        gauge: {
            label: {
                format: function (value, ratio) {
                    return value;
                },
                show: true // to turn off the min/max labels.
            },
            min: 0, // 0 is default, //can handle negative min e.g. vacuum / voltage / current flow / rate of change
            max: 100, // 100 is default
            units: ' %   Goal achievable',
            width: 39 // for adjusting arc thickness
        },
        color: {
            pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'], // the three color levels for the percentage values.
            threshold: {
                values: [30, 60, 90, 100]
            }
        },
        size: {
            height: 180
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return value + " % of goal achievable";
                }
            }
        }
    };
    //Area chart
    $scope.areaChartId = 'areaChart';
    $scope.areaChart = {
        data: {
            columns: [
                ['FD', 73877, 152592, 236462, 325824, 421038],
                ['Real', 74783, 156581, 246052, 343916, 450961],
                ['Optimist', 75566, 160085, 254618, 360352, 478614],
                ['Pessimist', 74010, 153173, 237848, 328419, 425296]
            ],
            types: {
                FD: 'area-spline',
                Real: 'area-spline',
                Optimist: 'area-spline',
                Pessimist: 'area-spline'
            }
        },
        size: {
            height: 380,
            width: 800
        },
        color: {
            pattern: ['#0000ff', '#008000', '#ff0000', '#ffa500']
        },
        legend: {
            position: 'right'
        },
        grid: {
            y: {
                lines: [
                    {value: 0, text: '', position: 'start'},
                    {value: 0, text: '', position: 'start'}
                ]
            },
            x: {
                lines: [
                    {value: 0, text: '', position: 'middle'}
                ]
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return $scope.thousandseparator(value);
                }
            }
        }
    };

    $scope.init = function () {
        poplulateAreaChart($scope.goalData.graph);
        switch ($scope.goalData.type) {
            case 'retirement':
                $scope.accumulateText = "Accumulate a corpus of";
                $scope.accumulatedAmt = $scope.goalData.retCorpus;
                $scope.areachartLabel = "Additional returns over PPF in a Realistic scenario : ";
                break;
            case 'taxPlanning':
                $scope.accumulateText = "Invest";
                break;
            default:
                $scope.accumulateText = 'Accumulate';
                $scope.areachartLabel = "Additional returns over PPF in a Realistic scenario : ";

        }
    };

    $scope.visualizeGoalTopUp = function () {
        var topUpLumpSum = parseInt($scope.lumpSumTopUp);
        var topUpSIP = parseInt($scope.monthlyTopUp);

        if (topUpLumpSum <= 0 || isNaN(topUpLumpSum)) topUpLumpSum = 0;
        if (topUpSIP <= 0 || isNaN(topUpSIP)) topUpSIP = 0;

        if (!(validateAmount(topUpLumpSum, topUpSIP, $scope.goalData.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpSum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }
        if ($scope.goalData.type === "taxPlanning") {
            if (( $scope.goalData.currentPrice < (($scope.goalData.tenure *$scope.monthlyTopUp) +$scope.lumpSumTopUp))) {
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }
        var data = {
            _userid: getUserId(),
            _goalid: $scope.goalData._goalid,
            state: 'calTopUp',
            lumpsumTopUp: topUpLumpSum,
            sipTopUp: topUpSIP
        };
        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + data._goalid,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var percentage = response.data.percentAchievableTopUp * 100;
            $scope.topUpchart.data.columns = [['data', Math.round(percentage.toFixed(2))]];
            poplulateAreaChart(response.data.graph);
          }, function errorCallback(response) {
            console.log(response);
        });
    };

    //Next screen view
    $scope.setGoalTopUp = function () {

        var topUpLumpSum = parseInt($scope.lumpSumTopUp);
        var topUpSIP = parseInt($scope.monthlyTopUp);

        if (topUpLumpSum <= 0 || isNaN(topUpLumpSum)) topUpLumpSum = 0;
        if (topUpSIP <= 0 || isNaN(topUpSIP)) topUpSIP = 0;

        if (!(validateAmount(topUpLumpSum, topUpSIP, $scope.goalData.type))) {
            toaster.error({body: "Minimum monthly is Rs 1000 and minimum lumpSum is Rs 5000. You can leave any one, but not both, of the fields as nil."});
            return;
        }
        if ($scope.goalData.type === "taxPlanning") {
            if (( $scope.goalData.currentPrice < (($scope.goalData.tenure *$scope.monthlyTopUp) +$scope.lumpSumTopUp))) {
                toaster.error({body: "There is no additional tax benefit of investing more than the shortfall under 80C. Investment in ELSS have a lock-in of three years, suggest you invest the balance amount in another goal."});
                return;
            }
        }

        var data = {
            _userid: getUserId(),
            _goalid: $scope.goalData._goalid,
            state: 'setTopUp',
            lumpsumTopUp: topUpLumpSum,
            sipTopUp: topUpSIP
        };

        $http({
            method: 'POST',
            url: window.link.create_goal + '/' + data._goalid,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            fundData.setFundData(response.data);
            $state.go("dashboards.fund_list");
        }, function errorCallback(response) {
            console.log(response);
        });
    };

    $scope.$watch('lumpSumTopUp', function (val) {
        if (val && val > 0) {
            $scope.lumsumTopUpInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.lumsumTopUpInWords = "";
        }
    });
    $scope.$watch('monthlyTopUp', function (val) {
        if (val && val > 0) {
            $scope.sipTopUpInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.sipTopUpInWords = "";
        }
    });

    function poplulateAreaChart(graph){
          var tmpArray = [];
            var columns = [];
            if ($scope.goalData.type === "taxPlanning") {
                tmpArray.push("PPF");
                graph.PPF.forEach(function (elem) {
                    tmpArray.push(elem);
                });
                columns.push(tmpArray);
                tmpArray = [];
            } else {
                tmpArray.push("FD");
                graph.FD.forEach(function (elem) {
                    tmpArray.push(elem);
                });
                columns.push(tmpArray);
                tmpArray = [];
            }
            tmpArray.push("Optimist");
            graph.Optimist.forEach(function (elem) {
                tmpArray.push(elem);
            });
            columns.push(tmpArray);
            tmpArray = [];
            tmpArray.push("Pessimist");
            graph.Pessimist.forEach(function (elem) {
                tmpArray.push(elem);
            });
            columns.push(tmpArray);
            tmpArray = [];
            tmpArray.push("Real");
            graph.Real.forEach(function (elem) {
                tmpArray.push(elem);
            });
            columns.push(tmpArray);
            var types = {};
            if ($scope.goalData.type === "taxPlanning") {
                types = {
                    "PPF": "area-spline",
                    "Optimist": "area-spline",
                    "Pessimist": "area-spline",
                    "Real": "area-spline"
                };
            } else {
                types = {
                    "FD": "area-spline",
                    "Optimist": "area-spline",
                    "Pessimist": "area-spline",
                    "Real": "`area-spline"
                };
            }
            if ($scope.goalData.type === "taxPlanning") {//TODO need to revist for tax planning
                $scope.areaChart.grid.x.lines[0].value = 3;
                $scope.areaChart.grid.x.lines[0].text = "Lock-in period ends";
                $scope.FDtoRealDiff = graph.Real[graph.length - 1] - graph.PPF[graph.PPF.length - 1];
            } else {
                $scope.areaChart.grid.y.lines[0].value = $scope.areaChartFuturePrice;
                $scope.areaChart.grid.y.lines[0].text = "Future Value :" + $scope.thousandseparator($scope.areaChartFuturePrice);
                if ($scope.goalData.type != "retirement" && $scope.goalData.type != "crorepati") {
                    $scope.areaChart.grid.y.lines[1].value = $scope.goalData.currentPrice;
                    $scope.areaChart.grid.y.lines[1].text = "Current Value : " + $scope.thousandseparator($scope.goalData.currentPrice);
                }
                $scope.areaChart.grid.x.lines = [];
                $scope.FDtoRealDiff = graph.Real[graph.Real.length - 1] - graph.FD[graph.FD.length - 1];
            }
            $scope.areaChart.data = {columns: columns, types: types};
    }
}
angular.module('finatwork').controller('goalTopUpController', goalTopUpController);


function fundlistcontroller($scope, $state, $http, $window, fundData, c3ChartService, $q) {
    var chartData = [];
    $scope.lumpSumAvailable = false;
    $scope.sipAvailable = false;
    var schemeAllocation = [];
    $scope.getCategoryName = function (_id) {
        var name = "";
        switch (_id) {
            case "EquityLarge":
                name = "Equity - LargeCap";
                break;
            case "EquityMid":
                name = "Equity - MidCap";
                break;
            case "DebtShort":
                name = "Debt - ShortTerm";
                break;
            case "DebtLong":
                name = "Debt - LongTerm";
                break;
            case "Gold":
                name = "Gold/International";
                break;
            case "Liquid":
                name = "Liquid";
                break;
            case "ELSS":
                name = "TaxSaving (ELSS)";
                break;
            case "Hybrid":
                name = "Hybrid";
                break;

        }
        return name;
    };
    $scope.getFundName = function (_id) {
        for (var j = 0; j < schemeAllocation.length; j++) {
            if (_id === schemeAllocation[j].schemeId)
                return schemeAllocation[j].scheme;
        }
    };
    var loadSchemeAllocation = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.fundnamelist
        }).then(function successCallback(response) {
            schemeAllocation = response.data;
            $scope.goal = fundData.getFundData();//TODO fundAll shouldn't be an array
            var sipArray = [], lumpSumArray = [];
            $scope.goal.funds.forEach(function (fund) {
                fund.schemename = $scope.getFundName(fund._schemeId);
                if (fund.lumpsum) {
                    $scope.lumpSumAvailable = true;
                    lumpSumArray.push(fund);
                }
                if (fund.sip) {
                    $scope.sipAvailable = true;
                    sipArray.push(fund);
                }
            });
            $scope.goal.lumpSumAvailable = $scope.lumpSumAvailable;
            $scope.goal.sipAvailable = $scope.sipAvailable;
            $scope.goal.sipArray = sipArray;
            $scope.goal.lumpSumArray = lumpSumArray;

            if($scope.goal.sipTopUp){
                if($scope.goal.sipCycle && $scope.goal.sipStartDate){
                    $scope.showSIPOptions = false;
                } else {
                    $scope.showSIPOptions = true;
                }
            } else {
                $scope.showSIPOptions = $scope.sipAvailable;
            }
        }, function errorCallback(response) {

        });
    };
    $scope.dynamicChartId = 'pie-plot1-chart';
    $scope.dynamicSIPChartId = 'pie-sip-chart';
    $scope.chartType = {};
    $scope.funds = [];
    $scope.data = {
        columns: chartData,
        type: 'pie'
    };
    $scope.init = function () {
        $scope.sipOptions = {
            sipCycle: '',
            firstSipDate: "firstPref"
        };
        loadSchemeAllocation();
        getACHDetails();
    };
    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };

    $scope.sipCycleChange = function (val) {
        var fromDate = getSIPStartDates(val, $scope.ACH_Status);
        $scope.firstPref = fromDate.firstPref.format('DD-MMM-YYYY');
        $scope.secondPref = fromDate.secondPref.format('DD-MMM-YYYY');
    };
    $scope.executeGoals = function (goalId) {

        var data = {
            _userid: getUserId(),
            state: $scope.goal.state === 'save'?'execute':'executeTopUp'
        };
        if ($scope.sipOptions.sipCycle) {
            data.fromDate = $scope.sipOptions.firstSipDate === "firstPref" ? $scope.firstPref : $scope.secondPref;
            data.sipCycle = $scope.sipOptions.sipCycle;
        }
        $http({
            method: 'POST',
            url: window.link.create_goal + "/" + goalId,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var isSipAvailable = false;
            response.data.forEach(function (fund) {
                if (fund.hasOwnProperty('sip') && fund.sip > 0) isSipAvailable = true;
            });
            $state.go("dashboards.nschandover", {sip: isSipAvailable, lumpsum: true});
        }, function errorCallback(response) {
            $state.go("dashboards.transaction-view");
        });
    };

    $scope.getTotal = function (array, key) {
        var total = 0;
        for (var i = 0; i < array.length; i++) {
            var product = array[i];
            total += product[key];
        }
        return total;
    };
    function getACHDetails() {
        $http({
            method: 'GET',
            url: window.link.bank + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data !== null) {
                $scope.ACH_Status = response.data.umrn ? true : false;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}

angular.module('finatwork').controller('fundlistcontroller', ['$scope', '$state', '$http', '$window', 'fundData', 'c3ChartService', fundlistcontroller]);

/**
 * kycFatca - Controller for kyc fatca Form
 */
function kycFatca($scope, $http, toaster, $state, formEditService, Scopes) {
    //Scopes.store('kycFatca', $scope);
    $scope.formStatus = false;
    $scope.formEditStatus = false;
    $scope.submitText = "Save";
    $scope.init = function () {
        if (!IsAdmin()) fourmStatus();
        $scope.occupationList = [];
        $scope.incomeList = [];
        $scope.pepList = [];
        $scope.sourceOfWealthList = [];
        $scope.identificationTypeList = [];
        $scope.countriesList = [];
        var optionCity = {
            types: ['(cities)']
        };
        $scope.kycFatcaFormData = {};
        loadIncomeList();
        loadpepList();
        loadSourceOfWealthList();
        loadIdentificationTypeList();
        loadCountriesList();
        var birth = document.getElementById('birthlocation');
        new google.maps.places.Autocomplete(birth, optionCity);
        $scope.otherTaxResidency = false;
        $scope.kycFatcaFormData.tax_residency_other = false;
        $scope.kycFatcaFormData.country_tax_residency1 = "IN";
        $scope.kycFatcaFormData.id1_type = "C";
        getDefaultValue();
    };
    var loadIncomeList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.income,
        }).then(function successCallback(response) {
            $scope.incomeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var loadpepList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.pep,
        }).then(function successCallback(response) {
            $scope.pepList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var loadSourceOfWealthList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.wealth_src,
        }).then(function successCallback(response) {
            $scope.sourceOfWealthList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var explodeLocation = function (location) {
        var locationArray = location.split(', ');
        return {
            city: locationArray[0],
            state: locationArray.length == 3 ? locationArray[1] : locationArray[0],
            country: locationArray.length == 3 ? locationArray[2] : locationArray.length == 2 ? locationArray[1] : locationArray[0]
        };
    };
    var loadIdentificationTypeList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.tax_payer_identityno,
        }).then(function successCallback(response) {
            $scope.identificationTypeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var loadCountriesList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.countries,
        }).then(function successCallback(response) {
            $scope.countriesList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.submitkycFatcaForm = function () {
        if ($scope.formStatus) {
            $state.go('forms.wizard.service_request');
        } else {
            var formObj = document.getElementById("kycFatcaForm");
            $scope.kycFatcaFormData.location = formObj.location.value;
            $scope.kycFatcaFormData = angular.extend($scope.kycFatcaFormData,
                explodeLocation($scope.kycFatcaFormData.location));

            if(!$scope.otherTaxResidency) {
                $scope.kycFatcaFormData.country_tax_residency1 = "IN";
                $scope.kycFatcaFormData.tax_payer_identityno1 = $scope.kycFatcaFormData.tax_payer_identityno1 || $scope.PAN;//from personal Info
                $scope.kycFatcaFormData.id1_type = "C";
            }

            var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
            var data =
                {
                    _userid: userId,
                    KYC: {
                        income: $scope.kycFatcaFormData.income,
                        pep: $scope.kycFatcaFormData.pep,
                        wealth_src: $scope.kycFatcaFormData.wealth_src,
                        aadhaar: $scope.kycFatcaFormData.aadhaar
                    },
                    FATCA: {
                        addr_type: 1, //$scope.kycFatcaFormData.addr_type,
                        birth_country: $scope.kycFatcaFormData.country,
                        birth_place: $scope.kycFatcaFormData.city,
                        tax_residency_other: $scope.kycFatcaFormData.tax_residency_other,
                        country_tax_residency1: $scope.kycFatcaFormData.country_tax_residency1,
                        tax_payer_identityno1: $scope.kycFatcaFormData.tax_payer_identityno1,
                        id1_type: $scope.kycFatcaFormData.id1_type
                    }
                };
            var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
            var url = window.link.kycFatca;
            if ($scope.formEditStatus || IsAdmin()) {
                url = window.link.kycFatca + "/" + userId;
            }
            $http({
                method: 'POST',
                url: url,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                toaster.success("Saved");
                if (!$scope.formEditStatus) {
                    var isFormEdit = {
                        personal: false,
                        bank: false,
                        nominee: false,
                        kyc: false,
                        docs: false,
                        service: true
                    };
                    formEditService.setIsEditable(isFormEdit);
                    Scopes.get('formWizardCtrl').isFormEdit.docs = false;
                }
                $state.go("forms.wizard.file_upload");//
            }, function errorCallback(response) {
                toaster.error({body: response.data.reason});

            });
        }
    };

    $scope.$watch("kycFatcaFormData.tax_residency_other", function (newValue, oldValue) {
        if (newValue === '0') {/*Indian*/
            $scope.otherTaxResidency = false;
        } else if (newValue === '1') {/*Other*/
            $scope.otherTaxResidency = true;
        }
    });

    function getDefaultValue() {
        var userId = (IsAdmin()) ? window.currentUesrId : window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url: window.link.kycFatca + "/" + userId,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data != null) {
                $scope.kycFatcaFormData = {
                    income: response.data.KYC.income.toString(),
                    pep: response.data.KYC.pep,
                    wealth_src: response.data.KYC.wealth_src.toString(),
                    aadhaar: response.data.KYC.aadhaar,
                    id1_type: response.data.FATCA.id1_type,
                    tax_payer_identityno1: response.data.FATCA.tax_payer_identityno1,
                    country_tax_residency1: response.data.FATCA.country_tax_residency1,
                    tax_residency_other: response.data.FATCA.tax_residency_other
                };
                $scope.otherTaxResidency = response.data.FATCA.tax_residency_other;
                if(response.data.FATCA.birth_place === response.data.FATCA.birth_country ){
                   $scope.kycFatcaFormData.birth_place = response.data.FATCA.birth_place;
                } else {
                    $scope.kycFatcaFormData.birth_place = response.data.FATCA.birth_place +', ' + response.data.FATCA.birth_country ;
                }
            } else {
                $http({
                    method: 'GET',
                    url: window.link.personal + '/' + userId,
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    $scope.PAN = response.data.PAN;
                    $scope.kycFatcaFormData.tax_payer_identityno1 = $scope.PAN;
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
        }, function errorCallback(response) {
            console.log(response);
        });
        //(response.data.FATCA.tax_residency_other)?'Yes':'No'
    }

    function fourmStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + window.localStorage.getItem("userid"),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var isActive = false;
                for (var i = 0; i < response.data.registration.length; i++) {
                    if (response.data.registration[i].status == "acct_verified") {
                        isActive = true;
                    }
                }
                $scope.formStatus = isActive;
                if (isActive) {
                    $("#kycFatcaForm :input").attr("disabled", true);
                    $("#kycFatcaForm :submit").attr("disabled", false);
                }
                var isEditable = false;
                for (var i = 0; i < response.data.accountInfo.length; i++) {
                    if (response.data.accountInfo[i].state == "KYC") {
                        isEditable = true;
                    }
                }
                if (isEditable)
                    $scope.submitText = "Update";
                $scope.formEditStatus = isEditable;
            } catch (e) {
                alert('State name is incorrect!');
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('kycFatca', kycFatca);

function reSendOTPCtrl($scope, $http ,toaster, $location) {

    $scope.email = "";
    $scope.resendOTP = function () {

        var otpData = {
            username: $scope.email
        };
        var url = window.link.resend_otp;
        $http({
            method: 'POST',
            url: url,
            data: $.param(otpData),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            toaster.success({body: 'New OTP is sent to your mobile no'});
            $location.path("/verify_otp");
        }, function errorCallback(response) {

        });
    }
}
 
angular.module('finatwork').controller('reSendOTPCtrl', reSendOTPCtrl);

/**
 * GoalWise Dashboard - Controller for Goalwise view
 */
function goalWiseDashboardCtrl($scope, $state, $http, DTOptionsBuilder, thousandSeparator, toaster) {
    var resData = {};
    $scope.dynamicChartId = 'pie-plot1-chart';
    $scope.activeclass = "activeborder";
    var schemeallocation = [];
    var loadSchemeallocation = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.fundnamelist,
        }).then(function successCallback(response) {
            schemeallocation = response.data;
            $scope.getGoalsList("active");
        }, function errorCallback(response) {

        });
    };

    var getAssetAllocation = function (goalIndex) {
        var assetAllocation = {
            equityLarge: 0,
            equityMid: 0,
            debtLong: 0,
            debtShort: 0,
            gold: 0,
            liquid: 0,
            elss: 0,
            hybrid: 0
        };
        resData[goalIndex].funds.forEach(function (fund) {
            if (fund.category == 'EquityLarge') {
                assetAllocation.equityLarge += fund.marketValue;
            } else if (fund.category == 'EquityMid') {
                assetAllocation.equityMid += fund.marketValue;
            } else if (fund.category == 'DebtLong') {
                assetAllocation.debtLong += fund.marketValue;
            } else if (fund.category == 'DebtShort') {
                assetAllocation.debtShort += fund.marketValue;
            } else if (fund.category == 'Gold') {
                assetAllocation.gold += fund.marketValue;
            } else if (fund.category == "Liquid") {
                assetAllocation.liquid += fund.marketValue;
            } else if (fund.category == 'ELSS') {
                assetAllocation.elss += fund.marketValue;
            } else if (fund.category == 'Hybrid') {
                assetAllocation.hybrid += fund.marketValue;
            }
        });
        return assetAllocation;
    };
    $scope.init = function () {
        if (IsAdmin()) {
            if (window.currentUesrId != "" && window.currentUesrId !== undefined)
                loadSchemeallocation();
            else
                toaster.error({body: "Please load any one of profile!"});
        } else {
            loadSchemeallocation();
        }
    };


    $scope.type = 'danger';

    var sortArray = [];
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withDOM('<"html5buttons"B>lTfgitp')
        .withButtons([
            {extend: 'excel', title: 'ExampleFile'},

            {
                extend: 'print',
                customize: function (win) {
                    $(win.document.body).addClass('white-bg');
                    $(win.document.body).css('font-size', '10px');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
            }
        ]);
    $scope.setIndividualGoal = function (type, src, name) {
        $scope.selected = type;
        var sortData = [];
        for (var i = 0; i < resData.length; i++) {
            if (type === resData[i].type) {
                sortData.push(resData[i]);
            }
        }
        $scope.goals = sortData;
    };

    $scope.getGoalsList = function (status) {
        var goalsList = [
            {name: "Home", src: "/img/goal_home_m.png", type: "home"},
            {name: "Vehicle", src: "/img/goal_vehicle_m.png", type: "vehicle"},
            {name: "Education", src: "/img/goal_education_m.png", type: "education"},
            {name: "Retirement", src: "/img/goal_retirement_m.png", type: "retirement"},
            {name: "Marriage", src: "/img/goal_marriage_m.png", type: "marriage"},
            {name: "Contingency", src: "/img/goal_contingency_m.png", type: "contingency"},
            {name: "Tax Planning", src: "/img/goal_taxPlanning_m.png", type: "taxPlanning"},
            {name: "Crorepati", src: "/img/goal_crorepati_m.png", type: "crorepati"},
            {name: "Wealth Creation", src: "/img/goal_wealthCreation_m.png", type: "wealthCreation"},
            {name: "Other", src: "/img/goal_other_m.png", type: "other"}

        ];
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=" + status + "&view=goal+fund&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data.length > 0) {
                resData = response.data;
                var tempArray = [];
                for (var i = 0; i < resData.length; i++) {
                    resData[i].updatedAt = moment(resData[i].updatedAt).format('DD-MM-YYYY HH:mm A');
                    resData[i].createdAt = moment(resData[i].createdAt).format('DD-MM-YYYY HH:mm A');
                    resData[i].percentAchievable = Math.round(resData[i].percentAchievable * 100);
                    resData[i].percentAchieved = Math.round(resData[i].percentAchieved * 100);
                    resData[i].assetAllocation = getAssetAllocation(i);

                    if (sortArray.indexOf(resData[i].type) == -1) {
                        for (var j = 0; j < goalsList.length; j++) {
                            if (resData[i].type === goalsList[j].type) {
                                tempArray.push(goalsList[j]);
                                sortArray.push(goalsList[j].type);
                                break;
                            }
                        }
                    }
                }
                if (sortArray.length > 1) {
                    var sortData = [];
                    for (var i = 0; i < resData.length; i++) {
                        if (sortArray[0] === resData[i].type) {
                            sortData.push(resData[i]);
                        }
                    }
                    $scope.goals = sortData;
                    $scope.selected = sortArray[0];
                } else {
                    $scope.goals = resData;
                }
                $scope.goalsList = tempArray;
            } else {
                toaster.error({body: "There is no active goals available"});
            }

        }, function errorCallback(response) {

        });
    };
    $scope.getFundName = function (_id) {
        for (var j = 0; j < schemeallocation.length; j++) {
            if (_id === schemeallocation[j].schemeId)
                return schemeallocation[j].scheme;
        }
    };
    $scope.getNumber = function (num) {
        return isNaN(num)?'Pending':Math.round(num);

    };
    $scope.getDecimal = function (num) {
        return isNaN(num)?'Pending':num.toFixed(2);
    };

    $scope.thousandseparator = thousandSeparator.thousandSeparator;
}
angular.module('finatwork').controller('goalWiseDashboardCtrl', goalWiseDashboardCtrl);
function healthResultCtrl($scope, $state, $http, $timeout) {

    //getting health profile result
    $http({
        method: 'GET',
        url: window.link.healthProfileResult + "/" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        if (response.data == null) {
            $state.go('forms.fin_health');
        }
        $scope.scores = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.value = 7;
    $scope.upperLimit = 9;
    $scope.lowerLimit = 3;
    $scope.unit = "";
    $scope.precision = 1;
    $scope.ranges = [
        {
            min: 3,
            max: 4.2,
            color: '#C50200'
        },
        {
            min: 4.2,
            max: 5.4,
            color: '#FF7700'
        },
        {
            min: 5.4,
            max: 6.6,
            color: '#FF7700'
        }
        ,
        {
            min: 6.6,
            max: 7.8,
            color: '#8DCA2F'
        },
        {
            min: 7.8,
            max: 9,
            color: '#8DCA2F'
        },

    ];
    $scope.getCategory = function (category) {
        return (category === "OverAll");
    };
    $scope.goNewState = function (state) {
        var currentState = "";
        switch (state) {
            case "FinTelligent":
                currentState = "dashboards.goals_home";
                break;
            case "FinGPS":
                currentState = "fingps";
                break;
            case "FinSure":
                currentState = "finsure";
                break;
            case "FinTax":
                currentState = "fintax";
                break;
            case "FinEstate":
                currentState = "finestate";
                break;
        }
        (currentState != "") ? $state.go(currentState) : $state.go("/dashboards/dashboard_1");
    };
    $scope.getScoreLabel = function (score) {
        var state = "";
        if (score > 7) state = "Excellent";
        if (score > 4 && score <= 7) state = "Good";
        if (score <= 4) state = "Poor";
        return state;
    };
    $scope.getStarted = function () {
        $state.go('dashboards.goals_home');
    }

}
angular.module('finatwork').controller('healthResultCtrl', healthResultCtrl);
/**
 * Created by Finatwork on 25-03-2017.
 */
function finHealthCtrl($scope, $http, toaster, $state, $timeout) {
    $scope.Answer = {};
    $scope.answers = new Array(15);
    $scope.savingsHabitStatus = true;
    $scope.savingsHabitScore = 3;
    $scope.contingencyPreparednessStatus = true;
    $scope.contingencyPreparednessScore = 3;
    $scope.loansituationStatus = true;
    $scope.loansituationScore = 3;
    $scope.investmentDisciplineStatus = true;
    $scope.investmentDisciplineScore = 3;
    $scope.generalAwarenessStatus = true;
    $scope.generalAwarenessScore = 3;
    $scope.value = 7;
    $scope.upperLimit = 9;
    $scope.lowerLimit = 3;
    $scope.unit = "";
    $scope.precision = 1;
    $scope.description = [];
    $scope.isLogedin = getUserId() !== null;

    $scope.ranges = [
        {
            min: 3,
            max: 5,
            color: '#C50200'
        },
        {
            min: 5,
            max: 7,
            color: '#FF7700'
        },
        {
            min: 7,
            max: 9,
            color: '#8DCA2F'
        }
    ];

    $http({
        method: 'GET',
        url: window.link.finHealthQuestion
    }).then(function successCallback(response) {
        $scope.questionsData = response.data;
        $scope.showQuestion();
    }, function errorCallback(response) {
        console.log(response);
    });

    $http({
        method: 'GET',
        url: window.StorageURL.finhealth
    }).then(function successCallback(response) {
        if (response.data == 0) {
            return false;
        }
        $scope.description = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
    $scope.showQuestion = function () {
        $scope.category1 = $scope.questionsData.slice(0, 3);
        $scope.category2 = $scope.questionsData.slice(3, 6);
        $scope.category3 = $scope.questionsData.slice(6, 9);
        $scope.category4 = $scope.questionsData.slice(9, 12);
        $scope.category5 = $scope.questionsData.slice(12, 15);
    };


    function getScore(cat, data) {
        var weightage = [3, 2, 1];
        $scope.answers[cat[0].qsno - 1] = data[0];
        $scope.answers[cat[1].qsno - 1] = data[1];
        $scope.answers[cat[2].qsno - 1] = data[2];
        return weightage[data[0]] + weightage[data[1]] + weightage[data[2]];
    }

    $scope.submitQuestion = function (questions) {
        var ques1, ques2,ques3;
        var ans  = [];
        if (questions === "savingsHabit") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category1[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category1[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category1[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                ans = [];
                ans.push($scope.Answer[$scope.category1[0]._id]);
                ans.push($scope.Answer[$scope.category1[1]._id]);
                ans.push($scope.Answer[$scope.category1[2]._id]);
                $scope.savingsHabitScore = getScore($scope.category1, ans);
                $scope.savingsHabitDesctiption = "";
                if ($scope.savingsHabitScore >= 7) {
                    $scope.savingsHabitDesctiption = $scope.description[0].options[0].commentary;
                } else if ($scope.savingsHabitScore >= 5) {
                    $scope.savingsHabitDesctiption = $scope.description[0].options[1].commentary;
                } else {
                    $scope.savingsHabitDesctiption = $scope.description[0].options[2].commentary;
                }
                $scope.savingsHabitStatus = false;
            }
        }

        if (questions === "contingencyPreparedness") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category2[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category2[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category2[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                ans = [];
                ans.push($scope.Answer[$scope.category2[0]._id]);
                ans.push($scope.Answer[$scope.category2[1]._id]);
                ans.push($scope.Answer[$scope.category2[2]._id]);
                $scope.contingencyPreparednessScore =  getScore($scope.category2, ans)
                $scope.contingencyDesctiption = "";
                if ($scope.contingencyPreparednessScore >= 7) {
                    $scope.contingencyDesctiption = $scope.description[1].options[0].commentary;
                } else if ($scope.contingencyPreparednessScore >= 5) {
                    $scope.contingencyDesctiption = $scope.description[1].options[1].commentary;
                } else {
                    $scope.contingencyDesctiption = $scope.description[1].options[2].commentary;
                }
                $scope.contingencyPreparednessStatus = false;
            }
        }

        if (questions === "loansituation") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category3[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category3[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category3[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                 ans = [];
                ans.push($scope.Answer[$scope.category3[0]._id]);
                ans.push($scope.Answer[$scope.category3[1]._id]);
                ans.push($scope.Answer[$scope.category3[2]._id]);
                $scope.loansituationScore = getScore($scope.category3, ans);
                $scope.loansituationDesctiption = "";
                if ($scope.loansituationScore >= 7) {
                    $scope.loansituationDesctiption = $scope.description[2].options[0].commentary;
                } else if ($scope.loansituationScore >= 5) {
                    $scope.loansituationDesctiption = $scope.description[2].options[1].commentary;
                } else {
                    $scope.loansituationDesctiption = $scope.description[2].options[2].commentary;
                }
                $scope.loansituationStatus = false;
            }
        }

        if (questions === "investmentDiscipline") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category4[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category4[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category4[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                 ans = [];
                ans.push($scope.Answer[$scope.category4[0]._id]);
                ans.push($scope.Answer[$scope.category4[1]._id]);
                ans.push($scope.Answer[$scope.category4[2]._id]);
                $scope.investmentDisciplineScore = getScore($scope.category4, ans);
                $scope.investmentDesctiption = "";
                if ($scope.investmentDisciplineScore >= 7) {
                    $scope.investmentDesctiption = $scope.description[3].options[0].commentary;
                } else if ($scope.investmentDisciplineScore >= 5) {
                    $scope.investmentDesctiption = $scope.description[3].options[1].commentary;
                } else {
                    $scope.investmentDesctiption = $scope.description[3].options[2].commentary;
                }
                $scope.investmentDisciplineStatus = false;
            }
        }

        if (questions === "generalAwareness") {
            ques1 = $scope.Answer.hasOwnProperty($scope.category5[0]._id);
            ques2 = $scope.Answer.hasOwnProperty($scope.category5[1]._id);
            ques3 = $scope.Answer.hasOwnProperty($scope.category5[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                ans = [];
                ans.push($scope.Answer[$scope.category5[0]._id]);
                ans.push($scope.Answer[$scope.category5[1]._id]);
                ans.push($scope.Answer[$scope.category5[2]._id]);
                $scope.generalAwarenessScore = getScore($scope.category5, ans);
                $scope.generalAwarenessDesctiption = "";
                if ($scope.generalAwarenessScore >= 7) {
                    $scope.generalAwarenessDesctiption = $scope.description[4].options[0].commentary;
                } else if ($scope.generalAwarenessScore >= 5) {
                    $scope.generalAwarenessDesctiption = $scope.description[4].options[1].commentary;
                } else {
                    $scope.generalAwarenessDesctiption = $scope.description[4].options[2].commentary;
                }
                $scope.generalAwarenessStatus = false;
            }
        }
    };
    $scope.overAllScoreValidate = function () {
        var keys = Object.keys($scope.Answer);
        var len = keys.length;

        if (len === 15) {
            if ($scope.isLogedin == true) {
                for (var i = 0; i < 15; i++) {
                    $scope.answers[i] = parseInt($scope.answers[i]) + 1;
                }

                var answerObj = {
                    _userid: window.localStorage.getItem("userid"),
                    answer: $scope.answers
                };

                $http({
                    method: 'POST',
                    url: window.link.finHealthAnswer,
                    data: answerObj,
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    $state.go('dashboards.health_result')
                }, function errorCallback(response) {
                    console.log("Response" + response);
                });
            } else {
                angular.element('[data-target="#tab-6"]').tab('show');
            }
        } else {
            toaster.error({body: "Please answer all the questions"});
            $timeout(function () {
                angular.element('[data-target="#tab-1"]').tab('show');
            }, 100);
        }

    };
    $scope.successMessage = false;
    $scope.showForm = true;
    $scope.finHealthReport = function () {
        for (var i = 0; i < 15; i++) {
            $scope.answers[i] = parseInt($scope.answers[i]) + 1;
        }
        var answerObj = {
            email: $scope.login.email,
            name: $scope.login.name,
            answer: $scope.answers
        };

        $http({
            method: 'POST',
            url: window.link.finHealthAnswer,
            data: answerObj
        }).then(function successCallback(response) {
            $scope.successMessage = true;
            $scope.showForm = false;

        }, function errorCallback(response) {
        });
    }
    $scope.goNewState = function (state) {
        var currentState = "";
        switch (state) {

            case "Free Sign Up" :
                currentState = "register";
                break;
        }
        (currentState != "") ? $state.go(currentState) : $state.go("/dashboards/dashboard_1");
    };

}
angular.module('finatwork').controller('finHealthCtrl', finHealthCtrl);

function clientsCtrl($scope, $http, toaster, uiGridConstants, $rootScope, fintaxService, fintaxFilingService) {
    $scope.gridOptions = {
        multiSelect: false,
        enableSelectAll: false,
        enableSelectionBatchEvent: false,
        selectionRowHeaderWidth: 25,
        rowHeight: 25,
        showGridFooter: true,
        enableFiltering: true
    };

    $scope.categoryHashReverse = {
        'unassigned': '1',
        'prospect-followup': '2',
        'prospect-newsletter': '3',
        'client-underprocess': '4',
        'client-active': '5'
    };

    $scope.advisorHashReverse = {
        'Neeti': '1',
        'Saurabh': '2',
        'Subhajit': '3',
        'Megha': '4'
    };

    $scope.gridOptions.columnDefs = [
        {name: 'Name', field: 'fullName',enableCellEdit: false, pinnedLeft: true},
        {name: 'Email', field: 'username',enableCellEdit: false},
        {name: 'Mobile', field: 'mobile',enableCellEdit: false,width: '10%'},
        {name: 'Last Login', field: 'last',enableCellEdit: false,cellFilter: 'date', type: 'date'},
        {name: 'Account Status', field: 'acctStatus',enableCellEdit: false},
        {
            name: 'Category',
            "field": "category",
            width: '15%',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [
                    {value: '1', label: 'unassigned'},
                    {value: '2', label: 'prospect-followup'},
                    {value: '3', label: 'prospect-newsletter'},
                    {value: '4', label: 'client-underprocess'},
                    {value: '5', label: 'client-active'}
                ]
            },
            cellFilter: 'mapCategory',
            editDropdownValueLabel: 'category',
            editDropdownOptionsArray: [
                {id: 1, category: 'unassigned'},
                {id: 2, category: 'prospect-followup'},
                {id: 3, category: 'prospect-newsletter'},
                {id: 4, category: 'client-underprocess'},
                {id: 5, category: 'client-active'}
            ]
        },
        {
            name: 'Advisor',
            field: 'advisor',
            width: '10%',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [
                    {value: '1', label: 'Neeti'},
                    {value: '2', label: 'Saurabh'},
                    {value: '3', label: 'Subhajit'},
                    {value: '4', label: 'Megha'}
                ]
            },
            cellFilter: 'mapAdvisor',
            editDropdownValueLabel: 'advisor',
            editDropdownOptionsArray: [
                {id: 1, advisor: 'Neeti'},
                {id: 2, advisor: 'Saurabh'},
                {id: 3, advisor: 'Subhajit'},
                {id: 4, advisor: 'Megha'}
            ]
        }
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            if (newValue !== undefined && newValue != oldValue) {
                var data = {_userid: rowEntity._userid};
                if (colDef.name === 'Category') {
                    data.category = colDef.editDropdownOptionsArray[newValue - 1].category
                } else if (colDef.name === 'Advisor') {
                    data.advisor = colDef.editDropdownOptionsArray[newValue - 1].advisor
                }

                $http({
                    method: 'POST',
                    url: window.link.engagement + '/' + rowEntity._userid,
                    data: data,
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(data) {
                    //$scope.$apply();
                    toaster.success({body: 'successfully updated'});
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
        });

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) {
                window.currentUesrId = row.entity._userid;
                window.currentUserFullName = row.entity.fullName;
                toaster.success({body: window.currentUserFullName + " Profile Loaded!"});
                $rootScope.name = window.currentUserFullName;
                $("#full_name").text(window.currentUserFullName);
                fintaxService.reset();
                fintaxFilingService.reset();
            }
        });
    };

    $http({
        method: 'GET',
        url: window.link.users,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (user) {
            user.last = moment(user.last).format('DD-MMM-YY, h:mm:ss a');
            user.fullName = user.firstname + ' ' + user.lastname;
            user.category = $scope.categoryHashReverse[user.category];
            user.advisor = $scope.advisorHashReverse[user.advisor];
        });
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular
    .module('finatwork')
    .controller('clientsCtrl', clientsCtrl)
    .filter('mapCategory', function () {
        var categoryHash = {
            1: 'unassigned',
            2: 'prospect-followup',
            3: 'prospect-newsletter',
            4: 'client-underprocess',
            5: 'client-active'
        };

        return function (input) {
            if (!input) {
                return '';
            } else {
                return categoryHash[input];
            }
        };
    })
    .filter('mapAdvisor', function () {
        var advisorHash = {
            1: 'Neeti',
            2: 'Saurabh',
            3: 'Subhajit',
            4: 'Megha'
        };

        return function (input) {
            if (!input) {
                return '';
            } else {
                return advisorHash[input];
            }
        };
    });

/*TODO
 * Delete functionality
 * reduce header size
 * selectionRowHeaderWidth
 * rowHeight*/
/**
 * Created by Finatwork on 28-01-2017.
 */
function basicinfoStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.basics,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (basic) {
            basic.dob = moment(basic.dob).format('YYYY-MM-DD');
        });
        $scope.basics = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('basicinfoStatusCtrl', basicinfoStatusCtrl);


/**
 * Created by Finatwork on 28-01-2017.
 */
function personalinfoStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.personal,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (personal) {
            personal.dob = moment(personal.dob).format('YYYY-MM-DD');
        });
        $scope.personals = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('personalinfoStatusCtrl', personalinfoStatusCtrl);

/*Created on 29-March-2017*/
function userQuesryStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.userQuery,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        $scope.userQuery = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('userQuesryStatusCtrl', userQuesryStatusCtrl);


/**
 * Created by Finatwork on 28-01-2017.
 */
function bankinfoStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.bank,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {

        $scope.bank = response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('bankinfoStatusCtrl', bankinfoStatusCtrl);

/**
 * Created by Finatwork on 28-01-2017.
 */
function kycFatcaStatusCtrl($scope, $http, toaster, $rootScope) {
    $http({
        method: 'GET',
        url: window.link.kycFatca,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        $scope.kycs = response.data;
        // $scope.fatca=response.data;
    }, function errorCallback(response) {

    });
}
angular.module('finatwork').controller('kycFatcaStatusCtrl', kycFatcaStatusCtrl);
/**
 * Created by Finatwork on 30-01-2017.
 */

function riskProfileCtrl($scope, $state, $http, toaster, c3ChartService, $uibModal) {
    $scope.dynamic=0;
    $scope.init = function(){
        //
    };
    //getting risk profile result
    $http({
        method: 'GET',
        url: window.link.riskProfileResult + "/" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        if (response.data) {
            $state.go('dashboards.risk_result');
        }else {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_risk_profile.html',
                controller: modelButtonController,
                windowClass: "animated fadeIn"
            });

            $http({
                method: 'GET',
                url: window.link.riskProfileQuestion,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data == 0) {
                    return false;
                }
                window.localStorage.setItem("risk_questions_answer", "");
                window.localStorage.setItem("risk_questions", JSON.stringify(response.data));
                $scope.showQuestion(0);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.showQuestion = function (q) {
        if (window.localStorage.getItem("risk_questions")) {
            var questions = JSON.parse(window.localStorage.getItem("risk_questions"));
            $scope.question_text = questions[q].question;
            $scope.answers = questions[q].answer;
            $scope.qno = q;
        }
    };

    $scope.submitQuestion = function (question_text, qno) {
        var selected = parseFloat($scope.optionsRadios) + 1;
        if (selected >= 1) {
            $scope.dynamic = (qno+1) * 23;
            var resArray = [];
            resArray = (window.localStorage.getItem("risk_questions_answer")) ? JSON.parse(window.localStorage.getItem("risk_questions_answer")) : [];
            resArray.push(selected);
            window.localStorage.setItem("risk_questions_answer", JSON.stringify(resArray));

            if (window.localStorage.getItem("risk_questions")) {
                var questions = JSON.parse(window.localStorage.getItem("risk_questions"));
                qno = qno + 1;
                if (qno < questions.length) {
                    $scope.optionsRadios = "";
                    $scope.showQuestion(qno);
                } else {

                    var answerObj = {
                        _userid: window.localStorage.getItem("userid"),
                        answer: JSON.parse(window.localStorage.getItem("risk_questions_answer"))
                    };

                    $http({
                        method: 'POST',
                        url: window.link.riskProfileAnswer,
                        data: answerObj,
                        headers: {
                            'x-access-token': window.localStorage.getItem('token')
                        }
                    }).then(function successCallback(response) {
                        window.localStorage.setItem("risk_questions_answer", "");
                        $state.go('dashboards.risk_result');
                    }, function errorCallback(response) {
                        window.localStorage.setItem("risk_questions_answer", "");
                        toaster.error({body: response.data.reason});
                    });
                }
            }
        }else{
            toaster.error({body: "Please answer the question"});
        }
    }
}
angular.module('finatwork').controller('riskProfileCtrl',['$scope', '$state', '$http' ,'toaster' ,'c3ChartService','$uibModal' ,riskProfileCtrl]);

function riskResultCtrl($scope, $state, $http, c3ChartService) {

    //Area chart
    /*$scope.chartType = {};

    $scope.transform = function(chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };
    $scope.riskprofilechartID = 'riskprofileID';
    $scope.riskprofilechart = {

        data: {
            columns: [
                ['Profile',0,1,2,3,4,5,6],
            ],
            colors: {
                Profile: '#0000ff'
            }
        },
        zoom: {
            enabled: true
        },
        axis: {
            y: {
                max: 7,
                min: 1,
                label: {
                    text: 'Risk',
                    position: 'outer-middle'
                }
            },
            x: {
                max: 5,
                min: 0,
                label: {
                    text: 'Return',
                    position: 'outer-center'
                }
            }
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    var format = "";
                    if(value === 1)format = "Conservative";
                    if(value === 2)format = "Moderately Conservative";
                    if(value === 3)format = "Balanced";
                    if(value === 4)format = "Moderately Aggressive";
                    if(value === 5)format = "Aggressive";
                    return format;
                }
            }
        },
        legend: {
            show: false
        },
        regions: [
            {axis: 'x', start:0, end: 0, class: 'green'},
        ]
    };*/

    //getting risk profile result
    $http({
        method: 'GET',
        url: window.link.riskProfileResult + "/" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        if (response.data == 0) {
            return false;
        }
        $scope.profile_risk = response.data.profile;
        $scope.text_risk = response.data.text;
        if(response.data.profile === "Conservative")
            $scope.profileImageSrc = "/img/conservative.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:0.5, end: 1.5, class: 'green'}];
        if(response.data.profile === "Moderately Conservative")
            $scope.profileImageSrc = "/img/moderately_conservative.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:1.5, end: 2.5, class: 'green'}];
        if(response.data.profile === "Balanced")
            $scope.profileImageSrc = "/img/balanced.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:2.5, end: 3.5, class: 'green'}];
        if(response.data.profile === "Moderately Aggressive")
            $scope.profileImageSrc = "/img/moderately_aggressive.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:3.5, end: 4.5, class: 'green'}];
        if(response.data.profile === "Aggressive")
            $scope.profileImageSrc = "/img/aggressive.jpg";
            //$scope.riskprofilechart.regions = [{axis: 'x', start:4.5, end: 5.5, class: 'green'}];
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.SetupGoal = function () {
        $state.go('dashboards.goals_home');
    };
}
angular.module('finatwork').controller('riskResultCtrl',['$scope', '$state', '$http' , 'c3ChartService', riskResultCtrl]);
/**
 * portfolioview - Controller for portfolioview
 */
function goalPortfolioDashboardCtrl($scope, $http, c3ChartService, thousandSeparator, toaster) {
    $scope.thousandseparator = thousandSeparator.thousandSeparator;
    $scope.gridData = [];
    $scope.portfoilo = {};
    $scope.showPortFolioPage = false;
    $scope.gridOptions = {
        expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
        expandableRowHeight: 150,
        expandableRowScope: {
            subGridVariable: 'subGridScopeVariable'
        }
    };

    $scope.gridOptions.columnDefs = [
        {name: 'Goal Type', field: "Type", width: '12%'},
        {name: 'Category', field: "Category", width: '10%'},
        {name: 'Folio No', field: "Folio", width: '13%'},
        {name: 'Scheme Name', field: "Scheme_Name", width: '19%'},
        {name: 'Invested Amt', field: "Invested_Amt", width: '10%'},
        {name: 'Current Value', field: "Current_Value", width: '9%'},
        {name: 'Profit', field: "Profit", width: '7%'},
        {name: 'Absolute Returns(%)', field: "Absolute_Returns", width: '10%'},
        {name: 'Annualized (xirr %)', field: "XIRR", width: '9%'}
    ];

    $scope.goalsDisplayName = {
        "home": "Home",
        "vehicle": "Vehicle",
        "education": "Education",
        "retirement": "Retirement",
        "marriage": "Marriage",
        "contingency": "Contingency",
        "taxPlanning": "Tax Planning",
        "crorepati": "Crorepati",
        "wealthCreation": "Wealth Creation",
        "other": "Other"
    };

    $scope.trxnDisplayType = {
        "NEWPUR": "Purchase",
        "NEW": "Purchase",
        "Fresh Purchase": "Purchase",
        "Fresh Purchase Systematic": "SIP",
        "SIP": "SIP",
        "SIN": "SIP",
        "Additional Purchase": "Additional Purchase",
        "ADDPUR": "Additional Purchase",
        "Add": "Additional Purchase",
        "Additional Purchase Systematic": "SIP",
        "SIPR": "SIP Rejection",
        "SINR": "SIP Rejection",
        "STPI": "S T P In",
        "STPA": "S T P In",
        "STPO": "S T P Out",
        "RED": "Redemption",
        "Partial Redemption": "Redemption",
        "Full Redemption": "Redemption",
        "Switch In": "Switch In",
        "SWIN": "Switch In",
        "SWINR": "Switch In Rejection"
    };

    $scope.schemeallocation = [];
    var loadSchemeAllocation = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.fundnamelist
        }).then(function successCallback(response) {
            $scope.schemeallocation = response.data;
            getFundData();
        }, function errorCallback(response) {

        });
    };

    $scope.chartType = {};

    $scope.transform = function (chartId, serie) {
        c3ChartService['#' + chartId].transform($scope.chartType[serie], serie);
    };

    $scope.goalAllocationID = 'goalAllocationID';
    $scope.goalAllocation = {
        data: {
            columns: [],
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return Math.round(value);
                }
            }
        }
    };

    $scope.amcAllocationID = 'amcAllocationID';
    $scope.amcAllocation = {
        data: {
            columns: [],
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    return Math.round(value);
                }
            }
        }
    };

    $scope.assetAllocationID = 'assetAllocationID';
    $scope.assetAllocation = {
        data: {
            columns: [],
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                value: function (value, ratio, id) {
                    var format = "";
                    value = Math.round(value);
                    if (id === "DebtLong") format = "Debt - LongTerm: " + value;
                    if (id === "DebtShort") format = "Debt - ShortTerm: " + value;
                    if (id === "ELSS") format = "TaxSaving (ELSS): " + value;
                    if (id === "EquityLarge") format = "Equity - LargeCap: " + value;
                    if (id === "EquityMid") format = "Equity - MidCap: " + value;
                    if (id === "Gold") format = "Gold/International: " + value;
                    if (id === "Liquid") format = "Liquid: " + value;
                    if (id === "Hybrid") format = "Hybrid: " + value;
                    return format;
                }
            }
        }
    };

    function getAMCName(_id) {
        for (var j = 0; j < $scope.schemeallocation.length; j++) {
            if (_id === $scope.schemeallocation[j].schemeId)
                return $scope.schemeallocation[j].amc;
        }
    }

    function getFundName(_id) {
        for (var j = 0; j < $scope.schemeallocation.length; j++) {
            if (_id === $scope.schemeallocation[j].schemeId)
                return $scope.schemeallocation[j].scheme;
        }
    }

    $scope.init = function () {
        if (IsAdmin()) {
            if (window.currentUesrId != "" && window.currentUesrId !== undefined)
                loadSchemeAllocation();
            else
                toaster.error({body: "Please load any one of profile!"});
        } else {
            loadSchemeAllocation();
        }
    };

    function showAMCChart() {
        var folio, subFund, absReturn, xir, currentValue, investedAmt, profit;
        var tempArry = [];
        /* Grid Data */
        $scope.fundAll.forEach(function (fund) {
            if (fund.status === 'active') {
                fund.trxn.forEach(function (trxn) {
                    trxn.tradDate = moment(trxn.tradDate).format('DD-MMM-YYYY');
                    trxn.amount = Math.round(trxn.units * trxn.NAV);
                    trxn.trxnType = $scope.trxnDisplayType[trxn.trxnType];
                });
                folio = fund.folio;
                absReturn = (fund.absReturn * 100).toFixed(2);
                xir = (fund.xirr * 100).toFixed(2);
                currentValue = $scope.thousandseparator(Math.round(fund.marketValue));
                investedAmt = $scope.thousandseparator(Math.round(fund.investedCost));
                profit = $scope.thousandseparator(Math.round(fund.marketValue) - Math.round(fund.investedCost));
                subFund = fund.trxn;
            } else {
                folio = 'Pending';
                absReturn = 'Pending';
                xir = 'Pending';
                currentValue = 'Pending';
                investedAmt = 'Pending';
                profit = 'Pending';
                subFund = null;
            }
            $scope.gridData.push({
                Type: $scope.goalsDisplayName[fund.type],
                Category: fund.category,
                Scheme_Name: getFundName(fund._schemeId),
                Folio: folio,
                Invested_Amt: investedAmt,
                Current_Value: currentValue,
                Profit: profit,
                Absolute_Returns: absReturn,
                XIRR: xir,
                subFund: subFund
            })
        });

        $scope.gridData.forEach(function (data) {
            if (data.subFund !== null) {
                data.subGridOptions = {
                    columnDefs: [{name: "Date", field: "tradDate"}, {name: "Trxn Type", field: "trxnType"}, {
                        name: "Units",
                        field: "units"
                    }, {name: "NAV", field: "NAV"}, {name: "Amount", field: "amount"}],
                    data: data.subFund
                }
            }
        });

        if ($scope.portfoilo) {
            $scope.gridData.push({
                Type: "Total",
                Invested_Amt: $scope.thousandseparator(Math.round($scope.portfoilo.investedCost)),
                Current_Value: $scope.thousandseparator(Math.round($scope.portfoilo.marketValue)),
                Profit: $scope.thousandseparator(Math.round($scope.portfoilo.marketValue - $scope.portfoilo.investedCost)),
                Absolute_Returns: ($scope.portfoilo.absReturn * 100).toFixed(2),
                XIRR: ($scope.portfoilo.xirr * 100).toFixed(2)
            });
        }

        $scope.gridOptions.data = $scope.gridData;

        var fundObject = {};
        $scope.fundAll.forEach(function (item) {
            fundObject[item._schemeId] = fundObject[item._schemeId] || "";
        });

        var sortFund = Object.keys(fundObject);
        var amcNameWithSchemeId = [];
        sortFund.forEach(function (item) {
            amcNameWithSchemeId.push({_schemeId: item, amcname: getAMCName(item)});
        });

        var columns = [];
        amcNameWithSchemeId.forEach(function (amc) {
            tempArry.push(amc.amcname);
            $scope.fundAll.forEach(function (fund) {
                if (fund.marketValue) {
                    if (amc._schemeId === fund._schemeId)
                        tempArry.push(fund.marketValue);
                }
            });
            columns.push(tempArry);
            tempArry = [];
        });
        $scope.amcAllocation.data.columns = columns;
    }

    function getFundData() {
        $http({
            method: 'GET',
            url: window.link.create_goal + "?state=active&view=goal+fund+trxn&userid=" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            if (response.data.length > 0) {
                var tempArry = [];
                $scope.showPortFolioPage = true;
                $scope.goalData = response.data;
                $scope.fundAll = [];
                $scope.goalData.forEach(function (goal) {
                    goal.funds.forEach(function (fund) {
                        fund.type = goal.type;
                    });
                    $scope.fundAll = $scope.fundAll.concat(goal.funds);
                });

                var fundObject = {};
                $scope.fundAll.forEach(function (item) {
                    fundObject[item.category] = fundObject[item.category] || "";
                });

                var sortFund = Object.keys(fundObject);

                var assetColumns = [];
                sortFund.forEach(function (elem) {
                    tempArry.push(elem);
                    $scope.fundAll.forEach(function (fund) {
                        if (fund.marketValue)
                            if (elem === fund.category)
                                tempArry.push(fund.marketValue);

                    });
                    assetColumns.push(tempArry);
                    tempArry = [];
                });
                $scope.assetAllocation.data.columns = assetColumns;

                var goalColumns = [];
                $scope.goalData.forEach(function (goal) {
                    tempArry.push(goal.type);
                    goal.funds.forEach(function (fund) {
                        if(fund.marketValue)
                            tempArry.push(fund.marketValue);
                    });
                    goalColumns.push(tempArry);
                    tempArry = [];
                });
                $scope.goalAllocation.data.columns = goalColumns;

                $http({
                    method: 'GET',
                    url: window.link.portfolio + '/' + getUserId(),
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    if (response.data) {
                        $scope.portfoilo = response.data;
                    }
                    showAMCChart();
                }, function errorCallback(response) {
                    console.log(response);
                });
            } else {
                toaster.error({body: "There is no active goals available"});
                $scope.showPortFolioPage = false;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }
}
angular.module('finatwork').controller('goalPortfolioDashboardCtrl', ['$scope', '$http', 'c3ChartService', 'thousandSeparator', 'toaster', goalPortfolioDashboardCtrl]);
function userDashboard($scope, $state, $http, $window, $q) {
    $scope.userStatus = [];
    $scope.userDefaultStatus = {};
    $scope.init = function () {
        getDefaultUserStatus();
    };

    function formStatus() {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var sortStatus = [];
                var userStatus = response.data.registration;
                for(var i in $scope.userDefaultStatus){
                    sortStatus.push({
                        status: i,
                        display: $scope.userDefaultStatus[i],
                        date: '',
                        isactive: false
                    });
                }
                userStatus.forEach(function (userElem) {
                    sortStatus.forEach(function (sortElem) {
                        if (sortElem.status === userElem.status) {
                            sortElem.isactive = true;
                            sortElem.date = moment(userElem.notes[0].date).format('DD-MMM-YYYY');
                        }
                    });
                });
                $scope.userStatus = sortStatus;
            } catch (e) {

            }
        }, function errorCallback(response) {

        });
    }

    function getDefaultUserStatus() {
        $http({
            method: 'GET',
            url: window.StorageURL.userstatus,
        }).then(function successCallback(response) {
            $scope.userDefaultStatus = response.data;
            formStatus();
        }, function errorCallback(response) {

        });
    }
}
angular.module('finatwork').controller('userDashboard', userDashboard);
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
function nscHandOverCtrl($http, $scope, $state) {
    $scope.IsSipAvailable = $state.params.sip;
    $scope.dynamicStep4 = ($scope.IsSipAvailable === "true") ? "Step 4:":"Step 3:"
    $scope.init = function(){

    };
}

angular.module('finatwork').controller('nscHandOverCtrl', nscHandOverCtrl);
function serviceRequestCTRL($scope, $state, $http, toaster) {

    $scope.init = function(){

    };

    $scope.sendRequest = function(){
        var action = {
            action: 'generate_pdf',
            _userid: window.localStorage.getItem("userid"),
            type:$scope.requestType,
            message:$scope.message,
            token: window.localStorage.getItem("token")
        };
        $http({
            method: 'POST',
            url: window.link.serviceRequest,
            data: $.param(action),
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).then(function successCallback(response) {
            toaster.success({body: "Thanks for placing the service request. Our Operations team will get back to you shortly"});
            $state.go("dashboards.dashboard_1");
        }, function errorCallback(response) {

        });
    };
}
angular.module('finatwork').controller('serviceRequestCTRL', serviceRequestCTRL);
function accountVerifyCTRL($scope, $state, $http, toaster) {
    $scope.action = {};
    $scope.init = function(){
        formStatus();
    };

    $scope.sendRequest = function(){
        var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
        $scope.action = {
            status:$scope.requestType,
            notes:{
                text:$scope.message
            }
        };
        var data = {
            registration: $scope.action
        };

        $http({
            method: 'POST',
            url: window.link.engagement+"/"+userId,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem("token")}
        }).then(function successCallback(response) {
            toaster.success({body: "Status updated successfully"});
        }, function errorCallback(response) {

        });
    };

    function formStatus() {
        var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + userId,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var userStatus = response.data.registration;
                var sortStatus = [];
                var notes = [];
                for (var i=0; i<userStatus.length; i++) {
                    sortStatus.push({
                        status:userStatus[i].status.toUpperCase(),
                        date: moment(userStatus[i].notes[0].date).format('DD-MMM-YYYY')
                        //isactive:false
                    });
                    for(var j = 0; j<userStatus[i].notes.length; j++){
                        notes.push({
                            status:userStatus[i].status.toUpperCase(),
                            text: userStatus[i].notes[j].text,
                            date: moment(userStatus[i].notes[j].date,"YYYY-MM-DD").format('DD-MMM-YYYY'),
                            user: userStatus[i].notes[j].user
                        });
                    }
                }
                $scope.notes = notes;
                $scope.userStatus = sortStatus;
            } catch (e) {

            }
        }, function errorCallback(response) {

        });
    }
}
angular.module('finatwork').controller('accountVerifyCTRL', accountVerifyCTRL);
/**
 * Created by Finatwork on 06-02-2017.
 */
function transcationController($scope, $http) {
    $http({
        method: 'GET',
        url: window.link.create_goal + "?state=transect&view=goal&userid=" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (goal) {
            if (goal.state == 'failed' || goal.stateTopUp == 'failed') {
                goal.state = 'Failure';
                if( goal.stateTopUp == 'failed'){
                    goal.lumpsum = goal.lumpsumTopUp;
                    goal.sip = goal.sipTopUp;
                }
                goal.trxnFailureReason = 'Oops! There was an unexpected error. Our team will get back shortly on how to resolve the same. '
            } else if (goal.state == 'processing' || goal.stateTopUp == 'processingTopUp') {
                goal.state = 'Processing';
                if(goal.stateTopUp == 'processingTopUp'){
                    goal.lumpsum = goal.lumpsumTopUp;
                    goal.sip = goal.sipTopUp;
                }
                goal.trxnFailureReason = 'Please wait for 3 days for the transaction to reflect in system. '
            }
            goal.updatedAt = moment(goal.updatedAt).format('DD-MMM-YYYY h:mm A');
        });
        $scope.goals = response.data;
    }, function errorCallback(response) {

    });

}
angular.module('finatwork').controller('transcationController', transcationController);

function subscribeModalController($scope, close) {
    this.closed = false;
    $scope.close = function (result) {
        close(result, 500);
        this.closed = true;
    };
}
function serviceCartController($scope, $state, $http, $window, toaster, ModalService) {
    $scope.init = function () {
        loadFinCart();
        $scope.comprehensiveSelected = false;
    };

    var data = {
        _userid: getUserId()
    };

    var loadFinCart = function () {
        $http({
            method: 'GET',
            url: window.link.service,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            $scope.fincarts = response.data;
            $scope.fincarts[0].selected = true;
            if ($state.params.service === "FinGPS") {
                $scope.fincarts[1].selected = true;
            }
            if ($state.params.service === "FinTax") {
                $scope.fincarts[2].selected = true;
            }
            if ($state.params.service === "FinSure") {
                $scope.fincarts[3].selected = true;
            }
            if ($state.params.service === "FinEstate") {
                $scope.fincarts[4].selected = true;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.isSelectable = function (svc) {
        if (svc.name == "FinTelligent Portfolio") {
            return 1;
        } else if ($scope.prefClient && !$scope.prefClientVerified) {
            /*Services shouldn't be selectable when user is in middle of email verification*/
            return 1;
        } else if (svc.name == "FinComprehensive" && $scope.svcPurchased.length >= 3) {
            if ($scope.svcPurchased[0] == "FinGPS" && $scope.svcPurchased[1] == "FinTax" && $scope.svcPurchased[2] == "FinSure") {
                return 1;
            }
        } else if (svc.name == "FinGPS" || svc.name == "FinTax" || svc.name == "FinSure") {
            if ($scope.svcPurchased.indexOf("FinComprehensive") != -1) {
                return 1;
            }
        }
        return 0;

    };
    $scope.computedTotal = function () {
        $scope.totalAmount = 0;
        /*FinComprehensive selected automatically*/
        var selectFinComprehensive = false;
        /*FinComprehensive selected by user*/
        var finComprehensiveSelected = false;
        $scope.svcPurchased = [];
        angular.forEach($scope.fincarts, function (obj, index) {
            if (obj.selected == true && obj.offerPrice > 0) {
                if ($scope.prefClientVerified) {
                    $scope.totalAmount += obj.prefPrice;
                } else {
                    $scope.totalAmount += obj.offerPrice;
                }
                $scope.svcPurchased.push(obj.name);
            }
        });

        /*To remove FinGPS, FinTax or Finsure if selected before FinComprehensive*/
        if ($scope.svcPurchased.length > 1 && $scope.svcPurchased.indexOf("FinComprehensive") != -1) {
            angular.forEach($scope.svcPurchased, function (svc, index) {
                if (svc == "FinGPS" || svc == "FinTax" || svc == "FinSure") {
                    $scope.svcPurchased.splice(index, 1);
                    angular.forEach($scope.fincarts, function (obj, index) {
                        if (obj.selected == true && obj.offerPrice > 0 && obj.name != "FinComprehensive" && obj.name != "FinEstate") {
                            obj.selected = false;
                            finComprehensiveSelected = true;
                        }
                    });
                }
            });
        }

        if (finComprehensiveSelected) {
            toaster.success({body: "Thats indeed a good choice! You save Rs 1000 by combining multiple services."});
        }

        if ($scope.svcPurchased[0] == "FinGPS" && $scope.svcPurchased[1] == "FinTax" && $scope.svcPurchased[2] == "FinSure") {
            $scope.fincarts[5].selected = true;
            $scope.fincarts[1].selected = false;
            $scope.fincarts[2].selected = false;
            $scope.fincarts[3].selected = false;
            selectFinComprehensive = true;
        }

        if (selectFinComprehensive) {
            toaster.success({body: "We have automatically selected FinComprehensive, which saves you Rs 1000 instead of buying these three services                                             independently."});
        }
        return $scope.totalAmount;
    };

    $scope.prefClientModal = function () {
        if ($scope.prefClient) {
            ModalService.showModal({
                templateUrl: "views/PreferredClient.html",
                controller: "subscribeModalController"
                // preClose: (function(modal){ modal.element.modal('hide'); })
            }).then(function (modal) {
                modal.element.modal();
                // modal.element.on('hidden.bs.modal', function () {
                //     // modal.element.remove();
                //     if(!modal.controller.closed){
                //         modal.controller.close();
                //     }
                // });
                modal.close.then(function (result) {
                    if (result) {
                        $scope.showEmail = true;
                    } else {
                        $scope.prefClient = false;
                    }
                });
            });
        }
    };
    $scope.onPrefClientChange = function () {//check if this function is required
        if ($scope.prefClient == false) {
            $http({
                method: 'GET',
                url: window.link.service,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                //$scope.fincarts = response.data;
                angular.forEach(response.data, function (obj, index) {
                    $scope.fincarts[index].offerPrice = obj.offerPrice;
                });
            }, function errorCallback(err) {
                console.log(err);
            });
        }
    };
    $scope.submitEmailInfo = function () {
        data.email = $scope.email;
        if ($scope.showOTP) {
            data.otp = $scope.otp;
            $http({
                method: 'POST',
                url: window.link.pg + "/verifyOTP",
                data: data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                $scope.showOTP = false;
                $scope.showEmail = false;
                toaster.success({body: "OTP Verified"});
                $http({
                    method: 'GET',
                    url: window.link.service + '?client=target',
                    headers: {'x-access-token': window.localStorage.getItem("token")}
                }).then(function successCallback(response) {
                    $scope.showOTP = false;
                    $scope.showEmail = false;
                    $scope.prefClientVerified = true;
                    //$scope.fincarts = response.data;
                    angular.forEach(response.data, function (obj, index) {
                        $scope.fincarts[index].prefPrice = obj.prefPrice;
                    });
                }, function errorCallback(err) {
                    console.log(err);
                });
            }, function errorCallback(err) {
                toaster.error({body:response.data.err});
            });
        }
        if ($scope.showEmail) {

         if(validateEmail($scope.email)) {
                $http({
                    method: 'POST',
                    url: window.link.pg + "/generateOTP",
                    data: data,
                    headers: {'x-access-token': window.localStorage.getItem("token")}
                }).then(function successCallback(response) {
                    $scope.showOTP = true;
                    $scope.showEmail = false;
                    toaster.success({body: "OTP sent to your entered email id"});
                }, function errorCallback(err) {
                    console.log(err);
                });
            } else{
             toaster.error({body: "This email id doesn't belong to a preferred corporate."});
         }

        }
    };

    $scope.checkout = function () {
        var data = {};
        data._userid = getUserId();
        data.svcPurchased = {};
        data.svcPurchased.amount = $scope.totalAmount;
        data.svcPurchased.details = [];

        if ($state.params.service) data.svcPurchased.cookie = $state.params.service;

        angular.forEach($scope.fincarts, function (obj, index) {
            if (obj.selected == true && obj.offerPrice > 0) {
                if ($scope.prefClientVerified) {
                    data.svcPurchased.details.push({
                        name: obj.name,
                        amount: obj.prefPrice,
                        validity: moment().day(obj.validity)
                    });
                } else {
                    data.svcPurchased.details.push({
                        name: obj.name,
                        amount: obj.offerPrice,
                        validity: moment().day(obj.validity)
                    });
                }
            }
        });

        if ($scope.svcPurchased.indexOf("FinGPS") != -1 || $scope.svcPurchased.indexOf("FinTax") != -1 || $scope.svcPurchased.indexOf("FinSure") != -1) {
            ModalService.showModal({
                templateUrl: "views/subscriptionModal.html",
                controller: "subscribeModalController",
                //preClose:   modal.element.modal('hide')
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {
                        $http({
                            method: 'POST',
                            url: window.link.pg,
                            data: data,
                            headers: {'x-access-token': window.localStorage.getItem("token")}
                        }).then(function successCallback(response) {
                            $window.location.href = response.data;
                        }, function errorCallback(err) {
                            console.log(err);
                        });
                    } else {
                        $scope.fincarts[5].selected = true;
                        $scope.fincarts[1].selected = false;
                        $scope.fincarts[2].selected = false;
                        $scope.fincarts[3].selected = false;
                    }
                });
            });
        } else {
            $http({
                method: 'POST',
                url: window.link.pg,
                data: data,
                headers: {'x-access-token': window.localStorage.getItem("token")}
            }).then(function successCallback(response) {
                $window.location.href = response.data;
            }, function errorCallback(err) {
                console.log(err);
            });
        }
    };

    var validateEmail = function (email) {
        var lRet = false;
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (re.test(email)) {
            var idx = email.lastIndexOf('@');
            if (idx > -1 && email.slice(idx+1) === 'target.com') {
                console.log("VALID");
                lRet = true;
            }
        }
        return lRet;
    }
}

function pgResponseController($scope, $state, $stateParams, $http, toaster) {
    $scope.init = function () {
        $scope.trxnSuccess = true;
    };
    if ($stateParams.payment_id && $stateParams.payment_request_id) {
        $http({
            method: 'GET',
            url: window.link.pg + '/' + getUserId() + '?payment_id=' + $stateParams.payment_id + '&payment_request_id=' + $stateParams.payment_request_id,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            //$scope.trxnSuccess = true;
            if (response.data.cookie == "FinTax") {
                $state.go("dashboards.fintaxOptimization");
            } else {
                $state.go("dashboards.payments");
            }
            toaster.success({body: "Transaction Successful"});
        }, function errorCallback(response) {
            $scope.trxnSuccess = false;
            $state.go("dashboards.payments");
        });
    }
}

function transcationHistoryController($scope, $state, $stateParams, $http, $window) {
    $http({
        method: 'GET',
        url: window.link.pg + '/' + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (paymnet) {
            paymnet.createdAt = moment(paymnet.createdAt).format('YYYY-MM-DD');
            paymnet.validity = moment(paymnet.validity).format('YYYY-MM-DD');
        });
        $scope.pg = response.data;
    }, function errorCallback(response) {

    });
}


angular
    .module('finatwork')
    .controller('serviceCartController', serviceCartController)
    .controller('pgResponseController', pgResponseController)
    .controller('transcationHistoryController', transcationHistoryController)
    .controller('subscribeModalController', subscribeModalController);
/*** Created by Nilabh on 26-07-2017.*/

function finGps($scope, $state, $uibModal,fintaxService) {
    $scope.finGpsInfo = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/finGpsGeneralInfoModal.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    $scope.initiateGpsTransaction = function () {
        $state.go("forms.subscription.serviceCart", {service: "FinGPS"});

        //$state.go("dashboards.fintax");
    };
}


angular.module('finatwork')
    .controller('finGps', finGps);


/**
 * Created by Nilabh on 11-03-2017.
 */

function filingModalController($scope, close) {
    $scope.close = function (result) {
        close(result, 500);
    };
}
function finTax($scope, $state, $uibModal, $http, fintaxService,ModalService) {
    $scope.finTaxOptimize = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/fintaxOptimizeFaq.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    $scope.finTaxFiling = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'views/taxReturnFilingFaq.html',
            controller: regModalCtrl,
            windowClass: "animated fadeIn"
        });
    };
    //this code is not working (image click)
    $scope.taxOptimisation = function () {
        $state.go("forms.fintax.houseProperty");
    };
    $scope.currentFinancialYear = currentFinancialYear();
    $scope.prevFinancialYear = prevFinancialYear();

    $scope.taxFiling = function (fiscalYear) {
        if(fiscalYear == $scope.prevFinancialYear){
            $state.go("forms.returnFiling.filingPersonalInfo");
        }else{
            ModalService.showModal({
                templateUrl: "views/filingYear.html",
                controller: "filingModalController"
            }).then(function (modal) {
                modal.element.modal();
                modal.close.then(function (result) {
                    if (result) {
                            console.log(result);
                    } else {
                        console.log(result);
                    }
                });
            });
        }

    };




    $scope.initiateTranscation = function () {
        $state.go("forms.subscription.serviceCart", {service: "FinTax"});

        //$state.go("dashboards.fintax");
    };
    $scope.initiateTrxnFinsure = function () {
        $state.go("forms.subscription.serviceCart", {service: "FinSure"});

        //$state.go("dashboards.fintax");
    };
    $scope.initiateTrxnFinEstate = function (){
        $state.go("forms.subscription.serviceCart", {service: "FinEstate"});
    }
    $scope.initiateTrxnFinGps = function (){
        $state.go("forms.subscription.serviceCart", {service: "FinGPS"});
    }
}


angular.module('finatwork')
    .controller('finTax', finTax)
    .controller('filingModalController', filingModalController);


/**
 * Created by Finatwork on 29-03-2017.
 */
function rentInfoCtrl($scope, $state, fintaxService,convertDigitsIntoWords) {
    $scope.formEditable = true;

    $scope.init = function () {
        fintaxService.getInfo().then(function (response) {
            if (!IsAdmin())formStatus(response.state);
            $scope.rentInfoFormData = response.rent;
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.submitRentInfo = function () {
        fintaxService.setInfo('rent', $scope.rentInfoFormData);
        $state.go("forms.fintax.investment");
    };
    $scope.$watch('rentInfoFormData.rent', function (val) {
        if (val && val > 0) {
            $scope.rentInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.rentInWords = "";
        }
    });
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#rentInfo :input").attr("disabled", true);
            $("#rentInfo :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('rentInfoCtrl', rentInfoCtrl);

/**
 * Created by Finatwork on 31-03-2017.
 */
function invstmntFinTaxCtrl($scope, $state, fintaxService,convertDigitsIntoWords) {

    $scope.finTaxInvestmentFormData = {
        taxSavingFD: 'no',
        taxSavingMF: 'no',
        taxSavingPF: 'no',
        taxSavingNSC: 'no',
        taxSavingLI: 'no',
        taxSavingSSY: 'no',
        taxSavingTutFee: 'no',
        taxSavingNPS: 'no',
        other: 'no'
    };
    $scope.formEditable = true;

    $scope.init = function () {
        fintaxService.getInfo().then(function (response) {
            var currentVal = response.investments;
            if (currentVal) {
                if (!IsAdmin())formStatus(response.state);
                if (currentVal.taxSavingFDAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingFD = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingFDAmt = currentVal.taxSavingFDAmt;
                }
                if (currentVal.taxSavingMFAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingMF = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingMFAmt = currentVal.taxSavingMFAmt;
                }
                if (currentVal.taxSavingPFAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingPF = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingPFAmt = currentVal.taxSavingPFAmt;
                }
                if (currentVal.taxSavingNSCAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingNSC = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingNSCAmt = currentVal.taxSavingNSCAmt;
                }
                if (currentVal.taxSavingLIAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingLI = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingLIAmt = currentVal.taxSavingLIAmt;
                }
                if (currentVal.taxSavingSSYAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingSSY = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingSSYAmt = currentVal.taxSavingSSYAmt;
                }
                if (currentVal.taxSavingTutFeeAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingTutFee = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt = currentVal.taxSavingTutFeeAmt;
                }
                if (currentVal.taxSavingNPSAmt) {
                    $scope.finTaxInvestmentFormData.taxSavingNPS = 'yes';
                    $scope.finTaxInvestmentFormData.taxSavingNPSAmt = currentVal.taxSavingNPSAmt;
                }
                if (currentVal.otherInvst.length) {
                    $scope.finTaxInvestmentFormData.other = 'yes';
                    $scope.finTaxInvestmentFormData.name1 = currentVal.otherInvst[0].name;
                    $scope.finTaxInvestmentFormData.amt1 = currentVal.otherInvst[0].amt;
                    if (typeof(currentVal.otherInvst[1]) != "undefined") {
                        $scope.finTaxInvestmentFormData.name2 = currentVal.otherInvst[1].name;
                        $scope.finTaxInvestmentFormData.amt2 = currentVal.otherInvst[1].amt;
                    }
                    if (typeof(currentVal.otherInvst[2]) != "undefined") {
                        $scope.finTaxInvestmentFormData.name3 = currentVal.otherInvst[2].name;
                        $scope.finTaxInvestmentFormData.amt3 = currentVal.otherInvst[2].amt;
                    }
                }
            }
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.submitInvstmntInfo = function () {
        var investmentInfo = {};
        investmentInfo.otherInvst =[];
        if ($scope.finTaxInvestmentFormData.taxSavingFD == 'yes') {
            investmentInfo.taxSavingFDAmt = $scope.finTaxInvestmentFormData.taxSavingFDAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingMF == 'yes') {
            investmentInfo.taxSavingMFAmt = $scope.finTaxInvestmentFormData.taxSavingMFAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingPF == 'yes') {
            investmentInfo.taxSavingPFAmt = $scope.finTaxInvestmentFormData.taxSavingPFAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingNSC == 'yes') {
            investmentInfo.taxSavingNSCAmt = $scope.finTaxInvestmentFormData.taxSavingNSCAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingLI == 'yes') {
            investmentInfo.taxSavingLIAmt = $scope.finTaxInvestmentFormData.taxSavingLIAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingSSY == 'yes') {
            investmentInfo.taxSavingSSYAmt = $scope.finTaxInvestmentFormData.taxSavingSSYAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingTutFee == 'yes') {
            investmentInfo.taxSavingTutFeeAmt = $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingNPS == 'yes') {
            investmentInfo.taxSavingNPSAmt = $scope.finTaxInvestmentFormData.taxSavingNPSAmt;
        }
        if ($scope.finTaxInvestmentFormData.other == 'yes') {
            if($scope.finTaxInvestmentFormData.name1 && $scope.finTaxInvestmentFormData.amt1) investmentInfo.otherInvst.push({name:$scope.finTaxInvestmentFormData.name1,amt:$scope.finTaxInvestmentFormData.amt1});
            if($scope.finTaxInvestmentFormData.name2 && $scope.finTaxInvestmentFormData.amt2) investmentInfo.otherInvst.push({name:$scope.finTaxInvestmentFormData.name2,amt:$scope.finTaxInvestmentFormData.amt2});
            if($scope.finTaxInvestmentFormData.name3 && $scope.finTaxInvestmentFormData.amt3) investmentInfo.otherInvst.push({name:$scope.finTaxInvestmentFormData.name3,amt:$scope.finTaxInvestmentFormData.amt3})
        }

        fintaxService.setInfo('investments', investmentInfo);
        $state.go("forms.fintax.healthInsurance");
    };
    $scope.$watch('finTaxInvestmentFormData.taxSavingFDAmt', function (val) {
        if (val && val > 0) {
            $scope.taxSavingFDAmtInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.taxSavingFDAmtInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingMFAmt', function (val) {
        if (val && val > 0) {
            $scope.mutualFundAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mutualFundAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingPFAmt', function (val) {
        if (val && val > 0) {
            $scope.ppfAmountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.ppfAmountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingNSCAmt', function (val) {
        if (val && val > 0) {
            $scope.nationalSavingInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.nationalSavingInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingLIAmt', function (val) {
        if (val && val > 0) {
            $scope.licAmountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.licAmountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingSSYAmt', function (val) {
        if (val && val > 0) {
            $scope.sukanyaYojnaAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.sukanyaYojnaAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingTutFeeAmt', function (val) {
        if (val && val > 0) {
            $scope.childFeesAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.childFeesAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingNPSAmt', function (val) {
        if (val && val > 0) {
            $scope.pensionSchemeAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.pensionSchemeAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt1', function (val) {
        if (val && val > 0) {
            $scope.amountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt2', function (val) {
        if (val && val > 0) {
            $scope.amountdesInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountdesInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt3', function (val) {
        if (val && val > 0) {
            $scope.amountOtherInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountOtherInWords = "";
        }
    });

    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#finTaxInvestment :input").attr("disabled", true);
            $("#finTaxInvestment :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('invstmntFinTaxCtrl', invstmntFinTaxCtrl);

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


/**
 * Created by Finatwork on 03-04-2017.
 */
function housePropTaxCtrl($scope, $state, fintaxService, convertDigitsIntoWords) {
    var uid = 1;
    $scope.propertyList = [];
    $scope.AddProp = true;
    // $scope.basicInfo = {};//TODO check if reqd?
    $scope.housePropertyData = {
        houseProp:'no'
    };
    $scope.formEditable = true;

    $scope.init = function () {
        fintaxService.getInfo().then(function (response) {
            if(response != null && response.house != null && response.house.length != 0){
                if (!IsAdmin())formStatus(response.state);
                $scope.propertyList = response.house;
                $scope.AddProp = false;
                $scope.housePropertyData.houseProp = 'yes';
                if ($scope.propertyList.length > 1) {
                    $scope.propertyList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.propertyList[$scope.propertyList.length - 1]._id + 1;
            } else {
                $scope.personalInfoFormData = {};
                fintaxService.getBasicInfo().then(function (response) {
                    $scope.housePropertyData.houseProp = response.houseProp;
                }, function (reason) {
                    console.log(reason);
                });
            }
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.submitFinTaxHouseProp = function () {
        var newProperty = $scope.housePropertyData;
        if($scope.housePropertyData.houseProp == 'yes') {
            if (newProperty._id == null) {
                newProperty._id = ++uid;
                $scope.propertyList.push(newProperty);
            } else {
                for (var i in $scope.propertyList) {
                    if ($scope.propertyList[i]._id == newProperty._id) {
                        $scope.propertyList[i] = newProperty;
                        break;
                    }
                }
            }
        } else {
            // if($scope.basicInfo.houseProp == 'yes') {
            //     $scope.basicInfo.houseProp = 'no';
            //     fintaxService.setBasicInfo($scope.basicInfo);
            // }
            $state.go('forms.fintax.rent');
        }
        $scope.housePropertyData = {};
        $scope.AddProp = false;
    };

    $scope.addProperty = function () {
        $scope.housePropertyData = {};
        $scope.housePropertyData.houseProp = 'yes';
        $scope.AddProp = true;

    };

    $scope.cancelProperty = function () {
        if ($scope.propertyList.length) {
            $scope.AddProp = false;
        } else {
            $state.go('forms.fintax.rent');
        }
    };

    $scope.submitHouseProp = function () {
        fintaxService.setInfo('house', $scope.propertyList);
        $state.go('forms.fintax.rent');
    };

    $scope.delete = function (id) {
        if($scope.formEditable) {
            for (var i in $scope.propertyList) {
                if ($scope.propertyList[i]._id == id) {
                    $scope.propertyList.splice(i, 1);
                    $scope.housePropertyData = {};
                    break;
                }
            }
        }
    };

    $scope.edit = function (id) {
        if($scope.formEditable) {
            for (var i in $scope.propertyList) {
                if ($scope.propertyList[i]._id == id) {
                    $scope.housePropertyData = angular.copy($scope.propertyList[i]);
                    $scope.housePropertyData.houseProp = 'yes';
                    break;
                }
            }
            $scope.AddProp = true;
        }
    };
    $scope.$watch('housePropertyData.coOwnerShare', function (val) {
        if (val && val > 0) {
            $scope.coOwnerShareInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.coOwnerShareInWords = "";
        }
    });
    $scope.$watch('housePropertyData.loanAmt', function (val) {
        if (val && val > 0) {
            $scope.loanAmtInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.loanAmtInWords = "";
        }
    });
    $scope.$watch('housePropertyData.ROI', function (val) {
        if (val && val > 0) {
            $scope.ROIInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.ROIInWords = "";
        }
    });
    $scope.$watch('housePropertyData.EMI', function (val) {
        if (val && val > 0) {
            $scope.EMIInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.EMIInWords = "";
        }
    });
    $scope.$watch('housePropertyData.loanPending', function (val) {
        if (val && val > 0) {
            $scope.loanPendingInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.loanPendingInWords = "";
        }
    });
    $scope.$watch('housePropertyData.propTax', function (val) {
        if (val && val > 0) {
            $scope.propTaxInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.propTaxInWords = "";
        }
    });
    $scope.$watch('housePropertyData.rent', function (val) {
        if (val && val > 0) {
            $scope.rentInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.rentInWords = "";
        }
    });
    $scope.housePropUI = function (type) {
        var display = {
            'selfOccupied':'Self occupied',
            'rented': 'Rented',
            'underConstruction': 'Under construction'
        };
        return display[type];
    };

    /*Usage of service, will be used later*/
    /*$scope.$on('updated', function(event, args){
        if(event.name == 'updated') {
            console.log("Updated")
            // formStatus();
        }
    });*/

    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#housePropertyRelated :input").attr("disabled", true);
            $("#housePropertyRelated :submit").attr("disabled", true);
        }
    }

}
angular.module('finatwork').controller('housePropTaxCtrl', housePropTaxCtrl);

/**
 * Created by Finatwork on 03-04-2017.
 */
function basicInfoTaxCtrl($scope, $state, fintaxService) {
    $scope.init = function () {
        fintaxService.getBasicInfo('finTax').then(function (response) {
            if(response != null){
                $scope.basicInfoTaxFormData = response;
            } else {
                console.log('basicInfo empty');
            }
        }, function(reason){
            console.log(reason);
        });
    };

    $scope.finTaxBasicInfo = function () {
        fintaxService.setBasicInfo($scope.basicInfoTaxFormData);
        $state.go('dashboards.fintax');
    };
}
angular.module('finatwork').controller('basicInfoTaxCtrl', basicInfoTaxCtrl);

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

/**
 * Created by Suraj on 12-May-17.
 */

function trxnStatusCtrl($scope, $http) {
    $scope.gridOptions1 = {};
    //     expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
    //     expandableRowHeight: 150,
    //     onRegisterApi: function (gridApi) {
    //         gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
    //             if (row.isExpanded && (row.entity.status === "processing")) {
    //                 row.entity.subGridOptions = {
    //                     columnDefs: [
    //                         {name: 'Scheme Name', "field": "_schemeId"},
    //                         {name: 'Status', "field": "status"}
    //                     ]
    //                 };
    //                 $http({
    //                     method: 'GET',
    //                     url: window.link.goalFunds + "/" + row.entity._goalid,
    //                     headers: {'x-access-token': window.localStorage.getItem('token')}
    //                 }).then(function successCallback(response) {
    //                     row.entity.subGridOptions.data = response.data;
    //                 }, function errorCallback(response) {
    //                     console.log(response);
    //                 });
    //             }
    //         });
    //     }
    // };

    $scope.gridOptions1.showGridFooter = true;
    $scope.gridOptions1.enableFiltering = true;
    $scope.gridOptions1.columnDefs = [
        {name: 'Name', "field": "bank[0].acctName", pinnedLeft: true},
        {name: 'SIP', "field": "sip", enableFiltering: false},
        {name: 'Lumpsum', "field": "lumpsum", enableFiltering: false},
        {name: 'Goal', "field": "_goalid"},
        {name: 'Scheme', "field": "scheme"},
        {name: 'Sip Date', "field": "fromDate", enableFiltering: false,cellFilter: 'date', type: 'date'},
        {name: 'Order Date', "field": "orderDate", enableFiltering: false,cellFilter: 'date', type: 'date'}
    ];
    $http({
        method: 'GET',
        url: window.link.fundStatus,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].scheme = getSchemeName(response.data[i]._schemeId);
            if (response.data[i].fromDate) response.data[i].fromDate = moment(response.data[i].fromDate).format('DD-MMM-YYYY');
        }
        $scope.gridOptions1.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('trxnStatusCtrl', trxnStatusCtrl);

/*** Created by Nilabh on 14-07-2017.*/

function goalStatusCtrl($scope, $http) {
    $scope.gridOptions1 = {};
    $scope.gridOptions1.enableFiltering = true;
    $scope.gridOptions1.columnDefs = [
        {name: 'Name', "field": "bank[0].acctName", width: '20%', pinnedLeft: true},
        {name: 'Type', "field": "type", width: '15%', enableFiltering: false},
        {name: 'Last Update', "field": "updatedAt", width: '15%', enableFiltering: false},
        {name: 'Reason', "field": "trxnFailureReason[0]", width: '*', enableFiltering: false}
    ];
    $http({
        method: 'GET',
        url: window.link.goalStatus,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].updatedAt = moment(response.data[i].updatedAt).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions1.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}
angular.module('finatwork').controller('goalStatusCtrl', goalStatusCtrl);

/* Created by Nilabh on 22-06-2017.*/
function advisorController($scope, $state, $http) {
    $scope.assignedPersonal = [
        {
            designation: "ADVISOR",
            name: "Finatwork Intelligent",
            phone: "(080) 41227738",
            email: "intelligent.choice@finatwork.com",
            src : "/assets/img/user.jpg"
        },
        {
            designation: "OPERATIONS",
            name: "Megha Patil",
            phone: "(080) 41227738",
            email: "operations@finatwork.com ",
            src :"/assets/img/megha.jpg"
        },
        {
            designation: "GRIEVANCES",
            name: "Saurabh Bansal",
            phone: "(080) 41227738",
            email: "grievance.redressal@finatwork.com",
            src : "/assets/img/user.jpg"
        }
    ];

    $scope.init = function () {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var src;
            if (response.data.advisor) {
                $scope.assignedPersonal[0].name = response.data.advisorName;
                $scope.assignedPersonal[0].email = response.data.advisorEmail;
                switch (response.data.advisor) {
                    case 'Subhajit':
                        src = "/assets/img/subhojeet_mandal.jpg";
                        break;
                    case 'Megha':
                        src = "/assets/img/megha.jpg";
                        break;
                    case 'Neeti':
                        src = "/assets/img/neeti_trivedi.jpg";
                        break;
                    case 'Saurabh':
                        src = "/assets/img/saurabh_bansal.jpg";
                        break;
                }
                $scope.assignedPersonal[0].src = src;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
}
angular.module('finatwork').controller('advisorController', advisorController);

/**
 * Created by Nilabh on 19-04-2017.
 */
function filingPersonalInfoCtrl($scope, $state, fintaxFilingService, convertDigitsIntoWords, toaster) {
    $scope.formEditable = true;
    $scope.init = function () {
        fintaxFilingService.getInfo().then(function (response) {
            if (response != null) {
                if (!IsAdmin())formStatus(response.state);
            }
        }, function () {
            console.log(reason);
        });
        fintaxFilingService.getPersonalInfo().then(function (response) {
            if(response != null){
                $scope.personalInfoFormData = response;
            } else {
                $scope.personalInfoFormData = {};
            }
        }, function(reason){
            console.log(reason);
        });
    };
    $scope.submitPersonalInfo = function () {
        fintaxFilingService.setPersonalInfo($scope.personalInfoFormData);//should be via promise
        toaster.success({body: "Personal Information saved"});
    };
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingPersonalInfo :input").attr("disabled", true);
            $("#filingPersonalInfo :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingPersonalInfoCtrl', filingPersonalInfoCtrl);
function filingBankInfoCtrl($scope, $state, fintaxFilingService, convertDigitsIntoWords, toaster) {
    $scope.formEditable = true;
    $scope.init = function () {
        fintaxFilingService.getInfo().then(function (response) {
            if (response != null) {
                if (!IsAdmin())formStatus(response.state);
            }
        }, function () {
            console.log(reason);
        });
        fintaxFilingService.getBankInfo().then(function (response) {
            if (response.length != 0) {
                $scope.bankList = response;
            } else {
                $scope.bankList = [
                    {
                        _id: 0,
                        ifsc_code: '',
                        account_number: '',
                        account_type: ''
                    }
                ];
            }
        }, function (reason) {
            console.log(reason);
        });

    };
    $scope.addBankInfo = function (bank) {
        var tmp = {"_id": 0, "ifsc_code": '', "account_number": '', "account_type": ''};
        tmp._id = bank._id + 1;
        $scope.bankList.push(tmp);
        //$scope.oneAtATime = true;
    };
    $scope.submitBankInfo = function () {
        fintaxFilingService.setBankInfo($scope.bankList);
        $state.go('forms.returnFiling.filingSalary');
        toaster.success({body: "Bank Information saved"});
    };

    $scope.deleteBank = function (index) {
                $scope.bankList.splice(index, 1);
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingBankInfo :input").attr("disabled", true);
            $("#filingBankInfo :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingBankInfoCtrl', filingBankInfoCtrl);
/**
 * Created by Finatwork on 22-04-2017.
 */
/**
 * Created by Nilabh on 19-04-2017.
 */
function filingInvestmentCtrl($scope, $state, fintaxFilingService, fintaxService, convertDigitsIntoWords) {
    $scope.finTaxInvestmentFormData = {
        taxSavingFD: 'no',
        taxSavingMF: 'no',
        taxSavingPF: 'no',
        taxSavingNSC: 'no',
        taxSavingLI: 'no',
        taxSavingSSY: 'no',
        taxSavingTutFee: 'no',
        taxSavingNPS: 'no',
        other: 'no'
    };
    $scope.formEditable = true;
    $scope.investmentInfoAvailable = false;
    $scope.init = function () {
        fintaxFilingService.getInfo('investments').then(function (response) {
            if (response != null) {
                if (!IsAdmin()) formStatus(response.state);
                if ($scope.formEditable) {
                    fintaxService.getInfo().then(function (response) {
                    if (response != null && response.investments != null) {
                        $scope.investmentInfoAvailable = true;
                        $scope.investmentInfoOpt = response.investments;
                    } else {
                        console.log(response)
                    }
                })
            }
                $scope.investmentInfo = response.investments;
                if ($scope.investmentInfo) populateInvestmentInfo()
            } else {
                console.log("Investment empty");
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.copyOptimization = function () {
        $scope.investmentInfo = $scope.investmentInfoOpt;
        if ($scope.investmentInfo) populateInvestmentInfo()
    };
    $scope.submitInvstmnt = function () {
        var investmentInfo = {};
        investmentInfo.otherInvst = [];
        if ($scope.finTaxInvestmentFormData.taxSavingFD == 'yes') {
            investmentInfo.taxSavingFDAmt = $scope.finTaxInvestmentFormData.taxSavingFDAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingMF == 'yes') {
            investmentInfo.taxSavingMFAmt = $scope.finTaxInvestmentFormData.taxSavingMFAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingPF == 'yes') {
            investmentInfo.taxSavingPFAmt = $scope.finTaxInvestmentFormData.taxSavingPFAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingNSC == 'yes') {
            investmentInfo.taxSavingNSCAmt = $scope.finTaxInvestmentFormData.taxSavingNSCAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingLI == 'yes') {
            investmentInfo.taxSavingLIAmt = $scope.finTaxInvestmentFormData.taxSavingLIAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingSSY == 'yes') {
            investmentInfo.taxSavingSSYAmt = $scope.finTaxInvestmentFormData.taxSavingSSYAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingTutFee == 'yes') {
            investmentInfo.taxSavingTutFeeAmt = $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt;
        }
        if ($scope.finTaxInvestmentFormData.taxSavingNPS == 'yes') {
            investmentInfo.taxSavingNPSAmt = $scope.finTaxInvestmentFormData.taxSavingNPSAmt;
        }
        if ($scope.finTaxInvestmentFormData.other == 'yes') {
            if ($scope.finTaxInvestmentFormData.name1 && $scope.finTaxInvestmentFormData.amt1) investmentInfo.otherInvst.push({
                name: $scope.finTaxInvestmentFormData.name1,
                amt: $scope.finTaxInvestmentFormData.amt1
            });
            if ($scope.finTaxInvestmentFormData.name2 && $scope.finTaxInvestmentFormData.amt2) investmentInfo.otherInvst.push({
                name: $scope.finTaxInvestmentFormData.name2,
                amt: $scope.finTaxInvestmentFormData.amt2
            });
            if ($scope.finTaxInvestmentFormData.name3 && $scope.finTaxInvestmentFormData.amt3) investmentInfo.otherInvst.push({
                name: $scope.finTaxInvestmentFormData.name3,
                amt: $scope.finTaxInvestmentFormData.amt3
            })
        }
        fintaxFilingService.setInfo('investments', investmentInfo);
        $state.go("forms.returnFiling.filingHealthInsurance");
    };
    $scope.$watch('finTaxInvestmentFormData.taxSavingFDAmt', function (val) {
        if (val && val > 0) {
            $scope.taxSavingFDAmtInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.taxSavingFDAmtInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingMFAmt', function (val) {
        if (val && val > 0) {
            $scope.mutualFundAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.mutualFundAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingPFAmt', function (val) {
        if (val && val > 0) {
            $scope.ppfAmountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.ppfAmountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingNSCAmt', function (val) {
        if (val && val > 0) {
            $scope.nationalSavingInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.nationalSavingInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingLIAmt', function (val) {
        if (val && val > 0) {
            $scope.licAmountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.licAmountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingSSYAmt', function (val) {
        if (val && val > 0) {
            $scope.sukanyaYojnaAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.sukanyaYojnaAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingTutFeeAmt', function (val) {
        if (val && val > 0) {
            $scope.childFeesAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.childFeesAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.taxSavingNPSAmt', function (val) {
        if (val && val > 0) {
            $scope.pensionSchemeAmntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.pensionSchemeAmntInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt1', function (val) {
        if (val && val > 0) {
            $scope.amountInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt2', function (val) {
        if (val && val > 0) {
            $scope.amountdesInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountdesInWords = "";
        }
    });
    $scope.$watch('finTaxInvestmentFormData.amt3', function (val) {
        if (val && val > 0) {
            $scope.amountOtherInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.amountOtherInWords = "";
        }
    });
    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#filingInvestment :input").attr("disabled", true);
            $("#filingInvestment :submit").attr("disabled", true);
        }
    }

    function populateInvestmentInfo() {
        if ($scope.investmentInfo.taxSavingFDAmt) {
            $scope.finTaxInvestmentFormData.taxSavingFD = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingFDAmt = $scope.investmentInfo.taxSavingFDAmt;
        }
        if ($scope.investmentInfo.taxSavingMFAmt) {
            $scope.finTaxInvestmentFormData.taxSavingMF = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingMFAmt = $scope.investmentInfo.taxSavingMFAmt;
        }
        if ($scope.investmentInfo.taxSavingPFAmt) {
            $scope.finTaxInvestmentFormData.taxSavingPF = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingPFAmt = $scope.investmentInfo.taxSavingPFAmt;
        }
        if ($scope.investmentInfo.taxSavingNSCAmt) {
            $scope.finTaxInvestmentFormData.taxSavingNSC = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingNSCAmt = $scope.investmentInfo.taxSavingNSCAmt;
        }
        if ($scope.investmentInfo.taxSavingLIAmt) {
            $scope.finTaxInvestmentFormData.taxSavingLI = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingLIAmt = $scope.investmentInfo.taxSavingLIAmt;
        }
        if ($scope.investmentInfo.taxSavingSSYAmt) {
            $scope.finTaxInvestmentFormData.taxSavingSSY = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingSSYAmt = $scope.investmentInfo.taxSavingSSYAmt;
        }
        if ($scope.investmentInfo.taxSavingTutFeeAmt) {
            $scope.finTaxInvestmentFormData.taxSavingTutFee = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingTutFeeAmt = $scope.investmentInfo.taxSavingTutFeeAmt;
        }
        if ($scope.investmentInfo.taxSavingNPSAmt) {
            $scope.finTaxInvestmentFormData.taxSavingNPS = 'yes';
            $scope.finTaxInvestmentFormData.taxSavingNPSAmt = $scope.investmentInfo.taxSavingNPSAmt;
        }
        if ($scope.investmentInfo.otherInvst.length) {
            $scope.finTaxInvestmentFormData.other = 'yes';
            $scope.finTaxInvestmentFormData.name1 = $scope.investmentInfo.otherInvst[0].name;
            $scope.finTaxInvestmentFormData.amt1 = $scope.investmentInfo.otherInvst[0].amt;
            if (typeof($scope.investmentInfo.otherInvst[1]) != "undefined") {
                $scope.finTaxInvestmentFormData.name2 = $scope.investmentInfo.otherInvst[1].name;
                $scope.finTaxInvestmentFormData.amt2 = $scope.investmentInfo.otherInvst[1].amt;
            }
            if (typeof($scope.investmentInfo.otherInvst[2]) != "undefined") {
                $scope.finTaxInvestmentFormData.name3 = $scope.investmentInfo.otherInvst[2].name;
                $scope.finTaxInvestmentFormData.amt3 = $scope.investmentInfo.otherInvst[2].amt;
            }
        }
    }
}
angular.module('finatwork').controller('filingInvestmentCtrl', filingInvestmentCtrl);
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
/**
 * Created by Finatwork on 04-05-2017.
 */
function filingHouseCtrl($scope, $state, fintaxFilingService,fintaxService,convertDigitsIntoWords) {
    var uid = 1;
    $scope.propertyList = [];
    $scope.AddProp = true;
    // $scope.basicInfo = {};//TODO check if reqd?
    $scope.housePropertyData = {//TODO remove if not required
        houseProp:'no',
        coOwned :'no',
        loan :'no',
        prePossInterest :'no'
    };
    $scope.formEditable = true;

    $scope.init = function () {
        fintaxFilingService.getInfo('house').then(function (response) {
            if (response != null && response.house != null && response.house.length != 0) {/*response.house.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.propertyList = response.house;
                $scope.AddProp = false;
                $scope.housePropertyData.houseProp = 'yes';
                if ($scope.propertyList.length > 1) {
                    $scope.propertyList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.propertyList[$scope.propertyList.length - 1]._id + 1;
            } else {
                $scope.personalInfoFormData = {};
                fintaxService.getBasicInfo().then(function (response) {
                    $scope.housePropertyData.houseProp = response.houseProp;
                }, function (reason) {
                    console.log(reason);
                });
            }
        }, function (reason) {
            console.log(reason);
        });
    };


    $scope.submitFinTaxHouseProp = function () {
        var newProperty = $scope.housePropertyData;
        if($scope.housePropertyData.houseProp == 'yes') {
            if (newProperty._id == null) {
                newProperty._id = ++uid;
                $scope.propertyList.push(newProperty);
            } else {
                for (var i in $scope.propertyList) {
                    if ($scope.propertyList[i]._id == newProperty._id) {
                        $scope.propertyList[i] = newProperty;
                        break;
                    }
                }
            }
        } else {
            /*Don't change basic based on Optimization or Filing*/
            // if($scope.basicInfo.houseProp == 'yes') {
            //     $scope.basicInfo.houseProp = 'no';
            //     fintaxService.setBasicInfo($scope.basicInfo);
            // }
            $state.go('forms.returnFiling.filingCapitalGains');
        }
        $scope.housePropertyData = {};
        $scope.AddProp = false;
    };

    $scope.addProperty = function () {
        $scope.housePropertyData = {};
        $scope.housePropertyData.houseProp = 'yes';
        $scope.AddProp = true;

    };

    $scope.cancelProperty = function () {
        if ($scope.propertyList.length) {
            $scope.AddProp = false;
        } else {
            $state.go('forms.returnFiling.filingCapitalGains');
        }
    };

    $scope.submitHouseProp = function () {
        fintaxFilingService.setInfo('house', $scope.propertyList);
        $state.go('forms.returnFiling.filingCapitalGains');

    };

    $scope.delete = function (id) {
        if($scope.formEditable) {
            for (var i in $scope.propertyList) {
                if ($scope.propertyList[i]._id == id) {
                    $scope.propertyList.splice(i, 1);
                    $scope.housePropertyData = {};
                    break;
                }
            }
        }
    };

    $scope.edit = function (id) {
        if($scope.formEditable) {
            for (var i in $scope.propertyList) {
                if ($scope.propertyList[i]._id == id) {
                    $scope.housePropertyData = angular.copy($scope.propertyList[i]);
                    $scope.housePropertyData.houseProp = 'yes';
                    break;
                }
            }
            $scope.AddProp = true;
        }
    };

    $scope.$watch('housePropertyData.loanInterest', function (val) {
        if (val && val > 0) {
            $scope.loanIntInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.loanIntInWords = "";
        }
    });

    $scope.$watch('housePropertyData.prePossInterest', function (val) {
        if (val && val > 0) {
            $scope.prePossInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.prePossInWords = "";
        }
    });

    $scope.$watch('filingHouseProperty.coOwnerShare', function (val) {
        if (val && val > 0) {
            $scope.shareInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.shareInWords = "";
        }
    });

    $scope.$watch('housePropertyData.rent', function (val) {
        if (val && val > 0) {
            $scope.rentInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.rentInWords = "";
        }
    });

    $scope.$watch('housePropertyData.propTax', function (val) {
        if (val && val > 0) {
            $scope.annualRentInWords = convertDigitsIntoWords.inWords(val);
        } else {
            $scope.annualRentInWords = "";
        }
    });

    $scope.housePropUI = function (type) {
        var display = {
            'selfOccupied':'Self occupied',
            'rented': 'Rented',
            'deemedLetOut': 'Deemed Let Out'
        };
        return display[type];
    };

    function formStatus(state) {
        if(state == 'infoProvided'){
            $scope.formEditable = false;
        }
        if (!$scope.formEditable) {
            $("#housePropertyRelated :input").attr("disabled", true);
            $("#housePropertyRelated :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('filingHouseCtrl', filingHouseCtrl);


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


/**
 * Created by Nilabh on 28-07-2017.
 */
function finGpsPersonalInfoCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.relationshiplist = ["Father", "Mother", "Wife", "Husband", "Son", "Daughter", "Father-in-law",
        "Mother-in-law", "Son-in- law", "Daughter-in-law", "Aunt", "Uncle", "Niece", "Nephew", "Brother",
        "Sister", "Grand Father", "Grand Mother", "Others"];
    $scope.commentBox = false;
    $scope.noOfChildren = 0;
    $scope.financiallyDependents = 0;
    $scope.children = [];

    $scope.init = function () {
        finGpsService.getInfo().then(function (response) {
            if (response != null && response.personal != null) {
                var children = response.personal.children;
                var dependents = response.personal.dependents;
                $scope.is_married = response.personal.is_married;
                $scope.spouse_name = response.personal.spouse_name;
                $scope.spouse_age = response.personal.spouse_age;
                $scope.noOfChildren = children.length;
                $scope.children = children;
                $scope.financiallyDependents = dependents.length;
                $scope.financiallyDependencyArray = dependents;
                $scope.userComment = response.personal.comment;
            } else {
                finGpsService.getBasicInfo().then(function (response) {
                    var tmp = {"_id": 0, "name": '', "gender": '', "dob": '', "dependents": 'yes'};
                    var tmp1 = {"_id": 0, "name": '', "relation": '', "age": ''};
                    $scope.is_married = response.is_married;
                    $scope.spouse_age = response.spouse_age;
                    $scope.noOfChildren = response.children;
                    $scope.financiallyDependents = response.dependents;
                    for (i = 0; i < response.children; i++) {
                        $scope.children.push(tmp);
                    }
                    for (i = 0; i < response.dependents; i++) {
                        $scope.financiallyDependencyArray.push(tmp1);
                    }
                }, function (reason) {
                    console.log(reason);
                });
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.offSpringIncrement = function (child) {
        var tmp = {
            "_id": 0,
            "name": '',
            "gender": '',
            "dob": '',
            "dependents": 'yes'
        };
        if ($scope.noOfChildren === 0) {
            $scope.children = [];
        } else if ($scope.children.length === $scope.noOfChildren) {
            //no action
        } else {
            $scope.children = [];
            for (var i = 0; i < $scope.noOfChildren; i++) {
                tmp._id = i;
                $scope.children.push(tmp);
            }
        }
    };
    $scope.financiallyDependencyArray = [];
    $scope.dependentPerson = function () {
        var tmp = {
            "_id": 0,
            "name": '',
            "relation": '',
            "age": ''
        };
        if ($scope.financiallyDependents === 0) {
            $scope.financiallyDependencyArray = [];
        } else if ($scope.financiallyDependencyArray.length === $scope.financiallyDependents) {
            //no action
        } else {
            $scope.financiallyDependencyArray = ($scope.financiallyDependencyArray.length > 0) ? $scope.financiallyDependencyArray : [];
            for (var i = 0; i < $scope.financiallyDependents; i++) {
                tmp._id = i;
                $scope.financiallyDependencyArray.push(tmp);
            }
        }
    };
    $scope.submitPersonalInfo = function () {
        var data = {
            _userid: getUserId(),
            is_married: $scope.is_married,
            spouse_name: $scope.spouse_name,
            spouse_age: $scope.spouse_age,
            noOfChildren: $scope.noOfChildren,
            children: $scope.children,
            dependents: $scope.financiallyDependencyArray,
            comment: $scope.userComment
        };
        finGpsService.setInfo('personal', data);
        $state.go('forms.finGps.personal&Work.work');
    }
}

angular.module('finatwork').controller('finGpsPersonalInfoCtrl', finGpsPersonalInfoCtrl);


/*** Created by Nilabh on 11-08-2017.*/
function finGpsImpGoalsCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.finGpsRetirementGoals = {};
    $scope.finGpsContingencyGoals = {};
    $scope.childrenDetailsList = [
        {
            _id: 0,
            offspring: '',
            category: '',
            startYear: '',
            endYear: '',
            amount: '',
            priority: ''
        }
    ];

    $scope.init = function () {
        finGpsService.getInfo().then(function (response) {
            if (response != null && response.importantGoals != null && response.importantGoals.retirementAge != null) {
                $scope.finGpsRetirementGoals = response.importantGoals;
                $scope.finGpsContingencyGoals.contingencyFund = response.importantGoals.contingencyFund;
                $scope.finGpsContingencyGoals.contingencyComment = response.importantGoals.contingencyComment;
            } else {
                $scope.finGpsRetirementGoals.retirementAge = 60;
                $scope.finGpsRetirementGoals.lifestyleChange = "same";
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.addOffspring = function (childrenDetails) {
        var tmp = {
            "_id": 0,
            "offspring": '',
            "category": '',
            "startYear": '',
            "endYear": '',
            "amount": '',
            "priority": ''
        };
        tmp._id = childrenDetails._id + 1;
        $scope.childrenDetailsList.push(tmp);
    };
    $scope.deleteOffspring = function (index) {
        $scope.childrenDetailsList.splice(index, 1);
    };
    $scope.submit = function () {
        var finGpsRetirementGoals = {
            retirementAge: $scope.finGpsRetirementGoals.retirementAge,
            lifestyleChange: $scope.finGpsRetirementGoals.lifestyleChange,
            retirementComment: $scope.finGpsRetirementGoals.retirementComment
        };
        finGpsService.setInfo('importantGoals', finGpsRetirementGoals);
        // $state.go('forms.finGps.goal.additionalGoal');
    };
    $scope.submitContingencyGoal = function () {
        var finGpsContingencyGoals = {
            retirementAge: $scope.finGpsRetirementGoals.retirementAge,
            lifestyleChange: $scope.finGpsRetirementGoals.lifestyleChange,
            retirementComment: $scope.finGpsRetirementGoals.retirementComment,
            contingencyFund: $scope.finGpsContingencyGoals.contingencyFund,
            contingencyComment: $scope.finGpsContingencyGoals.contingencyComment
        };
        finGpsService.setInfo('importantGoals', finGpsContingencyGoals);
        // $state.go('forms.finGps.goal.additionalGoal');
    };
}
angular.module('finatwork').controller('finGpsImpGoalsCtrl', finGpsImpGoalsCtrl);

/**Created by Nilabh on 07-08-2017.**/
function finGpsGoalsCtrl($scope, $state, toaster, $http) {
    $scope.init = function () {
        loadGoalType();
    };
    var loadGoalType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.goalType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.goalTypeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.additionalGoalList = [
        {
            _id: 0,
            goalType: '',
            goalName: '',
            targetYear: '',
            amount: '',
            priority: ''
        }
    ];
    $scope.addAdditionalGoal = function (goal) {
        var tmp = {"_id": 0, "goalType": '', "goalName": '', "targetYear": '', "amount": '', "priority": ''};
        tmp._id = goal._id + 1;
        $scope.additionalGoalList.push(tmp);
    };
    $scope.deleteAdditionalGoal = function (index) {
        $scope.additionalGoalList.splice(index, 1);
    };
    $scope.gridOptions1 = {};
    $scope.gridOptions1.columnDefs = [
        {name: 'Goal Type', "field": "type", width: '20%', pinnedLeft: true},
        {name: 'Goal Year', "field": "maturity", width: '15%'},
        {name: 'Goal Future Value', "field": "futurePrice", width: '15%'},
        {name: 'Amount Committed', "field": "lumpsum", width: '*'},
        {name: 'Goal Achieved', "field": "marketValue", width: '*'},
        {name: 'Any Modification', "field": "type", width: '*'}
    ];
    $http({
        method: 'GET',
        url: window.link.create_goal + "?state=active"  + "&view=goal&userid=" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        $scope.gridOptions1.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });

}
angular.module('finatwork').controller('finGpsGoalsCtrl', finGpsGoalsCtrl);

/**
 * Created by Nilabh on 01-08-2017.
 */
function finGpsWorkCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.commentBox = false;
    $scope.isSpouseContribution = false;
    $scope.finGpsWorkFormData = {};
    $scope.init = function () {
        loadOccupationList();
        finGpsService.getInfo().then(function (response) {
            if (response != null && response.work != null) {
                $scope.finGpsWorkFormData = response.work;
                if (response.personal.is_married === "married" && response.work.spouseCategory != null && response.work.spouseCategory != undefined) {
                    $scope.finGpsWorkFormData.spouseContribution = "yes"
                } else {
                    $scope.finGpsWorkFormData.spouseContribution = "no"
                }
            } else {
                finGpsService.getInfo().then(function (response) {
                    $scope.finGpsWorkFormData = {};
                    if (response.personal.is_married === "married") {
                        $scope.isSpouseContribution = true;
                    }
                })
            }
        }, function (reason) {
            console.log(reason);
        });
    };

    $scope.submit = function () {
        var finGpsWorkFormData = {
            category: $scope.finGpsWorkFormData.category,
            spouseCategory: $scope.finGpsWorkFormData.spouseCategory,
            organisation: $scope.finGpsWorkFormData.organisation,
            spouseOrganisation: $scope.finGpsWorkFormData.spouseOrganisation,
            designation: $scope.finGpsWorkFormData.designation,
            spouseDesignation: $scope.finGpsWorkFormData.spouseDesignation,
            workingPeriod: $scope.finGpsWorkFormData.workingPeriod,
            spouseWorkingPeriod: $scope.finGpsWorkFormData.spouseWorkingPeriod,
            comment: $scope.finGpsWorkFormData.comment
        };
        finGpsService.setInfo('work', finGpsWorkFormData);
        $state.go('forms.finGps.goal.existingGoal');
    };
    var loadOccupationList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.occupation
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.occupationList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
        $scope.otherOccupation = false;
    };
    $scope.showCommentBox = function () {
        $scope.commentBox = true; //No need of cunction-later will be removed
    };
}
angular.module('finatwork').controller('finGpsWorkCtrl', finGpsWorkCtrl);
/*** Created by Nilabh on 14-08-2017.*/
function finGpsIncomeCtrl($scope, $http, convertDigitsIntoWords) {
    $scope.otherSource = 'no';
    $scope.init = function () {
        loadIncomeInfo();
        otherSrcIncome();
    };
    var loadIncomeInfo = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.incomeInfo
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.incomeInfoList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var otherSrcIncome = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.otherIncomeSource
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.otherSrcIncomeList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.otherSrcInfoList = [{
        _id: 0,
        category: '',
        annualIncome: '',
        earner: ''
    }];
    $scope.addOtherIncomeSrc = function (otherSrc) {
        var tmp = {"_id": 0, "category": '', "annualIncome": '', "earner": ''};
        tmp._id = otherSrc._id + 1;
        $scope.otherSrcInfoList.push(tmp);
    };
    $scope.deleteOtherIncomeSrc = function (index) {
        $scope.otherSrcInfoList.splice(index, 1);
    };
    $scope.incomeList = [{
        _id: 0,
        category: '',
        selfIncome: '',
        spouseIncome: '',
        frequency: ''
    }];
    $scope.addIncomeGoal = function (income) {
        var tmp = {"_id": 0, "category": '', "annualIncome": '', "earner": ''};
        tmp._id = income._id + 1;
        $scope.incomeList.push(tmp);
    };
    $scope.deleteIncomeGoal = function (index) {
        $scope.incomeList.splice(index, 1);
    };

}
angular.module('finatwork').controller('finGpsIncomeCtrl', finGpsIncomeCtrl);
/*** Created by Nilabh on 17-08-2017.*/
function finGpsExpensesCtrl($scope, convertDigitsIntoWords) {
    $scope.additionalParticularList = [{
        _id: 0,
        additionalParticular: "",
        addParticularAmount: '',
        addParticularCycle: ''
    }];
    $scope.addParticularExpenses = function(particular){
       var tmp = {"_id":0,"additionalParticular":'',"addParticularAmount":'',"addParticularCycle":''};
       tmp._id=particular._id + 1;
        $scope.additionalParticularList.push(tmp);
    };
    $scope.delParticularExpenses = function(index){
        $scope.additionalParticularList.splice(index, 1)
    };
    //Lifestyle Expenses
    $scope.lifeStyleList = [{
        _id: 0,
        additionalParticular: "",
        addParticularAmount: '',
        addParticularCycle: ''
    }];
    $scope.addLifeStyleExpenses = function(lifeStyle){
        var tmp = {"_id":0,"additionalParticular":'',"addParticularAmount":'',"addParticularCycle":''};
        tmp._id = lifeStyle._id + 1;
        $scope.lifeStyleList.push(tmp);
    };
    $scope.delLifeStyleExpenses = function(index){
        $scope.lifeStyleList.splice(index, 1)
    };
    //Loan Expenses
    $scope.loanServicingList = [{
        _id: 0,
        additionalParticular: "",
        addParticularAmount: '',
        addParticularCycle: ''
    }];
    $scope.addLoanServiceExpenses = function(loanService){
        var tmp = {"_id":0,"additionalParticular":'',"addParticularAmount":'',"addParticularCycle":''};
        tmp._id = loanService._id + 1;
        $scope.loanServicingList.push(tmp);
    };
    $scope.delLoanServiceExpenses = function(index){
        $scope.loanServicingList.splice(index, 1)
    };
    //Dependency Expenses
    $scope.dependentExpensesList = [{
        _id: 0,
        additionalParticular: "",
        addParticularAmount: '',
        addParticularCycle: ''
    }];
    $scope.addDependentExpensesList = function(dependentExpenses){
        var tmp = {"_id":0,"additionalParticular":'',"addParticularAmount":'',"addParticularCycle":''};
        tmp._id = dependentExpenses._id + 1;
        $scope.dependentExpensesList.push(tmp);
    };
    $scope.delDependentExpensesList = function(index){
        $scope.dependentExpensesList.splice(index, 1)
    };
    //Insurance Expenses
    $scope.generalInsuranceList = [{
        _id: 0,
        additionalParticular: "",
        addParticularAmount: '',
        addParticularCycle: ''
    }];
    $scope.addGeneralInsurance = function(generalInsurance){
        var tmp = {"_id":0,"additionalParticular":'',"addParticularAmount":'',"addParticularCycle":''};
        tmp._id = generalInsurance._id + 1;
        $scope.generalInsuranceList.push(tmp);
    };
    $scope.delGeneralInsurance = function(index){
        $scope.generalInsuranceList.splice(index, 1)
    };
}
angular.module('finatwork').controller('finGpsExpensesCtrl', finGpsExpensesCtrl);
/*** Created by Nilabh on 23-08-2017.*/
function finGpsAssetCtrl($scope, $http) {
    $scope.init =  function(){
        loadEmploymentList();
        loadLoanType();
    };

    var loadEmploymentList = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.employmentBenefit
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.employmentCategoryList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    var loadLoanType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.loanType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.loanList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    //Employment Benefits
    $scope.employmentBenefitList = [{
        _id:0,
        employmentCategory:'',
        holder:'',
        employmentAmount:''
    }];
    $scope.addEmploymentBenefits = function(employment){
       var tmp ={"_id":0,"employmentCategory":'',"holder":'',"employmentAmount":''};
       tmp._id= employment._id +1;
        $scope.employmentBenefitList.push(tmp);
    };
    $scope.deleteEmploymentBenefits = function(index){
        $scope.employmentBenefitList.splice(index,1);
    };
    //Personal Benefits
    $scope.personalBenefitList = [{
        _id:0,
        type:'',
        holder:'',
        purchaseCost:'',
        EstimatedCurrentValue:''
    }];
    $scope.addPersonalBenefits = function(personal){
        var tmp ={"_id":0,"type":'',"holder":'',"purchaseCost":'',"EstimatedCurrentValue":''};
        tmp._id= personal._id +1;
        $scope.personalBenefitList.push(tmp);
    };
    $scope.deletePersonalBenefits = function(index){
        $scope.personalBenefitList.splice(index,1);
    }
}
angular.module('finatwork').controller('finGpsAssetCtrl', finGpsAssetCtrl);

/*** Created by Nilabh on 18-08-2017.*/
function finGpsRegularInvestCtrl($scope, $http) {
    $scope.init = function () {
        loadInvestmentType();
    };
    var loadInvestmentType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.investmentType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.investmentTypeRecord = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.investmentTypeList = [{
        _id: 0,
        "particular": '',
        "holder": '',
        "investmentAmount": '',
        "cycle": ''
    }];
    $scope.addRegularInvestment = function (investment) {
        var tmp = {"_id": 0, "particular": '', "holder": '', "investmentAmount": '', "cycle": ''};
        tmp._id=investment._id +1;
        $scope.investmentTypeList.push(tmp);
    };
    $scope.delRegularInvestment = function(index){
        $scope.investmentTypeList.splice(index,1);
    }
}
angular.module('finatwork').controller('finGpsRegularInvestCtrl', finGpsRegularInvestCtrl);

/*** Created by Nilabh on 30-08-2017.*/
function finGpsInsuranceCtrl($scope, $state, toaster, $http, finGpsService) {
    var uid = 1;
    $scope.lifeInsuranceList = [];
    $scope.addLifeInsurance = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.todayDate = moment().hours(23).minutes(59).seconds(59).milliseconds(0);
    $scope.init = function () {
        finGpsService.getInfo('lifeInsurance').then(function (response) {
            if (response != null && response.lifeInsurance != null && response.lifeInsurance.insurance.length != 0) {/*response.lifeInsurance.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.lifeInsuranceList = response.lifeInsurance.insurance;
                $scope.addLifeInsurance = false;
                if ($scope.lifeInsuranceList.length > 1) {
                    $scope.lifeInsuranceList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.lifeInsuranceList[$scope.lifeInsuranceList.length - 1]._id + 1;
            } else {
                $scope.finGpsLifeInsuranceForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
        loadPolicyType();
    };
    var loadPolicyType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.policyType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.policyList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.submitLifeInsuranceForm = function () {
        $scope.finGpsLifeInsuranceForm.issueDate = moment($scope.finGpsLifeInsuranceForm.issueDate).format('YYYY-MM-DD');
        var newLifeInsurance = $scope.finGpsLifeInsuranceForm;
        if (newLifeInsurance._id == null) {
            newLifeInsurance._id = ++uid;
            $scope.lifeInsuranceList.push(newLifeInsurance);
        } else {
            for (var i in $scope.lifeInsuranceList) {
                if ($scope.lifeInsuranceList[i]._id == newLifeInsurance._id) {
                    $scope.lifeInsuranceList[i] = newLifeInsurance;
                    break;
                }
            }
        }
        $scope.finGpsLifeInsuranceForm = {};
        $scope.addLifeInsurance = false;

    };
    $scope.addFinGpsLifeInsurance = function () {
        $scope.finGpsLifeInsuranceForm = {};
        $scope.addLifeInsurance = true;

    };
    $scope.cancelLifeInsurance = function () {
        if ($scope.lifeInsuranceList.length) {
            $scope.addLifeInsurance = false;
        } else {
            $state.go('forms.finGps.insurance.pensionPolicy');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.lifeInsuranceList) {
                if ($scope.lifeInsuranceList[i]._id == id) {
                    $scope.lifeInsuranceList.splice(i, 1);
                    $scope.finGpsLifeInsuranceForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.lifeInsuranceList) {
                if ($scope.lifeInsuranceList[i]._id == id) {
                    $scope.finGpsLifeInsuranceForm = angular.copy($scope.lifeInsuranceList[i]);
                    break;
                }
            }
            $scope.addLifeInsurance = true;
        }
    };
    $scope.submitLifeInsurance = function () {
        var lifeInsuranceLists = {
            insurance: $scope.lifeInsuranceList
        };
        finGpsService.setInfo('lifeInsurance', lifeInsuranceLists);
        $state.go('forms.finGps.insurance.pensionPolicy');
        toaster.success("Saved successfully");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#lifeInsuranceRelated :input").attr("disabled", true);
            $("#lifeInsuranceRelated :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsInsuranceCtrl', finGpsInsuranceCtrl);
/*** Created by Nilabh on 08-09-2017.*/
function finGpsModalController($scope, close) {
    $scope.close = function (result) {
        close(result, 500);
    };
}
function finGpsGuideLinesCtrl($scope, $state, $http,ModalService,finGpsService){
    $scope.termsConditionSelected = false;
    $scope.finGpsTermsConditions = function () {
        ModalService.showModal({
            templateUrl: "views/finGpsTermsConditions.html",
            controller: "finGpsModalController"
        }).then(function (modal) {
            modal.element.modal();
            modal.close.then(function (result) {
                if (result) {
                    $scope.termsConditionSelected = true;
                } else {

                }
            });
        });
    };
    $scope.termsAgreement= function(){

    };
    $scope.onTermsAgreementChange = function (){

    }
}
angular
    .module('finatwork')
    .controller('finGpsModalController', finGpsModalController)
    .controller('finGpsGuideLinesCtrl', finGpsGuideLinesCtrl);

/*** Created by Nilabh on 08-09-2017.*/
function finGpsPensionPolicyCtrl($scope, $state, toaster,finGpsService) {
    var uid = 1;
    $scope.pensionPolicyList = [];
    $scope.addPensionPolicy = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('pensionPolicy').then(function (response) {
            if (response != null && response.pensionPolicy != null && response.pensionPolicy.pension.length != 0) {/*response.lifeInsurance.,pensionlength can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.pensionPolicyList = response.pensionPolicy.pension;
                $scope.addPensionPolicy = false;
                if ($scope.pensionPolicyList.length > 1) {
                    $scope.pensionPolicyList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.pensionPolicyList[$scope.pensionPolicyList.length - 1]._id + 1;
            } else {
                $scope.finGpsPensionPolicyForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.submitPensionPolicyForm = function () {
        var newPensionPolicy = $scope.finGpsPensionPolicyForm;
        if (newPensionPolicy._id == null) {
            newPensionPolicy._id = ++uid;
            $scope.pensionPolicyList.push(newPensionPolicy);
        } else {
            for (var i in $scope.pensionPolicyList) {
                if ($scope.pensionPolicyList[i]._id == newPensionPolicy._id) {
                    $scope.pensionPolicyList[i] = newPensionPolicy;
                    break;
                }
            }
        }
        $scope.finGpsPensionPolicyForm = {};
        $scope.addPensionPolicy = false;
    };
    $scope.addFinGpsPensionPolicy = function () {
        $scope.finGpsPensionPolicyForm = {};
        $scope.addPensionPolicy = true;
    };
    $scope.cancelPensionPolicy = function () {
        if ($scope.pensionPolicyList.length) {
            $scope.addPensionPolicy = false;
        } else {
            $state.go('forms.finGps.insurance.generalInsurance');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.pensionPolicyList) {
                if ($scope.pensionPolicyList[i]._id == id) {
                    $scope.pensionPolicyList.splice(i, 1);
                    $scope.finGpsPensionPolicyForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.pensionPolicyList) {
                if ($scope.pensionPolicyList[i]._id == id) {
                    $scope.finGpsPensionPolicyForm = angular.copy($scope.pensionPolicyList[i]);
                    break;
                }
            }
            $scope.addPensionPolicy = true;
        }
    };
    $scope.submitPensionPolicy = function () {
        var pensionPolicyLists = {
            pension:$scope.pensionPolicyList
        };
        finGpsService.setInfo('pensionPolicy', pensionPolicyLists);
        $state.go('forms.finGps.insurance.generalInsurance');
        toaster.success("Saved successfully");
    }
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#lifeInsuranceRelated :input").attr("disabled", true);
            $("#lifeInsuranceRelated :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsPensionPolicyCtrl', finGpsPensionPolicyCtrl);
/*** Created by Nilabh on 09-09-2017.*/
function finGpsInvestmentCtrl($scope, $http) {
    $scope.init = function () {
        instrumentType();
    };
    $scope.finGpsInvestmentAssetForm = {
        fixedIncomeInvestmentValue: 0
    };
    $scope.assetCategorySelection = function () {
        $scope.fixedIncomeInstrument = $scope.finGpsInvestmentAssetForm.instrument == "ppf" ||
            $scope.finGpsInvestmentAssetForm.instrument =="fd" ||$scope.finGpsInvestmentAssetForm.instrument == "recurringDeposit" ||
            $scope.finGpsInvestmentAssetForm.instrument =="sukanyaSamriddhiScheme" ||$scope.finGpsInvestmentAssetForm.instrument == "nsc-KVP" ||
            $scope.finGpsInvestmentAssetForm.instrument =="bondDebenture-cd";
        $scope.mutualFundInvestment = $scope.finGpsInvestmentAssetForm.instrument == "mutualFund";
        $scope.sharesInvestment = $scope.finGpsInvestmentAssetForm.instrument == "shares";
        $scope.realEstateInvestment = $scope.finGpsInvestmentAssetForm.instrument == "realEstate";
        $scope.goldInvestment = $scope.finGpsInvestmentAssetForm.instrument == "gold";
        $scope.othersInvestment = $scope.finGpsInvestmentAssetForm.instrument == "others";

    };

    var instrumentType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.instruments
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.instrumentList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
        $scope.fixedIncomeInstrument = false;
        $scope.mutualFundInvestment = false;
        $scope.sharesInvestment = false;
        $scope.realEstateInvestment = false;
        $scope.goldInvestment = false;
        $scope.othersInvestment = false;
    };


}
angular.module('finatwork').controller('finGpsInvestmentCtrl', finGpsInvestmentCtrl);

/*** Created by Nilabh on 11-09-2017.*/
function finGpsGeneralInsuranceCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.generalInsuranceForm = {
        pvtHealthInsurance: 'no',
        criticalIllnessPolicy: 'no',
        personalAccidentPolicy: 'no'
    };
    $scope.formEditable = true;
    $scope.init = function () {
        finGpsService.getInfo('generalInsurance').then(function (response) {
            if (response != null && response.generalInsurance !== undefined && response.generalInsurance != undefined) {
                if (!IsAdmin())formStatus(response.state);
                $scope.generalInsuranceForm.generalInsurance = response.generalInsurance;
                if ($scope.generalInsuranceForm.generalInsurance) {
                    if (response.generalInsurance.pvtAmt) {
                        $scope.generalInsuranceForm.pvtHealthInsurance = 'yes';
                        $scope.generalInsuranceForm.pvtAmt = response.generalInsurance.pvtAmt;
                    }
                    if (response.generalInsurance.pvtSpouseAmt) {
                        $scope.generalInsuranceForm.pvtHealthInsurance = 'yes';
                        $scope.generalInsuranceForm.pvtSpouseAmt = response.generalInsurance.pvtSpouseAmt;
                    }
                    if (response.generalInsurance.pvtParentsAmt) {
                        $scope.generalInsuranceForm.pvtHealthInsurance = 'yes';
                        $scope.generalInsuranceForm.pvtParentsAmt = response.generalInsurance.pvtParentsAmt;
                    }
                    if (response.generalInsurance.criticalAmt) {
                        $scope.generalInsuranceForm.criticalIllnessPolicy = 'yes';
                        $scope.generalInsuranceForm.criticalAmt = response.generalInsurance.criticalAmt;
                    }
                    if (response.generalInsurance.criticalSpouseAmt) {
                        $scope.generalInsuranceForm.criticalIllnessPolicy = 'yes';
                        $scope.generalInsuranceForm.criticalSpouseAmt = response.generalInsurance.criticalSpouseAmt;
                    }
                    if (response.generalInsurance.criticalParentsAmt) {
                        $scope.generalInsuranceForm.criticalIllnessPolicy = 'yes';
                        $scope.generalInsuranceForm.criticalParentsAmt = response.generalInsurance.criticalParentsAmt;
                    }
                    if (response.generalInsurance.personalAmt) {
                        $scope.generalInsuranceForm.personalAccidentPolicy = 'yes';
                        $scope.generalInsuranceForm.personalAmt = response.generalInsurance.personalAmt;
                    }
                    if (response.generalInsurance.personalSpouseAmt) {
                        $scope.generalInsuranceForm.personalAccidentPolicy = 'yes';
                        $scope.generalInsuranceForm.personalSpouseAmt = response.generalInsurance.personalSpouseAmt;
                    }
                    if (response.generalInsurance.personalParentsAmt) {
                        $scope.generalInsuranceForm.personalAccidentPolicy = 'yes';
                        $scope.generalInsuranceForm.personalParentsAmt = response.generalInsurance.personalParentsAmt;
                    }
                    if(response.generalInsurance.comment){
                        $scope.generalInsuranceForm.comment =response.generalInsurance.comment;
                    }
                }
            }
        }, function (reason) {
            console.log(reason);
        });
    };
    $scope.submitGeneralInsurance = function(){
        var generalInsuranceInfo = {};
        if ($scope.generalInsuranceForm.pvtHealthInsurance == 'yes') {
            generalInsuranceInfo.pvtAmt = $scope.generalInsuranceForm.pvtAmt;
            generalInsuranceInfo.pvtSpouseAmt = $scope.generalInsuranceForm.pvtSpouseAmt;
            generalInsuranceInfo.pvtParentsAmt = $scope.generalInsuranceForm.pvtParentsAmt;
        }
        if ($scope.generalInsuranceForm.criticalIllnessPolicy == 'yes') {
            generalInsuranceInfo.criticalAmt = $scope.generalInsuranceForm.criticalAmt;
            generalInsuranceInfo.criticalSpouseAmt = $scope.generalInsuranceForm.criticalSpouseAmt;
            generalInsuranceInfo.criticalParentsAmt = $scope.generalInsuranceForm.criticalParentsAmt;
        }
        if ($scope.generalInsuranceForm.personalAccidentPolicy == 'yes') {
            generalInsuranceInfo.personalAmt = $scope.generalInsuranceForm.personalAmt;
            generalInsuranceInfo.personalSpouseAmt = $scope.generalInsuranceForm.personalSpouseAmt;
            generalInsuranceInfo.personalParentsAmt = $scope.generalInsuranceForm.personalParentsAmt;
        }
        generalInsuranceInfo.comment =$scope.generalInsuranceForm.comment;
        finGpsService.setInfo("generalInsurance", generalInsuranceInfo);
         $state.go("forms.finGps.finGpsDoc_upload");
    };
    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#lifeInsuranceRelated :input").attr("disabled", true);
            $("#lifeInsuranceRelated :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsGeneralInsuranceCtrl', finGpsGeneralInsuranceCtrl);

/** Created by Nilabh on 11-09-2017.*/
function finGpsLiabilitiesCtrl($scope, $http, toaster, finGpsService) {
    var uid = 1;
    $scope.liabilitiesList = [];
    $scope.addLiabilities = true;
    $scope.submitText = "Submit";
    $scope.formEditable = true;
    $scope.todayDate = moment().hours(23).minutes(59).seconds(59).milliseconds(0);
    $scope.finGpsLiabilitiesForm = {
        isOutstanding: 'no',
        isLoan: 'no'
    };
    $scope.init = function () {
        finGpsService.getInfo('liabilities').then(function (response) {
            if (response != null && response.liabilities != null && response.liabilities.loans.length != 0) {/*response.lifeInsurance.length can't be used as it is empty/undefined for new user*/
                if (!IsAdmin())formStatus(response.state);
                $scope.liabilitiesList = response.liabilities.loans;
                $scope.addLiabilities = false;
                if ($scope.liabilitiesList.length > 1) {
                    $scope.liabilitiesList.sort(function (a, b) {
                        return a._id - b._id;
                    });
                }
                uid = $scope.liabilitiesList[$scope.liabilitiesList.length - 1]._id + 1;
            } else {
                $scope.finGpsLiabilitiesForm = {};
            }
        }, function (reason) {
            console.log(reason);
        });
        loadLoanType();
    };
    var loadLoanType = function () {
        $http({
            method: 'GET',
            url: window.StorageURL.loanType
        }).then(function successCallback(response) {
            if (response.data == 0) {
                return false;
            }
            $scope.loanList = response.data;
        }, function errorCallback(response) {
            console.log(response);
        });
    };
    $scope.submitAdditionalLiabilities = function () {
        $scope.finGpsLiabilitiesForm.issueDate = moment($scope.finGpsLiabilitiesForm.startDate).format('YYYY-MM-DD');
        var newLiabilities = $scope.finGpsLiabilitiesForm;
        if (newLiabilities._id == null) {
            newLiabilities._id = ++uid;
            $scope.liabilitiesList.push(newLiabilities);
        } else {
            for (var i in $scope.liabilitiesList) {
                if ($scope.liabilitiesList[i]._id == newLiabilities._id) {
                    $scope.liabilitiesList[i] = newLiabilities;
                    break;
                }
            }
        }
        $scope.finGpsLiabilitiesForm = {};
        $scope.addLiabilities = false;

    };
    $scope.addFinGpsLiabilities = function () {
        $scope.finGpsLiabilitiesForm = {};
        $scope.addLiabilities = true;

    };
    $scope.cancelLiabilities = function () {
        if ($scope.liabilitiesList.length) {
            $scope.addLiabilities = false;
        } else {
            $state.go('forms.finGps.insurance.generalInsurance');
        }
    };
    $scope.delete = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.liabilitiesList) {
                if ($scope.liabilitiesList[i]._id == id) {
                    $scope.liabilitiesList.splice(i, 1);
                    $scope.finGpsLiabilitiesForm = {};
                    break;
                }
            }
        }

    };
    $scope.edit = function (id) {
        if ($scope.formEditable) {
            for (var i in $scope.liabilitiesList) {
                if ($scope.liabilitiesList[i]._id == id) {
                    $scope.finGpsLiabilitiesForm = angular.copy($scope.liabilitiesList[i]);
                    break;
                }
            }
            $scope.addLiabilities = true;
        }
    };
    $scope.submitFinGpsLiabilities = function () {
        var liabilitiesLists = {
            loans: $scope.lifeInsuranceList
        };
        finGpsService.setInfo('liabilities', liabilitiesLists);
        $state.go('forms.finGps.insurance.generalInsurance');
        toaster.success("Saved successfully");
    };

    function formStatus(state) {
        if (state == 'infoProvided') {
            $scope.formEditable = false;
        }
        //life insurance related ??- Ask sir
        if (!$scope.formEditable) {
            $("#lifeInsuranceRelated :input").attr("disabled", true);
            $("#lifeInsuranceRelated :submit").attr("disabled", true);
        }
    }
}
angular.module('finatwork').controller('finGpsLiabilitiesCtrl', finGpsLiabilitiesCtrl);

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

/**
 * Created by Suraj on 23-May-17.
 */

function reportCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        {name: 'Report Name', "field": "reportName", width: '10%', pinnedLeft: true},
        {name: 'Last Update', "field": "receivedDate", width: '15%',cellFilter: 'date', type: 'date'},
        {name: 'KRA', "field": "KRA", width: '10%'},
        {name: 'State', "field": "state", width: '10%'},
        {name: 'Zipfile', "field": "zipfile", width: '*'},
        {name: 'File', "field": "file", width: '*'}
    ];
    $http({
        method: 'GET',
        url: window.link.report,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
           if(response.data[i].receivedDate) response.data[i].receivedDate = moment(response.data[i].receivedDate).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('reportCtrl', reportCtrl);

/**
 * Created by Suraj on 23-May-17.
 */

function camsTrxnCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
         {name: 'Investor Name', "field": "INV_NAME",pinnedLeft: true},
        {name: 'Pan', "field": "PAN", width: '9%'},
        {name: 'Fund Name', "field": "SCHEME", width: '15%'},
        {name: 'Units', "field": "UNITS", width: '6%'},
        {name: 'Price', "field": "PURPRICE", width: '7%'},
         {name: 'Amount', "field": "AMOUNT", width: '7%'},
        {name: 'Trade Date', "field": "TRADDATE",width: '15%',cellFilter: 'date', type: 'date'},
        {name: 'Folio', "field": "FOLIO_NO", width: '9%'},
        {name: 'Trxn Type', "field": "TRXN_TYPE_",width: '5%'},
        {name: 'UniqueNo', "field": "SEQ_NO", width: '9%'},
        {name: 'Status', "field": "processed", width: '5%'}
    ];
    $http({
        method: 'GET',
        url: window.link.camsTrxn,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
           if(response.data[i].TRADDATE) response.data[i].TRADDATE = moment(response.data[i].TRADDATE).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('camsTrxnCtrl', camsTrxnCtrl);

/**
 * Created by Suraj on 23-May-17.
 */

function karvyTrxnCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        {name: 'Investor Name', "field": "INVNAME",pinnedLeft: true},
        {name: 'Pan', "field": "PAN1", width: '9%'},
        {name: 'Fund Name', "field": "FUNDDESC", width: '15%'},
        {name: 'Units', "field": "TD_UNITS",width: '6%'},
        {name: 'Price', "field": "TD_NAV",width: '7%'},
        {name: 'Amount', "field": "TD_AMT",width: '7%'},
        {name: 'Trade Date', "field": "TD_TRDT",cellFilter: 'date', type: 'date'},
        {name: 'Folio', "field": "TD_ACNO",width: '9%'},
        {name: 'Trxn Type', "field": "TD_TRTYPE",width: '5%'},
        {name: 'UniqueNo', "field": "UNQNO", width: '10%'},
        {name: 'Status', "field": "processed",width: '5%'}
    ];
    $http({
        method: 'GET',
        url: window.link.karvyTrxn,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            if(response.data[i].TD_TRDT) response.data[i].TD_TRDT = moment(response.data[i].TD_TRDT).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('karvyTrxnCtrl', karvyTrxnCtrl);

/**
 * Created by Suraj on 23-May-17.
 */

function franklinTrxnCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        {name: 'Investor Name', "field": "INVESTOR_2",pinnedLeft: true},
        {name: 'Pan', "field": "IT_PAN_NO1", width: '9%'},
        {name: 'Fund Name', "field": "SCHEME_NA1", width: '15%'},
        {name: 'Units', "field": "UNITS",width: '6%'},
        {name: 'Price', "field": "NAV",width: '7%'},
        {name: 'Amount', "field": "AMOUNT",width: '7%'},
        {name: 'Trade Date', "field": "TRXN_DATE",width: '15%',cellFilter: 'date', type: 'date'},
        {name: 'Folio', "field": "CUSTOMER_6", width: '8%'},
        {name: 'Trxn Type', "field": "TRXN_TYPE",width: '5%'},
        {name: 'UniqueNo', "field": "TRXN_NO", width: '9%'},
        {name: 'Status', "field": "processed",width: '5%'}
    ];
    $http({
        method: 'GET',
        url: window.link.franklinTrxn,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
           if(response.data[i].TRXN_DATE) response.data[i].TRXN_DATE = moment(response.data[i].TRXN_DATE).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('franklinTrxnCtrl', franklinTrxnCtrl);
