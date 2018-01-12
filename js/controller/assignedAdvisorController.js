/* Created by Nilabh on 22-06-2017.*/
function advisorController($scope, $state, $http) {
    $scope.assignedPersonal = [
        {
            designation: "ADVISOR",
            name: "Finatwork Intelligent",
            phone: "(080) 41227738",
            email: "intelligent.choice@finatwork.com",
            src : "/assets/img/user.jpg"
        },
        {
            designation: "OPERATIONS",
            name: "Megha Patil",
            phone: "(080) 41227738",
            email: "operations@finatwork.com ",
            src :"/assets/img/megha.jpg"
        },
        {
            designation: "GRIEVANCES",
            name: "Saurabh Bansal",
            phone: "(080) 41227738",
            email: "grievance.redressal@finatwork.com",
            src : "/assets/img/user.jpg"
        }
    ];

    $scope.init = function () {
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + getUserId(),
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            var src;
            if (response.data.advisor) {
                $scope.assignedPersonal[0].name = response.data.advisorName;
                $scope.assignedPersonal[0].email = response.data.advisorEmail;
                switch (response.data.advisor) {
                    case 'Subhajit':
                        src = "/assets/img/subhojeet_mandal.jpg";
                        break;
                    case 'Megha':
                        src = "/assets/img/megha.jpg";
                        break;
                    case 'Neeti':
                        src = "/assets/img/neeti_trivedi.jpg";
                        break;
                    case 'Saurabh':
                        src = "/assets/img/saurabh_bansal.jpg";
                        break;
                }
                $scope.assignedPersonal[0].src = src;
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    };
}
angular.module('finatwork').controller('advisorController', advisorController);
