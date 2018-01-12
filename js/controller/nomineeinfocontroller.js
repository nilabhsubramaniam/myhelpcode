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