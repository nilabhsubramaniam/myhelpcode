/**
 * Created by Suraj on 23-May-17.
 */

function franklinTrxnCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        {name: 'Investor Name', "field": "INVESTOR_2",pinnedLeft: true},
        {name: 'Pan', "field": "IT_PAN_NO1", width: '9%'},
        {name: 'Fund Name', "field": "SCHEME_NA1", width: '15%'},
        {name: 'Units', "field": "UNITS",width: '6%'},
        {name: 'Price', "field": "NAV",width: '7%'},
        {name: 'Amount', "field": "AMOUNT",width: '7%'},
        {name: 'Trade Date', "field": "TRXN_DATE",width: '15%',cellFilter: 'date', type: 'date'},
        {name: 'Folio', "field": "CUSTOMER_6", width: '8%'},
        {name: 'Trxn Type', "field": "TRXN_TYPE",width: '5%'},
        {name: 'UniqueNo', "field": "TRXN_NO", width: '9%'},
        {name: 'Status', "field": "processed",width: '5%'}
    ];
    $http({
        method: 'GET',
        url: window.link.franklinTrxn,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
           if(response.data[i].TRXN_DATE) response.data[i].TRXN_DATE = moment(response.data[i].TRXN_DATE).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('franklinTrxnCtrl', franklinTrxnCtrl);
