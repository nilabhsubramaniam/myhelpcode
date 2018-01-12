/*** Created by Nilabh on 14-07-2017.*/

function goalStatusCtrl($scope, $http) {
    $scope.gridOptions1 = {};
    $scope.gridOptions1.enableFiltering = true;
    $scope.gridOptions1.columnDefs = [
        {name: 'Name', "field": "bank[0].acctName", width: '20%', pinnedLeft: true},
        {name: 'Type', "field": "type", width: '15%', enableFiltering: false},
        {name: 'Last Update', "field": "updatedAt", width: '15%', enableFiltering: false},
        {name: 'Reason', "field": "trxnFailureReason[0]", width: '*', enableFiltering: false}
    ];
    $http({
        method: 'GET',
        url: window.link.goalStatus,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].updatedAt = moment(response.data[i].updatedAt).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions1.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}
angular.module('finatwork').controller('goalStatusCtrl', goalStatusCtrl);
