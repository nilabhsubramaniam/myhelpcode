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
