function riskProfileCtrl($scope, $state, $http, toaster, c3ChartService, $uibModal) {
    $scope.dynamic=0;
    $scope.init = function(){
        //
    };
    //getting risk profile result
    $http({
        method: 'GET',
        url: window.link.riskProfileResult + "/" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        if (response.data) {
            $state.go('dashboards.risk_result');
        }else {
            var modalInstance = $uibModal.open({
                templateUrl: 'views/modal_risk_profile.html',
                controller: modelButtonController,
                windowClass: "animated fadeIn"
            });

            $http({
                method: 'GET',
                url: window.link.riskProfileQuestion,
                headers: {'x-access-token': window.localStorage.getItem('token')}
            }).then(function successCallback(response) {
                if (response.data == 0) {
                    return false;
                }
                window.localStorage.setItem("risk_questions_answer", "");
                window.localStorage.setItem("risk_questions", JSON.stringify(response.data));
                $scope.showQuestion(0);
            }, function errorCallback(response) {
                console.log(response);
            });
        }
    }, function errorCallback(response) {
        console.log(response);
    });

    $scope.showQuestion = function (q) {
        if (window.localStorage.getItem("risk_questions")) {
            var questions = JSON.parse(window.localStorage.getItem("risk_questions"));
            $scope.question_text = questions[q].question;
            $scope.answers = questions[q].answer;
            $scope.qno = q;
        }
    };

    $scope.submitQuestion = function (question_text, qno) {
        var selected = parseFloat($scope.optionsRadios) + 1;
        if (selected >= 1) {
            $scope.dynamic = (qno+1) * 23;
            var resArray = [];
            resArray = (window.localStorage.getItem("risk_questions_answer")) ? JSON.parse(window.localStorage.getItem("risk_questions_answer")) : [];
            resArray.push(selected);
            window.localStorage.setItem("risk_questions_answer", JSON.stringify(resArray));

            if (window.localStorage.getItem("risk_questions")) {
                var questions = JSON.parse(window.localStorage.getItem("risk_questions"));
                qno = qno + 1;
                if (qno < questions.length) {
                    $scope.optionsRadios = "";
                    $scope.showQuestion(qno);
                } else {

                    var answerObj = {
                        _userid: window.localStorage.getItem("userid"),
                        answer: JSON.parse(window.localStorage.getItem("risk_questions_answer"))
                    };

                    $http({
                        method: 'POST',
                        url: window.link.riskProfileAnswer,
                        data: answerObj,
                        headers: {
                            'x-access-token': window.localStorage.getItem('token')
                        }
                    }).then(function successCallback(response) {
                        window.localStorage.setItem("risk_questions_answer", "");
                        $state.go('dashboards.risk_result');
                    }, function errorCallback(response) {
                        window.localStorage.setItem("risk_questions_answer", "");
                        toaster.error({body: response.data.reason});
                    });
                }
            }
        }else{
            toaster.error({body: "Please answer the question"});
        }
    }
}
angular.module('finatwork').controller('riskProfileCtrl',['$scope', '$state', '$http' ,'toaster' ,'c3ChartService','$uibModal' ,riskProfileCtrl]);