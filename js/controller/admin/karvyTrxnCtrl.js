/**
 * Created by Suraj on 23-May-17.
 */

function karvyTrxnCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
        {name: 'Investor Name', "field": "INVNAME",pinnedLeft: true},
        {name: 'Pan', "field": "PAN1", width: '9%'},
        {name: 'Fund Name', "field": "FUNDDESC", width: '15%'},
        {name: 'Units', "field": "TD_UNITS",width: '6%'},
        {name: 'Price', "field": "TD_NAV",width: '7%'},
        {name: 'Amount', "field": "TD_AMT",width: '7%'},
        {name: 'Trade Date', "field": "TD_TRDT",cellFilter: 'date', type: 'date'},
        {name: 'Folio', "field": "TD_ACNO",width: '9%'},
        {name: 'Trxn Type', "field": "TD_TRTYPE",width: '5%'},
        {name: 'UniqueNo', "field": "UNQNO", width: '10%'},
        {name: 'Status', "field": "processed",width: '5%'}
    ];
    $http({
        method: 'GET',
        url: window.link.karvyTrxn,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
            if(response.data[i].TD_TRDT) response.data[i].TD_TRDT = moment(response.data[i].TD_TRDT).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('karvyTrxnCtrl', karvyTrxnCtrl);
