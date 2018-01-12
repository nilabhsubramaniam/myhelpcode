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
