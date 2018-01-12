/**
 * Finatwork-All rights reserved
 */
function config($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, IdleProvider, KeepaliveProvider) {

    // Configure Idle settings
    IdleProvider.idle(5); // in seconds
    IdleProvider.timeout(120); // in seconds

    $urlRouterProvider.otherwise("/forms/my_finatwork");

    $ocLazyLoadProvider.config({
        // Set to true if you want to see what and when is dynamically loaded
        debug: false
    });

    $stateProvider
        .state('home', {
            url: '/'
        })
        .state('dashboards', {
            abstract: true,
            url: "/dashboards",
            templateUrl: "views/common/content.html"
        })
        .state('dashboards.basic_info', {
            url: "/basic-info",
            cache: false,
            templateUrl: "views/basic-info.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.nschandover', {
            url: "/nsc-handover/:sip/:lumpsum",
            cache: false,
            templateUrl: "views/nschandover.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })

        .state('dashboards.serviceCart', {
            url: "/serviceCart",
            cache: false,
            templateUrl: "views/serviceCart.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([]);
                }
            }
        })
        .state('payments', {
            url: "/payments?payment_id&payment_request_id",
            controller: pgResponseController
        })
        .state('dashboards.payments', {
            url: "/information",
            templateUrl: "views/pg_response.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.goals_home', {
            url: "/goals-home",
            cache: false,
            templateUrl: "views/goals_home.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([]);
                }
            }
        })
        .state('dashboards.goal_list', {
            url: "/goal-list/:showLumpsum",
            cache: false,
            templateUrl: "views/goal_list.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'angular-peity',
                            files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                        ]);
                }
            }
        })
        .state('dashboards.goal_info', {
            url: "/goal-info/:type/:pagestatus",
            cache: false,
            templateUrl: "views/goal_details.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['css/plugins/c3/c3.min.css', 'js/plugins/d3/d3.min.js', 'js/plugins/c3/c3.min.js']
                        },
                        {
                            serie: true,
                            name: 'gridshore.c3js.chart',
                            files: ['js/plugins/c3/c3-angular.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['css/plugins/ionRangeSlider/ion.rangeSlider.css', 'css/plugins/ionRangeSlider/ion.rangeSlider.skinFlat.css', 'js/plugins/ionRangeSlider/ion.rangeSlider.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.goal-top-up', {
            url: "/goal-top-up",
            cache: false,
            templateUrl: "views/goalTopUp.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['css/plugins/c3/c3.min.css', 'js/plugins/d3/d3.min.js', 'js/plugins/c3/c3.min.js']
                        },
                        {
                            serie: true,
                            name: 'gridshore.c3js.chart',
                            files: ['js/plugins/c3/c3-angular.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.fund_list', {
            url: "/fund-list",
            cache: false,
            templateUrl: "views/fund_list.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['css/plugins/c3/c3.min.css', 'js/plugins/d3/d3.min.js', 'js/plugins/c3/c3.min.js']
                        },
                        {
                            serie: true,
                            name: 'gridshore.c3js.chart',
                            files: ['js/plugins/c3/c3-angular.min.js']
                        },
                        {
                            name: 'angular-peity',
                            files: ['js/plugins/peity/jquery.peity.min.js', 'js/plugins/peity/angular-peity.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.goal-dashboard', {
            url: "/goal-dashboard",
            cache: false,
            templateUrl: "views/goals/dashboard.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
                        {
                            serie: true,
                            files: ['js/plugins/d3/d3.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })

        .state('dashboards.goalwise-view', {
            url: "/goalwise-view",
            cache: false,
            templateUrl: "views/goals/goalwise_view.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            serie: true,
                            files: ['js/plugins/dataTables/datatables.min.js', 'css/plugins/dataTables/datatables.min.css']
                        },
                        {
                            serie: true,
                            name: 'datatables',
                            files: ['js/plugins/dataTables/angular-datatables.min.js']
                        },
                        {
                            serie: true,
                            name: 'datatables.buttons',
                            files: ['js/plugins/dataTables/angular-datatables.buttons.min.js']
                        },
                        {
                            files: ['js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        },
                        {
                            serie: true,
                            files: ['css/plugins/c3/c3.min.css', 'js/plugins/d3/d3.min.js', 'js/plugins/c3/c3.min.js']
                        },
                        {
                            serie: true,
                            name: 'gridshore.c3js.chart',
                            files: ['js/plugins/c3/c3-angular.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })


        .state('dashboards.portfolio-view', {
            url: "/portfolio-view",
            cache: false,
            templateUrl: "views/goals/portfolio_view.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        },
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.transaction-view', {
            url: "/transcation-view",
            cache: false,
            templateUrl: "views/goals/transaction.html"

        })

        .state('dashboards.risk_health', {
            url: "/risk_health",
            cache: false,
            templateUrl: "views/risk_health.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.3.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['js/plugins/nggrid/ng-grid.css']
                        },
                        {
                            files: ['js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        }
                    ]);
                }
            }
        })

        .state('dashboards.risk_result', {
            url: "/risk_result",
            cache: false,
            templateUrl: "views/risk_result.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.3.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['js/plugins/nggrid/ng-grid.css']
                        },
                        {
                            files: ['js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        }
                    ]);
                }
            }
        })

        .state('dashboards.health_result', {
            url: "/health_result",
            cache: false,
            templateUrl: "views/health_result.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.3.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['js/plugins/nggrid/ng-grid.css']
                        },
                        {
                            files: ['js/plugins/chartJs/Chart.min.js']
                        },
                        {
                            name: 'angles',
                            files: ['js/plugins/chartJs/angles.js']
                        }
                    ]);
                }
            }
        })


        .state('dashboards.kyc-fatca', {
            url: "/kyc-fatca",
            cache: false,
            templateUrl: "views/kyc-fatca.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.dashboard_1', {
            url: "/dashboard_1",
            templateUrl: "views/dashboard_1.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        }
                    ]);
                }
            }
        })
        .state('dashboards_top', {
            abstract: true,
            url: "/dashboards_top",
            templateUrl: "views/common/content_top_navigation.html"
        })
        /*FINGPS*/
        .state('dashboards.finGps', {
            url: "/finGps",
            templateUrl: "views/finGps.html",
            data: {pageTitle: 'finGps'}
        })
        .state('dashboards.finGpsGuideLines', {
            url: "/finGps-guidelines",
            templateUrl: "views/finGpsGuidelines.html",
            data: {pageTitle: 'finGps'}
        })
        .state('forms.finGps', {
            url: "/finGps",
            templateUrl: "views/finGps_form.html",
            controller: wizardCtrl,
            data: {pageTitle: 'FinGps form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.personal&Work', {
            url: "/personal-work",
            templateUrl: "views/personal-work.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.personal&Work.personal', {
            url: "/personal",
            templateUrl: "views/finGpsPersonal.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.personal&Work.work', {
            url: "/work",
            templateUrl: "views/finGpsWork.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.goal', {
            url: "/goal",
            templateUrl: "views/finGpsGoals.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.goal.existingGoal', {
            url: "/Existing-Goal",
            templateUrl: "views/finGpsExistingGoal.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.goal.impGoal', {
            url: "/Important-Goal",
            templateUrl: "views/finGpsImportantGoal.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }

                    ]);
                }
            }
        })
        .state('forms.finGps.goal.additionalGoal', {
            url: "/additional-goals",
            templateUrl: "views/finGpsAdditionalGoal.html",
            data: {pageTitle: 'FinGps form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.finGpsCashFlow', {
            url: "/cash-flow",
            templateUrl: "views/finGpsCashFlow.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.finGpsCashFlow.incomeCashFlow', {
            url: "/income",
            templateUrl: "views/incomeCashFlow.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.finGpsCashFlow.expensesCashFlow', {
            url: "/expenses",
            templateUrl: "views/expensesCashFlow.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.finGpsCashFlow.regularInvestment', {
            url: "/Regular-Investment",
            templateUrl: "views/finGpsRegularInvestment.html",
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.assets&Liabilities', {
            url: "/Assets-Liabilities",
            templateUrl: "views/finGpsAssetsLiabilities.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.assets&Liabilities.assets', {
            url: "/assets",
            templateUrl: "views/finGpsAssets.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.assets&Liabilities.liabilities', {
            url: "/liabilities",
            templateUrl: "views/finGpsLiabilities.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.insurance', {
            url: "/insurance",
            templateUrl: "views/finGpsInsurance.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.insurance.lifeInsurance', {
            url: "/life-insurance",
            templateUrl: "views/finGpsLifeInsurance.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.insurance.generalInsurance', {
            url: "/general-insurance",
            templateUrl: "views/finGpsGeneralInsurance.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.finGps.insurance.pensionPolicy', {
            url: "/pension-policy",
            templateUrl: "views/finGpsPensionPolicy.html",
            controller: wizardCtrl,
            data: {pageTitle: 'finGps'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        }).state('forms.finGps.finGpsDoc_upload', {
        url: "/finGpsDoc_upload",
        templateUrl: "views/finGps_docUpload.html",
        data: {pageTitle: 'finGps'},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        insertBefore: '#loadBefore',
                        name: 'toaster',
                        files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                    },
                    {
                        files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                    }
                ]);
            }
        }
    })
        /*End of FinGps*/
        .state('dashboards.finTax', {
            url: "/finTax",
            templateUrl: "views/finTaxInfoGraphic.html",
            data: {pageTitle: 'fintax'}
        })
        .state('dashboards.fintax', {
            url: "/fintax",
            templateUrl: "views/fintax.html",
            data: {pageTitle: 'fintax'}
        })
        .state('dashboards.fintaxOptimization', {
            url: "/fintaxOptimization",
            templateUrl: "views/taxOptimization.html",
            data: {pageTitle: 'FinTax form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('dashboards.advisor', {
            url: "/advisor",
            templateUrl: "views/advisor.html",
            data: {pageTitle: 'advisor'}
        })
        .state('forms.fintax', {
            url: "/fintax",
            templateUrl: "views/fintax_form.html",
            controller: wizardCtrl,
            data: {pageTitle: 'FinTax form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.fintax.fintaxDoc_upload', {
            url: "/fintaxDoc_upload",
            templateUrl: "views/fintax_docUpload.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.fintax.houseProperty', {
            url: "/houseProperty",
            templateUrl: "views/houseProperty.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.fintax.rent', {
            url: "/rent",
            templateUrl: "views/rent.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.fintax.investment', {
            url: "/investment",
            templateUrl: "views/investment.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.fintax.healthInsurance', {
            url: "/health-insurance",
            templateUrl: "views/healthInsurance.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.fintax.otherInfo', {
            url: "/other-information",
            templateUrl: "views/otherinfo.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling', {
            url: "/returnFiling",
            templateUrl: "views/taxfiling_form.html",
            controller: wizardCtrl,
            data: {pageTitle: 'FinTax form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingPersonalInfo', {
            url: "/Personal-Info",
            templateUrl: "views/filingPersonalInfo.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingBankInfo', {
            url: "/Bank-Info",
            templateUrl: "views/filingBankInfo.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingSalary', {
            url: "/Salary-Income",
            templateUrl: "views/filingSalaryIncome.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingHouseProperty', {
            url: "/House-Property",
            templateUrl: "views/filingHouseProperty.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingCapitalGains', {
            url: "/Capital-Gains",
            templateUrl: "views/filingCapitalGains.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingOtherSources', {
            url: "/Other-Sources",
            templateUrl: "views/filingOtherSources.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingInvestment', {
            url: "/Filing-Investment",
            templateUrl: "views/filingInvestment.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingHealthInsurance', {
            url: "/Health-Insurance",
            templateUrl: "views/filingHealthInsurance.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingOthers', {
            url: "/Others",
            templateUrl: "views/filingOthers.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.returnFiling.filingUploadDocs', {
            url: "/Tax-Filing_Doc_upload",
            templateUrl: "views/filingUploadDocs.html",
            data: {pageTitle: 'FinTax Optimization'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('finsure', {
            url: "/finsure",
            templateUrl: "views/finsure.html",
            data: {pageTitle: 'finsure'}
        })
        .state('finestate', {
            url: "/finestate",
            templateUrl: "views/finestate.html",
            data: {pageTitle: 'finesate'}
        })
        .state('charts', {
            abstract: true,
            url: "/charts",
            templateUrl: "views/common/content.html"
        })
        .state('charts.c3charts', {
            url: "/c3charts",
            templateUrl: "views/c3charts.html",
            data: {pageTitle: 'c3charts'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            serie: true,
                            files: ['css/plugins/c3/c3.min.css', 'js/plugins/d3/d3.min.js', 'js/plugins/c3/c3.min.js']
                        },
                        {
                            serie: true,
                            name: 'gridshore.c3js.chart',
                            files: ['js/plugins/c3/c3-angular.min.js']
                        }
                    ]);
                }
            }
        })
        .state('forms', {
            abstract: true,
            url: "/forms",
            templateUrl: "views/common/content.html"
        })
        .state('forms.my_finatwork', {
            url: "/my_finatwork",
            cache: false,
            templateUrl: "views/my_finatwork.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            name: 'ngGrid',
                            files: ['js/plugins/nggrid/ng-grid-2.0.3.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            files: ['js/plugins/nggrid/ng-grid.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.risk_profile', {
            url: "/risk_profile",
            templateUrl: "views/risk_profile.html",
            data: {pageTitle: 'Risk Profile'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        })
        .state('forms.fin_health', {
            url: "/fin_health",
            templateUrl: "views/fin_health.html",
            cache:false,
            data: {pageTitle: 'FinHealth'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.basic_form', {
            url: "/basic_form",
            templateUrl: "views/form_basic.html",
            data: {pageTitle: 'Basic form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        }
                    ]);
                }
            }
        })
        .state('forms.wizard', {
            url: "/wizard",
            templateUrl: "views/form_wizard.html",
            controller: wizardCtrl,
            data: {pageTitle: 'Wizard form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.wizard.basic_info', {
            url: "/basic-info",
            cache: false,
            templateUrl: "views/basic-info.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.wizard.personal-info', {
            url: "/personal-info",
            cache: false,
            templateUrl: "views/personal-info.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.wizard.bank-info', {
            url: "/bank-info",
            cache: false,
            templateUrl: "views/bank-info.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('forms.wizard.nominee-info', {
            url: "/nominee-info",
            cache: false,
            templateUrl: "views/nominee-info.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        },
                        {
                            files: ['css/plugins/ionRangeSlider/ion.rangeSlider.css', 'css/plugins/ionRangeSlider/ion.rangeSlider.skinFlat.css', 'js/plugins/ionRangeSlider/ion.rangeSlider.min.js']
                        },
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        }
                    ]);
                }
            }
        })

        .state('forms.wizard.kyc-fatca', {
            url: "/kyc-fatca",
            cache: false,
            templateUrl: "views/kyc-fatca.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })

        .state('forms.wizard.file_upload', {
            url: "/file_upload",
            templateUrl: "views/form_file_upload.html",
            data: {pageTitle: 'File upload'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })

        .state('forms.wizard.service_request', {
            url: "/service_request",
            templateUrl: "views/service_request.html",
            data: {pageTitle: 'Service Request'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        },
                        {
                            name: 'summernote',
                            files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js', 'js/plugins/summernote/angular-summernote.min.js']
                        }
                    ]);
                }
            }
        })

        .state('forms.wizard.final_form', {
            url: "/final_form",
            templateUrl: "views/final_form.html",
            data: {pageTitle: 'Final Form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        },
                        {
                            name: 'summernote',
                            files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js', 'js/plugins/summernote/angular-summernote.min.js']
                        }
                    ]);
                }
            }
        })


        .state('forms.wizard.account_verify', {
            url: "/account_verify",
            templateUrl: "views/admin/account_verify.html",
            data: {pageTitle: 'Account Verify'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/dropzone/basic.css', 'css/plugins/dropzone/dropzone.css', 'js/plugins/dropzone/dropzone.js']
                        },
                        {
                            name: 'summernote',
                            files: ['css/plugins/summernote/summernote.css', 'css/plugins/summernote/summernote-bs3.css', 'js/plugins/summernote/summernote.min.js', 'js/plugins/summernote/angular-summernote.min.js']
                        }
                    ]);
                }
            }
        })
        .state('forms.subscription', {
            url: "/subscription/:service",
            templateUrl: "views/form_subscription.html",
            controller: wizardCtrl,
            data: {pageTitle: 'Subscription form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        }).state('forms.subscription.serviceCart', {
        url: "/serviceCart",
        cache: false,
        templateUrl: "views/serviceCart.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    },
                    {
                        files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                    },
                    {
                        insertBefore: '#loadBefore',
                        name: 'toaster',
                        files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                    }
                ]);
            }
        }
    }).state('forms.subscription.payment-history', {
            url: "/payment-history",
            cache: false,
            templateUrl: "views/payment_history.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('login', {
            url: "/login",
            controller: loginCtrl,
            templateUrl: "views/login.html",
            data: {pageTitle: 'Login', specialClass: 'gray-bg'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('register', {
            url: "/register",
            controller: registerCtrl,
            templateUrl: "views/register.html",
            data: {pageTitle: 'Register', specialClass: 'gray-bg'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('verify_otp', {
            url: "/verify_otp",
            controller: verifyOTPCtrl,
            templateUrl: "views/verify_otp.html",
            data: {pageTitle: 'verify OTP', specialClass: 'gray-bg'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('resendOTP', {
            url: "/resendOTP",
            controller: reSendOTPCtrl,
            templateUrl: "views/resendOTP.html",
            data: {pageTitle: 'ResendOTP', specialClass: 'gray-bg'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        //Confirm password and reset password
        .state('forgot_password', {
            url: "/forgot_password",
            controller: forgotPasswordCtrl,
            templateUrl: "views/forgot_password.html",
            data: {pageTitle: 'Forgot password', specialClass: 'gray-bg'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('reset', {
            url: "/reset/:token",
            controller: resetPasswordCtrl,
            templateUrl: "views/confirm_password.html",
            data: { pageTitle: 'Confirm password', specialClass: 'gray-bg' },
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
       .state('admin', {
            abstract: false,
            url: "/admin",
            templateUrl: "views/common/content.html"
        })
        .state('forms.transaction', {
            url: "/operations",
            templateUrl: "views/admin/transactionDetails.html",
            controller: wizardCtrl,
            data: {pageTitle: 'Wizard form'},
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['css/plugins/steps/jquery.steps.css']
                        }
                    ]);
                }
            }
        }).state('forms.transaction.goal-status', {
        url: "/goal-status",
        cache: false,
        templateUrl: "views/admin/goalStatus.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('forms.transaction.transaction-status', {
        url: "/transaction-status",
        cache: false,
        templateUrl: "views/admin/trxnStatusAdmin.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    })
        .state('admin.clients', {
            url: "/clients",
            cache: false,
            templateUrl: "views/admin/clients.html",
            resolve: {
                loadPlugin: function ($ocLazyLoad) {
                    return $ocLazyLoad.load([
                        {
                            files: ['js/plugins/moment/moment.min.js']
                        },
                        {
                            files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                        },
                        {
                            files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                        },
                        {
                            files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                        },
                        {
                            name: 'datePicker',
                            files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                        },
                        {
                            insertBefore: '#loadBefore',
                            name: 'toaster',
                            files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                        }
                    ]);
                }
            }
        })
        .state('admin.userQuery', {
        url: "/user-query-status",
        cache: false,
        templateUrl: "views/admin/userQuery.html"
    }).state('admin.clientLoginStatus', {
        url: "/clientstatus",
        cache: false,
        templateUrl: "views/admin/client_login_status.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.basicInformationStatus', {
        url: "/basic-information-status",
        cache: false,
        templateUrl: "views/admin/basic_information_status.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.personalInformationStatus', {
        url: "/personal-information-status",
        cache: false,
        templateUrl: "views/admin/personal_information_status.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.bankInformationStatus', {
        url: "/bank-information-status",
        cache: false,
        templateUrl: "views/admin/bank_info_status.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.kycFatcaStatus', {
        url: "/kyc-fatca-status",
        cache: false,
        templateUrl: "views/admin/kycFatcaStatus.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.account-verify', {
        url: "/account-verify",
        cache: false,
        templateUrl: "views/admin/account_verify.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    },
                    {
                        files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                    },
                    {
                        files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                    },
                    {
                        files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                    },
                    {
                        name: 'datePicker',
                        files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                    },
                    {
                        insertBefore: '#loadBefore',
                        name: 'toaster',
                        files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                    }
                ]);
            }
        }
    }).state('admin.reverse_feed', {
        url: "/reverse_feed",
        cache: false,
        templateUrl: "views/admin/reverse_feed.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    },
                    {
                        files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                    },
                    {
                        files: ['https://maps.google.com/maps/api/js?libraries=places&key=AIzaSyDQTpXj82d8UpCi97wzo_nKXL7nYrd4G70']
                    },
                    {
                        files: ['css/plugins/touchspin/jquery.bootstrap-touchspin.min.css', 'js/plugins/touchspin/jquery.bootstrap-touchspin.min.js']
                    },
                    {
                        name: 'datePicker',
                        files: ['css/plugins/datapicker/angular-datapicker.css', 'js/plugins/datapicker/angular-datepicker.js']
                    },
                    {
                        insertBefore: '#loadBefore',
                        name: 'toaster',
                        files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                    }
                ]);
            }
        }
    }).state('admin.report', {
        url: "/report",
        cache: false,
        templateUrl: "views/admin/report.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.camsTrxn', {
        url: "/camsTrxn",
        cache: false,
        templateUrl: "views/admin/camsTrxn.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.karvyTrxn', {
        url: "/karvyTrxn",
        cache: false,
        templateUrl: "views/admin/karvyTrxn.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    }).state('admin.franklinTrxn', {
        url: "/franklinTrxn",
        cache: false,
        templateUrl: "views/admin/franklinTrxn.html",
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['js/plugins/moment/moment.min.js']
                    }
                ]);
            }
        }
    })
    .state('prefinhealth', {
        url: "/prefinhealth",
        templateUrl: "views/fin_health.html",
        cache:false,
        data: {pageTitle: 'FinHealth'},
        resolve: {
            loadPlugin: function ($ocLazyLoad) {
                return $ocLazyLoad.load([
                    {
                        files: ['css/plugins/iCheck/custom.css', 'js/plugins/iCheck/icheck.min.js']
                    },
                    {
                        insertBefore: '#loadBefore',
                        name: 'toaster',
                        files: ['js/plugins/toastr/toastr.min.js', 'css/plugins/toastr/toastr.min.css']
                    }
                ]);
            }
        }
    });

}
angular
    .module('finatwork')
    .config(config)
    .run(function ($rootScope, $state, $location) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){
            if(toState.name === 'login' ||
                toState.name === "register" ||
                toState.name === "forgot_password" ||
                toState.name === "resendOTP" ||
                toState.name === "reset" ||
                toState.name === "verify_otp" ||
                toState.name === "prefinhealth"
            ) return;
            if (window.localStorage.getItem("token") == null){
                $state.transitionTo("login");
                event.preventDefault();
            }
        });
        $rootScope.$state = $state;
        $rootScope.$on('scope.stored', function (event, data) {});
    });

var config = {
    "login": "/users/login",
    "register": "/users/register",
    "base_url": "http://ec2-52-66-109-197.ap-south-1.compute.amazonaws.com:3000/"

};
window.config = config;
