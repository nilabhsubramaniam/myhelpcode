var HEADER_NAME = 'FinatWork-Handle-Errors-Generically';
var specificallyHandleInProgress = false;

angular.module('finatwork').factory('RequestsErrorHandler', ['$q', 'toaster', '$location', '$window', function($q,toaster,$location,$window) {
    return {
        // --- The user's API for claiming responsiblity for requests ---
        specificallyHandled: function(specificallyHandledBlock) {
            specificallyHandleInProgress = true;
            try {
                return specificallyHandledBlock();
            } finally {
                specificallyHandleInProgress = false;
            }
        },

        // --- Response interceptor for handling errors generically ---
        responseError: function(rejection) {
            var shouldHandle = (rejection && rejection.config && rejection.config.headers
                && rejection.config.headers[HEADER_NAME]);

            if (shouldHandle) {
                // --- Your generic error handling goes here ---
                if(rejection.data != null){
                    if(rejection.data.err.name != null && rejection.data.err.name == "TokenExpiredError"){
                        // toaster.error({body: rejection.data.err.message});
                        toaster.error({body: 'Session expired, please login again'});
                        $window.localStorage.clear();
                        $location.path("/login");
                    } else if (typeof rejection.data.err == 'string') {
                        toaster.error({body: rejection.data.err});
                    } else if (typeof rejection.data.err.message == 'string') {
                        toaster.error({body: rejection.data.err.message});
                    } else if (typeof rejection.data.err.message.message == 'string') {
                        toaster.error({body: rejection.data.err.message.message});
                    } else {
                        toaster.error({body: 'Sorry, Looks like something went wrong on our end.'});
                    }
                } else {
                    toaster.error({body: 'Sorry, Looks like something went wrong on our end.'});
                }
            }

            return $q.reject(rejection);
        }
    };
}]);

angular.module('finatwork').config(['$provide', '$httpProvider', function($provide, $httpProvider) {
    $httpProvider.interceptors.push('RequestsErrorHandler');

    // --- Decorate $http to add a special header by default ---

    function addHeaderToConfig(config) {
        config = config || {};
        config.headers = config.headers || {};

        // Add the header unless user asked to handle errors himself
        if (!specificallyHandleInProgress) {
            config.headers[HEADER_NAME] = true;
        }

        return config;
    }

    // The rest here is mostly boilerplate needed to decorate $http safely
    $provide.decorator('$http', ['$delegate', function($delegate) {
        function decorateRegularCall(method) {
            return function(url, config) {
                return $delegate[method](url, addHeaderToConfig(config));
            };
        }

        function decorateDataCall(method) {
            return function(url, data, config) {
                return $delegate[method](url, data, addHeaderToConfig(config));
            };
        }

        function copyNotOverriddenAttributes(newHttp) {
            for (var attr in $delegate) {
                if (!newHttp.hasOwnProperty(attr)) {
                    if (typeof($delegate[attr]) === 'function') {
                        newHttp[attr] = function() {
                            return $delegate[attr].apply($delegate, arguments);
                        };
                    } else {
                        newHttp[attr] = $delegate[attr];
                    }
                }
            }
        }

        var newHttp = function(config) {
            return $delegate(addHeaderToConfig(config));
        };

        newHttp.get = decorateRegularCall('get');
        newHttp.delete = decorateRegularCall('delete');
        newHttp.head = decorateRegularCall('head');
        newHttp.jsonp = decorateRegularCall('jsonp');
        newHttp.post = decorateDataCall('post');
        newHttp.put = decorateDataCall('put');

        copyNotOverriddenAttributes(newHttp);

        return newHttp;
    }]);
}]);

