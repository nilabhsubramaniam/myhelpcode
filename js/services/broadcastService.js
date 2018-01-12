/**
 * Created by Asad on 10/05/17.
 */

angular.module('finatwork').factory('broadcastService', function($rootScope) {
    return {
        send: function(msg, data) {
            $rootScope.$broadcast(msg, data);
        }
    }
});
