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

