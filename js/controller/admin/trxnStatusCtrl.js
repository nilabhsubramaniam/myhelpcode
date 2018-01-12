/**
 * Created by Suraj on 12-May-17.
 */

function trxnStatusCtrl($scope, $http) {
    $scope.gridOptions1 = {};
    //     expandableRowTemplate: '<div ui-grid="row.entity.subGridOptions" style="height:150px;"></div>',
    //     expandableRowHeight: 150,
    //     onRegisterApi: function (gridApi) {
    //         gridApi.expandable.on.rowExpandedStateChanged($scope, function (row) {
    //             if (row.isExpanded && (row.entity.status === "processing")) {
    //                 row.entity.subGridOptions = {
    //                     columnDefs: [
    //                         {name: 'Scheme Name', "field": "_schemeId"},
    //                         {name: 'Status', "field": "status"}
    //                     ]
    //                 };
    //                 $http({
    //                     method: 'GET',
    //                     url: window.link.goalFunds + "/" + row.entity._goalid,
    //                     headers: {'x-access-token': window.localStorage.getItem('token')}
    //                 }).then(function successCallback(response) {
    //                     row.entity.subGridOptions.data = response.data;
    //                 }, function errorCallback(response) {
    //                     console.log(response);
    //                 });
    //             }
    //         });
    //     }
    // };

    $scope.gridOptions1.showGridFooter = true;
    $scope.gridOptions1.enableFiltering = true;
    $scope.gridOptions1.columnDefs = [
        {name: 'Name', "field": "bank[0].acctName", pinnedLeft: true},
        {name: 'SIP', "field": "sip", enableFiltering: false},
        {name: 'Lumpsum', "field": "lumpsum", enableFiltering: false},
        {name: 'Goal', "field": "_goalid"},
        {name: 'Scheme', "field": "scheme"},
        {name: 'Sip Date', "field": "fromDate", enableFiltering: false,cellFilter: 'date', type: 'date'},
        {name: 'Order Date', "field": "orderDate", enableFiltering: false,cellFilter: 'date', type: 'date'}
    ];
    $http({
        method: 'GET',
        url: window.link.fundStatus,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            response.data[i].scheme = getSchemeName(response.data[i]._schemeId);
            if (response.data[i].fromDate) response.data[i].fromDate = moment(response.data[i].fromDate).format('DD-MMM-YYYY');
        }
        $scope.gridOptions1.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('trxnStatusCtrl', trxnStatusCtrl);
