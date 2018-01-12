/**
 * Created by Suraj on 23-May-17.
 */

function reportCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        {name: 'Report Name', "field": "reportName", width: '10%', pinnedLeft: true},
        {name: 'Last Update', "field": "receivedDate", width: '15%',cellFilter: 'date', type: 'date'},
        {name: 'KRA', "field": "KRA", width: '10%'},
        {name: 'State', "field": "state", width: '10%'},
        {name: 'Zipfile', "field": "zipfile", width: '*'},
        {name: 'File', "field": "file", width: '*'}
    ];
    $http({
        method: 'GET',
        url: window.link.report,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
           if(response.data[i].receivedDate) response.data[i].receivedDate = moment(response.data[i].receivedDate).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('reportCtrl', reportCtrl);
