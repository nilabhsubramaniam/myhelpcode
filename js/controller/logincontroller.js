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
