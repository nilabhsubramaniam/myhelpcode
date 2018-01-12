/**
 * Finatwork- Rights reserved to finatwork wealth services
 *
 * Main directives.js file
 * Define directives for used plugin
 *
 *
 * Functions (directives)
 *  - sideNavigation
 *  - iboxTools
 *  - minimalizaSidebar
 *  - vectorMap
 *  - sparkline
 *  - icheck
 *  - ionRangeSlider
 *  - dropZone
 *  - responsiveVideo
 *  - chatSlimScroll
 *  - customValid
 *  - fullScroll
 *  - closeOffCanvas
 *  - clockPicker
 *  - landingScrollspy
 *  - fitHeight
 *  - iboxToolsFullScreen
 *  - slimScroll
 *  - truncate
 *  - touchSpin
 *  - markdownEditor
 *  - resizeable
 *
 */


/**
 * pageTitle - Directive for set Page title - mata title
 */
function pageTitle($rootScope, $timeout) {
    return {
        link: function(scope, element) {
            var listener = function(event, toState, toParams, fromState, fromParams) {
                // Default title - load on Dashboard 1
                var title = 'Finatwork Wealth Services';
                // Create your own title pattern
                if (toState.data && toState.data.pageTitle) title = 'Finatwork | ' + toState.data.pageTitle;
                $timeout(function() {
                    element.text(title);
                });
            };
            $rootScope.$on('$stateChangeStart', listener);
        }
    }
};

/**
 * sideNavigation - Directive for run metsiMenu on sidebar navigation
 */
function sideNavigation($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();

            });
        }
    };
};

/**
 * responsibleVideo - Directive for responsive video
 */
function responsiveVideo() {
    return {
        restrict: 'A',
        link:  function(scope, element) {
            var figure = element;
            var video = element.children();
            video
                .attr('data-aspectRatio', video.height() / video.width())
                .removeAttr('height')
                .removeAttr('width')

            //We can use $watch on $window.innerWidth also.
            $(window).resize(function() {
                var newWidth = figure.width();
                video
                    .width(newWidth)
                    .height(newWidth * video.attr('data-aspectRatio'));
            }).resize();
        }
    }
}

/**
 * iboxTools - Directive for iBox tools elements in right corner of ibox
 */
function iboxTools($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
                // Function for close ibox
                $scope.closebox = function () {
                    var ibox = $element.closest('div.ibox');
                    ibox.remove();
                }
        }
    };
}

/**
 * iboxTools with full screen - Directive for iBox tools elements in right corner of ibox with full screen option
 */
function iboxToolsFullScreen($timeout) {
    return {
        restrict: 'A',
        scope: true,
        templateUrl: 'views/common/ibox_tools_full_screen.html',
        controller: function ($scope, $element) {
            // Function for collapse ibox
            $scope.showhide = function () {
                var ibox = $element.closest('div.ibox');
                var icon = $element.find('i:first');
                var content = ibox.find('div.ibox-content');
                content.slideToggle(200);
                // Toggle icon from up to down
                icon.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
                ibox.toggleClass('').toggleClass('border-bottom');
                $timeout(function () {
                    ibox.resize();
                    ibox.find('[id^=map-]').resize();
                }, 50);
            };
            // Function for close ibox
            $scope.closebox = function () {
                var ibox = $element.closest('div.ibox');
                ibox.remove();
            };
            // Function for full screen
            $scope.fullscreen = function () {
                var ibox = $element.closest('div.ibox');
                var button = $element.find('i.fa-expand');
                $('body').toggleClass('fullscreen-ibox-mode');
                button.toggleClass('fa-expand').toggleClass('fa-compress');
                ibox.toggleClass('fullscreen');
                setTimeout(function() {
                    $(window).trigger('resize');
                }, 100);
            }
        }
    };
}

/**
 * minimalizaSidebar - Directive for minimalize sidebar
*/
function minimalizaSidebar($timeout) {
    return {
        restrict: 'A',
        template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
        controller: function ($scope, $element) {
            $scope.minimalize = function () {
                $("body").toggleClass("mini-navbar");
                if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {
                    // Hide menu in order to smoothly turn on when maximize menu
                    $('#side-menu').hide();
                    // For smoothly turn on menu
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 200);
                } else if ($('body').hasClass('fixed-sidebar')){
                    $('#side-menu').hide();
                    setTimeout(
                        function () {
                            $('#side-menu').fadeIn(400);
                        }, 100);
                } else {
                    // Remove all inline style from jquery fadeIn function to reset menu state
                    $('#side-menu').removeAttr('style');
                }
            }
        }
    };
};


function closeOffCanvas() {
    return {
        restrict: 'A',
        template: '<a class="close-canvas-menu" ng-click="closeOffCanvas()"><i class="fa fa-times"></i></a>',
        controller: function ($scope, $element) {
            $scope.closeOffCanvas = function () {
                $("body").toggleClass("mini-navbar");
            }
        }
    };
}

/**
 * vectorMap - Directive for Vector map plugin
 */
function vectorMap() {
    return {
        restrict: 'A',
        scope: {
            myMapData: '=',
        },
        link: function (scope, element, attrs) {
            var map = element.vectorMap({
                map: 'world_mill_en',
                backgroundColor: "transparent",
                regionStyle: {
                    initial: {
                        fill: '#e4e4e4',
                        "fill-opacity": 0.9,
                        stroke: 'none',
                        "stroke-width": 0,
                        "stroke-opacity": 0
                    }
                },
                series: {
                    regions: [
                        {
                            values: scope.myMapData,
                            scale: ["#1ab394", "#22d6b1"],
                            normalizeFunction: 'polynomial'
                        }
                    ]
                },
            });
            var destroyMap = function(){
                element.remove();
            };
            scope.$on('$destroy', function() {
                destroyMap();
            });
        }
    }
}


/**
 * sparkline - Directive for Sparkline chart
 */
function sparkline() {
    return {
        restrict: 'A',
        scope: {
            sparkData: '=',
            sparkOptions: '=',
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.sparkData, function () {
                render();
            });
            scope.$watch(scope.sparkOptions, function(){
                render();
            });
            var render = function () {
                $(element).sparkline(scope.sparkData, scope.sparkOptions);
            };
        }
    }
};

/**
 * icheck - Directive for custom checkbox icheck
 */
function icheck($timeout) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, $attrs, ngModel) {
            return $timeout(function() {
                var value;
                value = $attrs['value'];

                $scope.$watch($attrs['ngModel'], function(newValue){
                    $(element).iCheck('update');
                })

                return $(element).iCheck({
                    checkboxClass: 'icheckbox_square-red',
                    radioClass: 'iradio_square-red'

                }).on('ifChanged', function(event) {
                        if ($(element).attr('type') === 'checkbox' && $attrs['ngModel']) {
                            $scope.$apply(function() {
                                return ngModel.$setViewValue(event.target.checked);
                            });
                        }
                        if ($(element).attr('type') === 'radio' && $attrs['ngModel']) {
                            return $scope.$apply(function() {
                                return ngModel.$setViewValue(value);
                            });
                        }
                    });
            });
        }
    };
}

/**
 * ionRangeSlider - Directive for Ion Range Slider
 */
function ionRangeSlider() {
    return {
        restrict: 'A',
        scope: {
            rangeOptions: '='
        },
        link: function (scope, elem, attrs) {
            elem.ionRangeSlider(scope.rangeOptions);
        }
    }
}

/**
 * dropZone - Directive for Drag and drop zone file upload plugin
 */
function dropZone() {
    return {
        restrict: 'C',
        link: function(scope, element, attrs) {

            var config = {
                url: 'http://localhost:8080/upload',
                maxFilesize: 100,
                paramName: "uploadfile",
                maxThumbnailFilesize: 10,
                parallelUploads: 1,
                autoProcessQueue: false
            };

            var eventHandlers = {
                'addedfile': function(file) {
                    scope.file = file;
                    if (this.files[1]!=null) {
                        this.removeFile(this.files[0]);
                    }
                    scope.$apply(function() {
                        scope.fileAdded = true;
                    });
                },

                'success': function (file, response) {
                }

            };

            dropzone = new Dropzone(element[0], config);

            angular.forEach(eventHandlers, function(handler, event) {
                dropzone.on(event, handler);
            });

            scope.processDropzone = function() {
                dropzone.processQueue();
            };

            scope.resetDropzone = function() {
                dropzone.removeAllFiles();
            }
        }
    }
}

/**
 * chatSlimScroll - Directive for slim scroll for small chat
 */
function chatSlimScroll($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '234px',
                    railOpacity: 0.4
                });

            });
        }
    };
}

/**
 * customValid - Directive for custom validation example
 */
function customValid(){
    return {
        require: 'ngModel',
        link: function(scope, ele, attrs, c) {
            scope.$watch(attrs.ngModel, function() {

                // You can call a $http method here
                // Or create custom validation

                var validText = "Inspinia";

                if(scope.extras == validText) {
                    c.$setValidity('cvalid', true);
                } else {
                    c.$setValidity('cvalid', false);
                }

            });
        }
    }
}


/**
 * fullScroll - Directive for slimScroll with 100%
 */
function fullScroll($timeout){
    return {
        restrict: 'A',
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: '100%',
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * slimScroll - Directive for slimScroll with custom height
 */
function slimScroll($timeout){
    return {
        restrict: 'A',
        scope: {
            boxHeight: '@'
        },
        link: function(scope, element) {
            $timeout(function(){
                element.slimscroll({
                    height: scope.boxHeight,
                    railOpacity: 0.9
                });

            });
        }
    };
}

/**
 * clockPicker - Directive for clock picker plugin
 */
function clockPicker() {
    return {
        restrict: 'A',
        link: function(scope, element) {
                element.clockpicker();
        }
    };
};


/**
 * landingScrollspy - Directive for scrollspy in landing page
 */
function landingScrollspy(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            element.scrollspy({
                target: '.navbar-fixed-top',
                offset: 80
            });
        }
    }
}

/**
 * fitHeight - Directive for set height fit to window height
 */
function fitHeight(){
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.css("height", $(window).height() + "px");
            element.css("min-height", $(window).height() + "px");
        }
    };
}

/**
 * truncate - Directive for truncate string
 */
function truncate($timeout){
    return {
        restrict: 'A',
        scope: {
            truncateOptions: '='
        },
        link: function(scope, element) {
            $timeout(function(){
                element.dotdotdot(scope.truncateOptions);

            });
        }
    };
}


/**
 * touchSpin - Directive for Bootstrap TouchSpin
 */
function touchSpin() {
    return {
        restrict: 'A',
        scope: {
            spinOptions: '='
        },
        link: function (scope, element, attrs) {
            scope.$watch(scope.spinOptions, function(){
                render();
            });
            var render = function () {
                $(element).TouchSpin(scope.spinOptions);
            };
        }
    }
};

/**
 * markdownEditor - Directive for Bootstrap Markdown
 */
function markdownEditor() {
    return {
        restrict: "A",
        require:  'ngModel',
        link:     function (scope, element, attrs, ngModel) {
            $(element).markdown({
                savable:false,
                onChange: function(e){
                    ngModel.$setViewValue(e.getContent());
                }
            });
        }
    }
};


function fileModel($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    }
};


/**
 *
 * Pass all functions into module
 */
angular
    .module('finatwork')
    .directive('pageTitle', pageTitle)
    .directive('sideNavigation', sideNavigation)
    .directive('iboxTools', iboxTools)
    .directive('minimalizaSidebar', minimalizaSidebar)
    .directive('vectorMap', vectorMap)
    .directive('sparkline', sparkline)
    .directive('icheck', icheck)
    .directive('ionRangeSlider', ionRangeSlider)
    .directive('dropZone', dropZone)
    .directive('responsiveVideo', responsiveVideo)
    .directive('chatSlimScroll', chatSlimScroll)
    .directive('customValid', customValid)
    .directive('fullScroll', fullScroll)
    .directive('closeOffCanvas', closeOffCanvas)
    .directive('clockPicker', clockPicker)
    .directive('landingScrollspy', landingScrollspy)
    .directive('fitHeight', fitHeight)
    .directive('iboxToolsFullScreen', iboxToolsFullScreen)
    .directive('slimScroll', slimScroll)
    .directive('truncate', truncate)
    .directive('touchSpin', touchSpin)
    .directive('fileModel', fileModel)
    .directive('markdownEditor', markdownEditor)

angular.module('finatwork')
     .service('c3ChartService', function() {
        return {};
    })
    .directive('c3Chart', ['c3ChartService', function(c3ChartService) {
        return {
          // this directive can be used as an Element or an Attribute
          restrict: 'EA',
          scope: {
            config: '='
          },
          template: '<div></div>',
          replace: true,
          controller: function($scope, $element) {
            // Wait until id is set before binding chart to this id
            $scope.$watch($element, function() {
              
              if ('' === $element[0].id) {
                return;
              }
              
              // binding chart to element with provided ID
              $scope.config.bindto = '#' + $element[0].id;

              //Generating the chart on every data change
              $scope.$watch('config', function(newConfig, oldConfig) {
                
               c3ChartService[$scope.config.bindto] = c3.generate(newConfig);
                
                // if there is no size specified, we are assuming, that chart will have width
                // of its container (proportional of course) - great for responsive design
                if (!newConfig.size) {
                  c3ChartService[$scope.config.bindto].resize();
                }
                
                // only updating data (enables i.e. animations)
                $scope.$watch('config.data', function(newData, oldData) {
                  if ($scope.config.bindto) {
                    c3ChartService[$scope.config.bindto].load(newData);
                  }
                }, true);
              }, true);
            });
          }
        };
    }]);


angular.module("finatwork").directive('ngRadialGauge', ['$window', '$timeout',
 function ($window, $timeout) {
     return {
         restrict: 'EAC',
         scope: {
             data: '=',
             lowerLimit: '=',
             upperLimit: '=',
             ranges: '=',
             value: '=',
             valueUnit: '=',
             precision: '=',
             majorGraduationPrecision: '=',
             label: '@',
             onClick: '&'
         },
         link: function (scope, ele, attrs) {
             var defaultUpperLimit = 100;
             var defaultLowerLimit = 0;
             var initialized = false;

             var renderTimeout;
             var gaugeAngle = parseInt(attrs.angle) || 120;

             //New width variable, now works in conjunction with fixed viewBox sizing
             var _width = attrs.width || "100%";

             /* Colin Bester
                Width and height are not really such an issue with SVG but choose these values as
                width of 300 seems to be pretty baked into code.
                I took the easy path seeing as size is not that relevant and hard coded width and height
                as I was too lazy to dig deep into code.
                May be the wrong call, but seems safe option.
             */
             var view = {
                width  : 300,
                height : 225
             };
             var innerRadius = Math.round((view.width * 130) / 300);
             var outerRadius = Math.round((view.width * 145) / 300);
             var majorGraduations = parseInt(attrs.majorGraduations - 1) || 5;
             var minorGraduations = parseInt(attrs.minorGraduations) || 10;
             var majorGraduationLength = Math.round((view.width * 16) / 300);
             var minorGraduationLength = Math.round((view.width * 10) / 300);
             var majorGraduationMarginTop = Math.round((view.width * 7) / 300);
             var majorGraduationColor = attrs.majorGraduationColor || "#B0B0B0";
             var minorGraduationColor = attrs.minorGraduationColor || "#D0D0D0";
             var majorGraduationTextColor = attrs.majorGraduationTextColor || "#6C6C6C";
             var needleColor = attrs.needleColor || "#416094";
             var valueVerticalOffset = Math.round((view.width * 30) / 300);
             var inactiveColor = "#D7D7D7";
             var transitionMs = parseInt(attrs.transitionMs) || 750;
             var majorGraduationTextSize = parseInt(attrs.majorGraduationTextSize);
             var needleValueTextSize = parseInt(attrs.needleValueTextSize);
             var needle = undefined;

             //The scope.data object might contain the data we need, otherwise we fall back on the scope.xyz property
             var extractData = function (prop) {
                 if (!scope.data) return scope[prop];
                 if (scope.data[prop] === undefined || scope.data[prop] == null) {
                     return scope[prop];
                 }
                 return scope.data[prop];
             };

             var maxLimit;
             var minLimit;
             var value;
             var valueUnit;
             var precision;
             var majorGraduationPrecision;
             var ranges;
             
             var updateInternalData = function() {
                 maxLimit = extractData('upperLimit') ? extractData('upperLimit') : defaultUpperLimit;
                 minLimit = extractData('lowerLimit') ? extractData('lowerLimit') : defaultLowerLimit;
                 value = extractData('value');
                 valueUnit = extractData('valueUnit');
                 precision = extractData('precision');
                 majorGraduationPrecision = extractData('majorGraduationPrecision');
                 ranges = extractData('ranges');
             };
             updateInternalData();
             
             /* Colin Bester
                Add viewBox and width attributes.
                Used view.width and view.height in case it's decided that hardcoding these values is an issue.
                Width can be specified as %, px etc and will scale image to fit.
             */
             var svg = d3.select(ele[0])
                 .append('svg')
                 .attr('width', _width)
                 .attr('viewBox', '0 0 '+view.width+' '+view.height);
                 // .attr('view.width', view.width)
                 // .attr('height', view.width * 0.75);
             var renderMajorGraduations = function (majorGraduationsAngles) {
                 var centerX = view.width / 2;
                 var centerY = view.width / 2;
                 //Render Major Graduations
                 majorGraduationsAngles.forEach(function (pValue, index) {
                     var cos1Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength));
                     var sin1Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength));
                     var cos2Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                     var sin2Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                     var x1 = centerX + cos1Adj;
                     var y1 = centerY + sin1Adj * -1;
                     var x2 = centerX + cos2Adj;
                     var y2 = centerY + sin2Adj * -1;
                     svg.append("svg:line")
                     .attr("x1", x1)
                     .attr("y1", y1)
                     .attr("x2", x2)
                     .attr("y2", y2)
                     .style("stroke", majorGraduationColor);

                     renderMinorGraduations(majorGraduationsAngles, index);
                 });
             };
             var renderMinorGraduations = function (majorGraduationsAngles, indexMajor) {
                 var minorGraduationsAngles = [];

                 if (indexMajor > 0) {
                     var minScale = majorGraduationsAngles[indexMajor - 1];
                     var maxScale = majorGraduationsAngles[indexMajor];
                     var scaleRange = maxScale - minScale;

                     for (var i = 1; i < minorGraduations; i++) {
                         var scaleValue = minScale + i * scaleRange / minorGraduations;
                         minorGraduationsAngles.push(scaleValue);
                     }

                     var centerX = view.width / 2;
                     var centerY = view.width / 2;
                     //Render Minor Graduations
                     minorGraduationsAngles.forEach(function (pValue, indexMinor) {
                         var cos1Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLength));
                         var sin1Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - minorGraduationLength));
                         var cos2Adj = Math.round(Math.cos((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                         var sin2Adj = Math.round(Math.sin((90 - pValue) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop));
                         var x1 = centerX + cos1Adj;
                         var y1 = centerY + sin1Adj * -1;
                         var x2 = centerX + cos2Adj;
                         var y2 = centerY + sin2Adj * -1;
                         svg.append("svg:line")
                         .attr("x1", x1)
                         .attr("y1", y1)
                         .attr("x2", x2)
                         .attr("y2", y2)
                         .style("stroke", minorGraduationColor);
                     });
                 }
             };
             var getMajorGraduationValues = function (pMinLimit, pMaxLimit, pPrecision) {
                 var scaleRange = pMaxLimit - pMinLimit;
                 var majorGraduationValues = [];
                 for (var i = 0; i <= majorGraduations; i++) {
                     var scaleValue = pMinLimit + i * scaleRange / (majorGraduations);
                     majorGraduationValues.push(scaleValue.toFixed(pPrecision));
                 }

                 return majorGraduationValues;
             };
             var getMajorGraduationAngles = function () {
                 var scaleRange = 2 * gaugeAngle;
                 var minScale = -1 * gaugeAngle;
                 var graduationsAngles = [];
                 for (var i = 0; i <= majorGraduations; i++) {
                     var scaleValue = minScale + i * scaleRange / (majorGraduations);
                     graduationsAngles.push(scaleValue);
                 }

                 return graduationsAngles;
             };
             var getNewAngle = function(pValue) {
                 var scale = d3.scale.linear().range([0, 1]).domain([minLimit, maxLimit]);
                 var ratio = scale(pValue);
                 var scaleRange = 2 * gaugeAngle;
                 var minScale = -1 * gaugeAngle;
                 var newAngle = minScale + (ratio * scaleRange);
                 return newAngle;
             };
             var renderMajorGraduationTexts = function (majorGraduationsAngles, majorGraduationValues, pValueUnit) {
                 if (!ranges) return;

                 var centerX = view.width / 2;
                 var centerY = view.width / 2;
                 var textVerticalPadding = 5;
                 var textHorizontalPadding = 5;

                 var lastGraduationValue = majorGraduationValues[majorGraduationValues.length - 1];
                 var textSize = isNaN(majorGraduationTextSize) ? (view.width * 12) / 300 : majorGraduationTextSize;
                 var fontStyle = textSize + "px Courier";

                 var dummyText = svg.append("text")
                     .attr("x", centerX)
                     .attr("y", centerY)
                     .attr("fill", "transparent")
                     .attr("text-anchor", "middle")
                     .style("font", fontStyle)
                     .text(lastGraduationValue + pValueUnit);

                 var textWidth = dummyText.node().getBBox().width;

                 for (var i = 0; i < majorGraduationsAngles.length; i++) {
                     var angle = majorGraduationsAngles[i];
                     var cos1Adj = Math.round(Math.cos((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength - textHorizontalPadding));
                     var sin1Adj = Math.round(Math.sin((90 - angle) * Math.PI / 180) * (innerRadius - majorGraduationMarginTop - majorGraduationLength - textVerticalPadding));

                     var sin1Factor = 1;
                     if (sin1Adj < 0) sin1Factor = 1.1;
                     if (sin1Adj > 0) sin1Factor = 0.9;
                     if (cos1Adj > 0) {
                         if (angle > 0 && angle < 45) {
                             cos1Adj -= textWidth / 2;
                         } else {
                             cos1Adj -= textWidth;
                         }
                     }
                     if (cos1Adj < 0) {
                         if (angle < 0 && angle > -45) {
                             cos1Adj -= textWidth / 2;
                         }
                     }
                     if (cos1Adj == 0) {
                         cos1Adj -= angle == 0 ? textWidth / 4 : textWidth / 2;
                     }

                     var x1 = centerX + cos1Adj;
                     var y1 = centerY + sin1Adj * sin1Factor * -1;

                     svg.append("text")
                     .attr("class", "mtt-majorGraduationText")
                     .style("font", fontStyle)
                     .attr("text-align", "center")
                     .attr("x", x1)
                     .attr("dy", y1)
                     .attr("fill", majorGraduationTextColor)
                     .text(majorGraduationValues[i] + pValueUnit);
                 }
             };
             var renderGraduationNeedle = function (value, valueUnit, precision, minLimit, maxLimit) {
                 svg.selectAll('.mtt-graduation-needle').remove();
                 svg.selectAll('.mtt-graduationValueText').remove();
                 svg.selectAll('.mtt-graduation-needle-center').remove();
                 
                 var centerX = view.width / 2;
                 var centerY = view.width / 2;
                 var centerColor;

                 if (typeof value === 'undefined') {
                     centerColor = inactiveColor;
                 } else {
                     centerColor = needleColor;
                     var needleAngle = getNewAngle(value);
                     var needleLen = innerRadius - majorGraduationLength - majorGraduationMarginTop;
                     var needleRadius = (view.width * 2.5) / 300;
                     var textSize = isNaN(needleValueTextSize) ? (view.width * 12) / 300 : needleValueTextSize;
                     var fontStyle = textSize + "px Courier";

                     if (value >= minLimit && value <= maxLimit) {
                         var lineData = [
                            [needleRadius, 0],
                            [0, -needleLen],
                            [-needleRadius, 0],
                            [needleRadius, 0]
                         ];
                         var pointerLine = d3.svg.line().interpolate('monotone');
                         var pg = svg.append('g').data([lineData])
                                     .attr('class', 'mtt-graduation-needle')
                                     .style("fill", needleColor)
                                     .attr('transform', 'translate(' + centerX + ',' + centerY + ')');
                         needle = pg.append('path')
                                    .attr('d', pointerLine)
                                    .attr('transform', 'rotate('+needleAngle+')');
                     }

                     svg.append("text")
                         .attr("x", centerX)
                         .attr("y", centerY + valueVerticalOffset)
                         .attr("class", "mtt-graduationValueText")
                         .attr("fill", needleColor)
                         .attr("text-anchor", "middle")
                         .attr("font-weight", "bold")
                         .style("font", fontStyle)
                         .text('[ ' + value.toFixed(precision) + valueUnit + ' ]');
                 }

                 var circleRadius = (view.width * 6) / 300;

                 svg.append("circle")
                   .attr("r", circleRadius)
                   .attr("cy", centerX)
                   .attr("cx", centerY)
                   .attr("fill", centerColor)
                   .attr("class", "mtt-graduation-needle-center");
             };
             $window.onresize = function () {
                 scope.$apply();
             };
             scope.$watch(function () {
                 return angular.element($window)[0].innerWidth;
             }, function () {
                 scope.render();
             });

             /* Colin Bester
                Removed watching of data.value as couldn't see reason for this, plus it's the cause of flicker when using
                data=option mode of using directive.
                I'm assuming that calling render function is not what was intended on every value update.
             */
             // scope.$watchCollection('[ranges, data.ranges, data.value]', function () {
             scope.$watchCollection('[ranges, data.ranges]', function () {
                 scope.render();
             }, true);


             scope.render = function () {
                 updateInternalData();
                 svg.selectAll('*').remove();
                 if (renderTimeout) clearTimeout(renderTimeout);

                 renderTimeout = $timeout(function () {
                     var d3DataSource = [];

                     if (typeof ranges === 'undefined') {
                         d3DataSource.push([minLimit, maxLimit, inactiveColor]);
                     } else {
                         //Data Generation
                         ranges.forEach(function (pValue, index) {
                             d3DataSource.push([pValue.min, pValue.max, pValue.color]);
                         });
                     }

                     //Render Gauge Color Area
                     var translate = "translate(" + view.width / 2 + "," + view.width / 2 + ")";
                     var cScale = d3.scale.linear().domain([minLimit, maxLimit]).range([-1 * gaugeAngle * (Math.PI / 180), gaugeAngle * (Math.PI / 180)]);
                     var arc = d3.svg.arc()
                         .innerRadius(innerRadius)
                         .outerRadius(outerRadius)
                         .startAngle(function (d) { return cScale(d[0]); })
                         .endAngle(function (d) { return cScale(d[1]); });
                     svg.selectAll("path")
                         .data(d3DataSource)
                         .enter()
                         .append("path")
                         .attr("d", arc)
                         .style("fill", function (d) { return d[2]; })
                         .attr("transform", translate);

                     var majorGraduationsAngles = getMajorGraduationAngles();
                     var majorGraduationValues = getMajorGraduationValues(minLimit, maxLimit, majorGraduationPrecision);
                     renderMajorGraduations(majorGraduationsAngles);
                     renderMajorGraduationTexts(majorGraduationsAngles, majorGraduationValues, valueUnit);
                     renderGraduationNeedle(value, valueUnit, precision, minLimit, maxLimit);
                     initialized = true;
                 }, 200);

             };
             var onValueChanged = function(pValue, pPrecision, pValueUnit) {
                 if (typeof pValue === 'undefined' || pValue == null) return;
                 
                 if (needle && pValue >= minLimit && pValue <= maxLimit) {
                        var needleAngle = getNewAngle(pValue);
                        needle.transition()
                            .duration(transitionMs)
                            .ease('elastic')
                            .attr('transform', 'rotate('+needleAngle+')');
                        svg.selectAll('.mtt-graduationValueText')
                        .text('[ ' + pValue.toFixed(pPrecision) + pValueUnit + ' ]') ;
                    } else {
                        svg.selectAll('.mtt-graduation-needle').remove();
                        svg.selectAll('.mtt-graduationValueText').remove();
                        svg.selectAll('.mtt-graduation-needle-center').attr("fill", inactiveColor);
                    }
             };
             scope.$watchCollection('[value, data.value]', function () {
                 if (!initialized) return;
                 updateInternalData();
                 onValueChanged(value, precision, valueUnit);
             }, true);
         }
     };
 }]);

angular.module('finatwork').factory('NotifyingService', function($rootScope) {
    return {
        subscribe: function(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
        },

        notify: function(msg) {
          //console.log(4,msg);
            $rootScope.$emit('notifying-service-event', msg);
        }
    };
});

angular.module('finatwork').directive('bubbleChart', ['$compile','NotifyingService', function($compile, NotifyingService) {
  
  var _NotifyingService = NotifyingService;
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      chartData: '='
    },
    link: function(scope, elem, attrs, shared) {
      scope.$watch('chartData', function(newValue, oldValue) {
        console.info('new data comes to directive');
        console.info(newValue);
        if (newValue) {
          scope.drawChart(newValue);
        }
      });

      scope.drawChart = function(rootData) {

        var diameter = 500,
          format = d3.format(",d"),
          color = d3.scale.category20c();

        var bubble = d3.layout.pack()
          .sort(null)
          .size([diameter, diameter])
          .value(function(d) {
            return (d.numberOfLink + 1);
          })
          .padding(1.5);

        var svg = d3.select("#bubbleChart").append("svg")
          .attr("width", 600)
          .attr("height", diameter)
          .attr("class", "bubble");

        var filt = svg.append("defs")
          .append("filter")
          .attr({
            id: "f1",
            x: 0,
            y: 0,
            width: "200%",
            height: "200%"
          });
        filt.append("feOffset").attr({
          result: "offOut",
          "in": "sourceAlpha",
          dx: 10,
          dy: 10
        });
        filt.append("feGaussianBlur").attr({
          result: "blurOut",
          "in": "offOut",
          stdDeviation: 10
        });
        var feMerge = filt.append("feMerge");
        feMerge.append("feMergeNode").attr("in", "offsetBlur");
        feMerge.append("feMergeNode").attr("in", "SourceGraphic");

        var node = svg.selectAll(".node")
          .data(bubble.nodes(classes(rootData))
            .filter(function(d) {
              return !d.children;
            }))
          .enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d) {
            return "translate(" + d.x + "," + d.y + ")";
          });

        node.append("title")
          .text(function(d) {
            return d.className + ": " + format(d.value);
          });

        node.append("circle")
          .attr("r", function(d) {
			//console.log("Radius"+d.r);
			var random = Math.floor(Math.random() * 9) + 1 ;
            return random * 10;
          })
          .style("fill", function(d) {
            return "red";
          });
        node.append("text")
          .attr("dy", ".3em")
          .style("text-anchor", "middle")
          .text(function(d) {
            return d.className.substring(0, d.r / 3);
          });
  
        node.on("click", click);
        function click(d) {
          _NotifyingService.notify(d);
          }
                
        // Returns a flattened hierarchy containing all leaf nodes under the root.
        function classes(root) {
          var classes = [];

          function recurse(name, node) {
            if (node.children) node.children.forEach(function(child) {
              recurse(node.name, child);
            });
            else classes.push({
              packageName: name,
              className: node.name,
              value: node.numberOfLink,
              idProjet: node.projectId,
              numberOfLink: node.numberOfLink,
              priority: node.priority
            });
          }

          recurse(null, root);
          return {
            children: classes
          };
        }
        d3.select(self.frameElement).style("height", diameter + "px");
      };


      if (typeof scope.chartData != "undefined") {
        //scope.drawChart(scope.chartData);
      }
    }
  };
}]);
angular.module('finatwork').directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };
}]);
angular.module('finatwork').directive('aDisabled', function() {
    return {
        compile: function(tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")";

            //Toggle "disabled" to class when aDisabled becomes true
            return function (scope, iElement, iAttrs) {
                scope.$watch(iAttrs["aDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function(e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});

