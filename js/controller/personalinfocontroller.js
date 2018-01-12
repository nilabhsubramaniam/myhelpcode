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