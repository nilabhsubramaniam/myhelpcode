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