/**
 * Created by Suraj on 23-May-17.
 */

function camsTrxnCtrl($scope, $http) {
    $scope.gridOptions = {
        enableFiltering: true
    };
    $scope.gridOptions.columnDefs = [
         {name: 'Investor Name', "field": "INV_NAME",pinnedLeft: true},
        {name: 'Pan', "field": "PAN", width: '9%'},
        {name: 'Fund Name', "field": "SCHEME", width: '15%'},
        {name: 'Units', "field": "UNITS", width: '6%'},
        {name: 'Price', "field": "PURPRICE", width: '7%'},
         {name: 'Amount', "field": "AMOUNT", width: '7%'},
        {name: 'Trade Date', "field": "TRADDATE",width: '15%',cellFilter: 'date', type: 'date'},
        {name: 'Folio', "field": "FOLIO_NO", width: '9%'},
        {name: 'Trxn Type', "field": "TRXN_TYPE_",width: '5%'},
        {name: 'UniqueNo', "field": "SEQ_NO", width: '9%'},
        {name: 'Status', "field": "processed", width: '5%'}
    ];
    $http({
        method: 'GET',
        url: window.link.camsTrxn,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        for (var i = 0; i < response.data.length; i++) {
           if(response.data[i].TRADDATE) response.data[i].TRADDATE = moment(response.data[i].TRADDATE).format('DD-MMM-YYYY h:mm A');
        }
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular.module('finatwork').controller('camsTrxnCtrl', camsTrxnCtrl);
