/**
 * Created by Finatwork on 25-03-2017.
 */
function finHealthCtrl($scope, $http, toaster, $state, $timeout) {
    $scope.Answer = {};
    $scope.answers = new Array(15);
    $scope.savingsHabitStatus = true;
    $scope.savingsHabitScore = 3;
    $scope.contingencyPreparednessStatus = true;
    $scope.contingencyPreparednessScore = 3;
    $scope.loansituationStatus = true;
    $scope.loansituationScore = 3;
    $scope.investmentDisciplineStatus = true;
    $scope.investmentDisciplineScore = 3;
    $scope.generalAwarenessStatus = true;
    $scope.generalAwarenessScore = 3;
    $scope.value = 7;
    $scope.upperLimit = 9;
    $scope.lowerLimit = 3;
    $scope.unit = "";
    $scope.precision = 1;
    $scope.description = [];
    $scope.isLogedin = getUserId() !== null;

    $scope.ranges = [
        {
            min: 3,
            max: 5,
            color: '#C50200'
        },
        {
            min: 5,
            max: 7,
            color: '#FF7700'
        },
        {
            min: 7,
            max: 9,
            color: '#8DCA2F'
        }
    ];

    $http({
        method: 'GET',
        url: window.link.finHealthQuestion
    }).then(function successCallback(response) {
        $scope.questionsData = response.data;
        $scope.showQuestion();
    }, function errorCallback(response) {
        console.log(response);
    });

    $http({
        method: 'GET',
        url: window.StorageURL.finhealth
    }).then(function successCallback(response) {
        if (response.data == 0) {
            return false;
        }
        $scope.description = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
    $scope.showQuestion = function () {
        $scope.category1 = $scope.questionsData.slice(0, 3);
        $scope.category2 = $scope.questionsData.slice(3, 6);
        $scope.category3 = $scope.questionsData.slice(6, 9);
        $scope.category4 = $scope.questionsData.slice(9, 12);
        $scope.category5 = $scope.questionsData.slice(12, 15);
    };


    function getScore(cat, data) {
        var weightage = [3, 2, 1];
        $scope.answers[cat[0].qsno - 1] = data[0];
        $scope.answers[cat[1].qsno - 1] = data[1];
        $scope.answers[cat[2].qsno - 1] = data[2];
        return weightage[data[0]] + weightage[data[1]] + weightage[data[2]];
    }

    $scope.submitQuestion = function (questions) {
        var ques1, ques2,ques3;
        var ans  = [];
        if (questions === "savingsHabit") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category1[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category1[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category1[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                ans = [];
                ans.push($scope.Answer[$scope.category1[0]._id]);
                ans.push($scope.Answer[$scope.category1[1]._id]);
                ans.push($scope.Answer[$scope.category1[2]._id]);
                $scope.savingsHabitScore = getScore($scope.category1, ans);
                $scope.savingsHabitDesctiption = "";
                if ($scope.savingsHabitScore >= 7) {
                    $scope.savingsHabitDesctiption = $scope.description[0].options[0].commentary;
                } else if ($scope.savingsHabitScore >= 5) {
                    $scope.savingsHabitDesctiption = $scope.description[0].options[1].commentary;
                } else {
                    $scope.savingsHabitDesctiption = $scope.description[0].options[2].commentary;
                }
                $scope.savingsHabitStatus = false;
            }
        }

        if (questions === "contingencyPreparedness") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category2[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category2[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category2[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                ans = [];
                ans.push($scope.Answer[$scope.category2[0]._id]);
                ans.push($scope.Answer[$scope.category2[1]._id]);
                ans.push($scope.Answer[$scope.category2[2]._id]);
                $scope.contingencyPreparednessScore =  getScore($scope.category2, ans)
                $scope.contingencyDesctiption = "";
                if ($scope.contingencyPreparednessScore >= 7) {
                    $scope.contingencyDesctiption = $scope.description[1].options[0].commentary;
                } else if ($scope.contingencyPreparednessScore >= 5) {
                    $scope.contingencyDesctiption = $scope.description[1].options[1].commentary;
                } else {
                    $scope.contingencyDesctiption = $scope.description[1].options[2].commentary;
                }
                $scope.contingencyPreparednessStatus = false;
            }
        }

        if (questions === "loansituation") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category3[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category3[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category3[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                 ans = [];
                ans.push($scope.Answer[$scope.category3[0]._id]);
                ans.push($scope.Answer[$scope.category3[1]._id]);
                ans.push($scope.Answer[$scope.category3[2]._id]);
                $scope.loansituationScore = getScore($scope.category3, ans);
                $scope.loansituationDesctiption = "";
                if ($scope.loansituationScore >= 7) {
                    $scope.loansituationDesctiption = $scope.description[2].options[0].commentary;
                } else if ($scope.loansituationScore >= 5) {
                    $scope.loansituationDesctiption = $scope.description[2].options[1].commentary;
                } else {
                    $scope.loansituationDesctiption = $scope.description[2].options[2].commentary;
                }
                $scope.loansituationStatus = false;
            }
        }

        if (questions === "investmentDiscipline") {
             ques1 = $scope.Answer.hasOwnProperty($scope.category4[0]._id);
             ques2 = $scope.Answer.hasOwnProperty($scope.category4[1]._id);
             ques3 = $scope.Answer.hasOwnProperty($scope.category4[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                 ans = [];
                ans.push($scope.Answer[$scope.category4[0]._id]);
                ans.push($scope.Answer[$scope.category4[1]._id]);
                ans.push($scope.Answer[$scope.category4[2]._id]);
                $scope.investmentDisciplineScore = getScore($scope.category4, ans);
                $scope.investmentDesctiption = "";
                if ($scope.investmentDisciplineScore >= 7) {
                    $scope.investmentDesctiption = $scope.description[3].options[0].commentary;
                } else if ($scope.investmentDisciplineScore >= 5) {
                    $scope.investmentDesctiption = $scope.description[3].options[1].commentary;
                } else {
                    $scope.investmentDesctiption = $scope.description[3].options[2].commentary;
                }
                $scope.investmentDisciplineStatus = false;
            }
        }

        if (questions === "generalAwareness") {
            ques1 = $scope.Answer.hasOwnProperty($scope.category5[0]._id);
            ques2 = $scope.Answer.hasOwnProperty($scope.category5[1]._id);
            ques3 = $scope.Answer.hasOwnProperty($scope.category5[2]._id);
            if (!ques1 || !ques2 || !ques3) {
                toaster.error({body: "Please answer the question"});
            } else {
                ans = [];
                ans.push($scope.Answer[$scope.category5[0]._id]);
                ans.push($scope.Answer[$scope.category5[1]._id]);
                ans.push($scope.Answer[$scope.category5[2]._id]);
                $scope.generalAwarenessScore = getScore($scope.category5, ans);
                $scope.generalAwarenessDesctiption = "";
                if ($scope.generalAwarenessScore >= 7) {
                    $scope.generalAwarenessDesctiption = $scope.description[4].options[0].commentary;
                } else if ($scope.generalAwarenessScore >= 5) {
                    $scope.generalAwarenessDesctiption = $scope.description[4].options[1].commentary;
                } else {
                    $scope.generalAwarenessDesctiption = $scope.description[4].options[2].commentary;
                }
                $scope.generalAwarenessStatus = false;
            }
        }
    };
    $scope.overAllScoreValidate = function () {
        var keys = Object.keys($scope.Answer);
        var len = keys.length;

        if (len === 15) {
            if ($scope.isLogedin == true) {
                for (var i = 0; i < 15; i++) {
                    $scope.answers[i] = parseInt($scope.answers[i]) + 1;
                }

                var answerObj = {
                    _userid: window.localStorage.getItem("userid"),
                    answer: $scope.answers
                };

                $http({
                    method: 'POST',
                    url: window.link.finHealthAnswer,
                    data: answerObj,
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(response) {
                    $state.go('dashboards.health_result')
                }, function errorCallback(response) {
                    console.log("Response" + response);
                });
            } else {
                angular.element('[data-target="#tab-6"]').tab('show');
            }
        } else {
            toaster.error({body: "Please answer all the questions"});
            $timeout(function () {
                angular.element('[data-target="#tab-1"]').tab('show');
            }, 100);
        }

    };
    $scope.successMessage = false;
    $scope.showForm = true;
    $scope.finHealthReport = function () {
        for (var i = 0; i < 15; i++) {
            $scope.answers[i] = parseInt($scope.answers[i]) + 1;
        }
        var answerObj = {
            email: $scope.login.email,
            name: $scope.login.name,
            answer: $scope.answers
        };

        $http({
            method: 'POST',
            url: window.link.finHealthAnswer,
            data: answerObj
        }).then(function successCallback(response) {
            $scope.successMessage = true;
            $scope.showForm = false;

        }, function errorCallback(response) {
        });
    }
    $scope.goNewState = function (state) {
        var currentState = "";
        switch (state) {

            case "Free Sign Up" :
                currentState = "register";
                break;
        }
        (currentState != "") ? $state.go(currentState) : $state.go("/dashboards/dashboard_1");
    };

}
angular.module('finatwork').controller('finHealthCtrl', finHealthCtrl);
