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