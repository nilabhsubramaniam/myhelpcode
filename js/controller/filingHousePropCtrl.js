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

