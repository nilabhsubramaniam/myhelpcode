function accountVerifyCTRL($scope, $state, $http, toaster) {
    $scope.action = {};
    $scope.init = function(){
        formStatus();
    };

    $scope.sendRequest = function(){
        var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
        $scope.action = {
            status:$scope.requestType,
            notes:{
                text:$scope.message
            }
        };
        var data = {
            registration: $scope.action
        };

        $http({
            method: 'POST',
            url: window.link.engagement+"/"+userId,
            data: data,
            headers: {'x-access-token': window.localStorage.getItem("token")}
        }).then(function successCallback(response) {
            toaster.success({body: "Status updated successfully"});
        }, function errorCallback(response) {

        });
    };

    function formStatus() {
        var userId = (IsAdmin())?window.currentUesrId:window.localStorage.getItem("userid");
        $http({
            method: 'GET',
            url: window.link.engagement + "/" + userId,
            headers: {'x-access-token': window.localStorage.getItem('token')}
        }).then(function successCallback(response) {
            try {
                var userStatus = response.data.registration;
                var sortStatus = [];
                var notes = [];
                for (var i=0; i<userStatus.length; i++) {
                    sortStatus.push({
                        status:userStatus[i].status.toUpperCase(),
                        date: moment(userStatus[i].notes[0].date).format('DD-MMM-YYYY')
                        //isactive:false
                    });
                    for(var j = 0; j<userStatus[i].notes.length; j++){
                        notes.push({
                            status:userStatus[i].status.toUpperCase(),
                            text: userStatus[i].notes[j].text,
                            date: moment(userStatus[i].notes[j].date,"YYYY-MM-DD").format('DD-MMM-YYYY'),
                            user: userStatus[i].notes[j].user
                        });
                    }
                }
                $scope.notes = notes;
                $scope.userStatus = sortStatus;
            } catch (e) {

            }
        }, function errorCallback(response) {

        });
    }
}
angular.module('finatwork').controller('accountVerifyCTRL', accountVerifyCTRL);