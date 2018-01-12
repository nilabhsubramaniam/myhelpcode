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
