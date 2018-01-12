function clientsCtrl($scope, $http, toaster, uiGridConstants, $rootScope, fintaxService, fintaxFilingService) {
    $scope.gridOptions = {
        multiSelect: false,
        enableSelectAll: false,
        enableSelectionBatchEvent: false,
        selectionRowHeaderWidth: 25,
        rowHeight: 25,
        showGridFooter: true,
        enableFiltering: true
    };

    $scope.categoryHashReverse = {
        'unassigned': '1',
        'prospect-followup': '2',
        'prospect-newsletter': '3',
        'client-underprocess': '4',
        'client-active': '5'
    };

    $scope.advisorHashReverse = {
        'Neeti': '1',
        'Saurabh': '2',
        'Subhajit': '3',
        'Megha': '4'
    };

    $scope.gridOptions.columnDefs = [
        {name: 'Name', field: 'fullName',enableCellEdit: false, pinnedLeft: true},
        {name: 'Email', field: 'username',enableCellEdit: false},
        {name: 'Mobile', field: 'mobile',enableCellEdit: false,width: '10%'},
        {name: 'Last Login', field: 'last',enableCellEdit: false,cellFilter: 'date', type: 'date'},
        {name: 'Account Status', field: 'acctStatus',enableCellEdit: false},
        {
            name: 'Category',
            "field": "category",
            width: '15%',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [
                    {value: '1', label: 'unassigned'},
                    {value: '2', label: 'prospect-followup'},
                    {value: '3', label: 'prospect-newsletter'},
                    {value: '4', label: 'client-underprocess'},
                    {value: '5', label: 'client-active'}
                ]
            },
            cellFilter: 'mapCategory',
            editDropdownValueLabel: 'category',
            editDropdownOptionsArray: [
                {id: 1, category: 'unassigned'},
                {id: 2, category: 'prospect-followup'},
                {id: 3, category: 'prospect-newsletter'},
                {id: 4, category: 'client-underprocess'},
                {id: 5, category: 'client-active'}
            ]
        },
        {
            name: 'Advisor',
            field: 'advisor',
            width: '10%',
            editableCellTemplate: 'ui-grid/dropdownEditor',
            filter: {
                type: uiGridConstants.filter.SELECT,
                selectOptions: [
                    {value: '1', label: 'Neeti'},
                    {value: '2', label: 'Saurabh'},
                    {value: '3', label: 'Subhajit'},
                    {value: '4', label: 'Megha'}
                ]
            },
            cellFilter: 'mapAdvisor',
            editDropdownValueLabel: 'advisor',
            editDropdownOptionsArray: [
                {id: 1, advisor: 'Neeti'},
                {id: 2, advisor: 'Saurabh'},
                {id: 3, advisor: 'Subhajit'},
                {id: 4, advisor: 'Megha'}
            ]
        }
    ];

    $scope.gridOptions.onRegisterApi = function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.edit.on.afterCellEdit($scope, function (rowEntity, colDef, newValue, oldValue) {
            if (newValue !== undefined && newValue != oldValue) {
                var data = {_userid: rowEntity._userid};
                if (colDef.name === 'Category') {
                    data.category = colDef.editDropdownOptionsArray[newValue - 1].category
                } else if (colDef.name === 'Advisor') {
                    data.advisor = colDef.editDropdownOptionsArray[newValue - 1].advisor
                }

                $http({
                    method: 'POST',
                    url: window.link.engagement + '/' + rowEntity._userid,
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

        gridApi.selection.on.rowSelectionChanged($scope, function (row) {
            if (row.isSelected) {
                window.currentUesrId = row.entity._userid;
                window.currentUserFullName = row.entity.fullName;
                toaster.success({body: window.currentUserFullName + " Profile Loaded!"});
                $rootScope.name = window.currentUserFullName;
                $("#full_name").text(window.currentUserFullName);
                fintaxService.reset();
                fintaxFilingService.reset();
            }
        });
    };

    $http({
        method: 'GET',
        url: window.link.users,
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (user) {
            user.last = moment(user.last).format('DD-MMM-YY, h:mm:ss a');
            user.fullName = user.firstname + ' ' + user.lastname;
            user.category = $scope.categoryHashReverse[user.category];
            user.advisor = $scope.advisorHashReverse[user.advisor];
        });
        $scope.gridOptions.data = response.data;
    }, function errorCallback(response) {
        console.log(response);
    });
}

angular
    .module('finatwork')
    .controller('clientsCtrl', clientsCtrl)
    .filter('mapCategory', function () {
        var categoryHash = {
            1: 'unassigned',
            2: 'prospect-followup',
            3: 'prospect-newsletter',
            4: 'client-underprocess',
            5: 'client-active'
        };

        return function (input) {
            if (!input) {
                return '';
            } else {
                return categoryHash[input];
            }
        };
    })
    .filter('mapAdvisor', function () {
        var advisorHash = {
            1: 'Neeti',
            2: 'Saurabh',
            3: 'Subhajit',
            4: 'Megha'
        };

        return function (input) {
            if (!input) {
                return '';
            } else {
                return advisorHash[input];
            }
        };
    });

/*TODO
 * Delete functionality
 * reduce header size
 * selectionRowHeaderWidth
 * rowHeight*/