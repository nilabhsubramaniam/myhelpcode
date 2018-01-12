/**Created by Nilabh on 07-08-2017.**/
function finGpsGoalsCtrl($scope, $state, toaster, $http) {
    $scope.init = function () {

    };
    $scope.gridOptions1 = {};
    $scope.gridOptions1.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            if (newValue !== undefined && newValue != oldValue) {
                var data = {
                    _userid: rowEntity._userid,
                    state: "finGps",
                    comment: newValue
                };
                $http({
                    method: 'POST',
                    url: window.link.create_goal + '/' + rowEntity._goalid,
                    data: data,
                    headers: {'x-access-token': window.localStorage.getItem('token')}
                }).then(function successCallback(data) {
                    //$scope.$apply();
                    toaster.success({body: 'successfully updated'});
                }, function errorCallback(response) {
                    console.log(response);
                });
            }
        });
    };

    $scope.gridOptions1.columnDefs = [
        {name: 'Goal Type', "field": "type", width: '*', pinnedLeft: true},
        {name: 'Start Year', "field": "fromDate", width: '8%'},
        {name: 'End Year', "field": "toDate", width: '8%'},
        {name: 'Goal Future Value', "field": "futurePrice", width: '*'},
        {name: 'Lumpsum Committed', "field": "lumpsum", width: '*'},
        {name: 'SIP Committed', displayName: 'SIP Committed', "field": "sip", width: '*'},
        {name: '% Achieved', "field": "percentAchieved", width: '*'},
        {name: 'Add Comment(Double Click)', "field": "comment", width: '20%'}
    ];
    $http({
        method: 'GET',
        url: window.link.create_goal + "?state=active" + "&view=goal&userid=" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            if (response.data[i].fromDate) response.data[i].fromDate = moment(response.data[i].fromDate).format('YYYY');
            if (response.data[i].toDate) response.data[i].toDate = moment(response.data[i].toDate).format('YYYY');
        }
        $scope.gridOptions1.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });

}
angular.module('finatwork').controller('finGpsGoalsCtrl', finGpsGoalsCtrl);
