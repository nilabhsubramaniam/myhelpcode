/**
 * Created by Finatwork on 06-02-2017.
 */
function transcationController($scope, $http) {
    $http({
        method: 'GET',
        url: window.link.create_goal + "?state=transect&view=goal&userid=" + getUserId(),
        headers: {'x-access-token': window.localStorage.getItem('token')}
    }).then(function successCallback(response) {
        response.data.forEach(function (goal) {
            if (goal.state == 'failed' || goal.stateTopUp == 'failed') {
                goal.state = 'Failure';
                if( goal.stateTopUp == 'failed'){
                    goal.lumpsum = goal.lumpsumTopUp;
                    goal.sip = goal.sipTopUp;
                }
                goal.trxnFailureReason = 'Oops! There was an unexpected error. Our team will get back shortly on how to resolve the same. '
            } else if (goal.state == 'processing' || goal.stateTopUp == 'processingTopUp') {
                goal.state = 'Processing';
                if(goal.stateTopUp == 'processingTopUp'){
                    goal.lumpsum = goal.lumpsumTopUp;
                    goal.sip = goal.sipTopUp;
                }
                goal.trxnFailureReason = 'Please wait for 3 days for the transaction to reflect in system. '
            }
            goal.updatedAt = moment(goal.updatedAt).format('DD-MMM-YYYY h:mm A');
        });
        $scope.goals = response.data;
    }, function errorCallback(response) {

    });

}
angular.module('finatwork').controller('transcationController', transcationController);
