/**
 * Finatwork-All rights reserved to finatwork wealth services
 *
 */
(function () {
    angular.module('finatwork', [
        'ui.router',                    // Routing
        'oc.lazyLoad',                  // ocLazyLoad
        'ui.bootstrap',                 // Ui Bootstrap
        'pascalprecht.translate',       // Angular Translate
        'ngIdle',                       // Idle timer
        'ngSanitize',                   // ngSanitize
        'toaster',
        'ngCsv',
        'ui.grid',
        'ui.grid.edit',
        'ui.grid.expandable',
        'ui.grid.selection',
        'ui.grid.pinning',
        'ui.grid.autoResize',
        'rzModule',
        'angularModalService'
    ])
})();

// Other libraries are loaded dynamically in the config.js file using the library ocLazyLoad