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