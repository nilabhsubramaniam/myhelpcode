/**
 * Created by Nilabh on 28-07-2017.
 */
function finGpsPersonalInfoCtrl($scope, $state, toaster, $http, finGpsService) {
    $scope.relationshiplist = ["Father", "Mother", "Wife", "Husband", "Son", "Daughter", "Father-in-law",
        "Mother-in-law", "Son-in- law", "Daughter-in-law", "Aunt", "Uncle", "Niece", "Nephew", "Brother",
        "Sister", "Grand Father", "Grand Mother", "Others"];
    $scope.noOfChildren = 0;
    $scope.financiallyDependents = 0;
    $scope.children = [];

    $scope.init = function () {
        finGpsService.getInfo().then(function (response) {
            if (response != null && response.personal != null && response.personal.is_married != null) {
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

