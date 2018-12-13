'use strict';

const pages = '/app/assets/pages';

angular.module('backbone_app', ['ngRoute', 'chart.js'])
.config(function($routeProvider) {
	$routeProvider.when('/', {
		templateUrl: `${pages}/main.html`,
		controller: 'main_ctrl'
	}).otherwise({redirectTo: '/'});
})
// .service('dogs_svc', function() {
// 	let self = this;
// 	self.breed = 'labradoodle';
// 	self.name = 'banjo jones';
//     console.log('asfsadfsd');
// })
.controller('main_ctrl', ['$scope', function ($scope) {
	$scope.loaded = true;
}])
.controller('sanity_check_ctrl', ['$scope', function ($scope) {
	$scope.loaded = true;
}])
.controller("line_controller", ['$scope', function ($scope) {
  $scope.foo = 'working';

  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };
  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
  $scope.options = {
    scales: {
      yAxes: [
        {
          id: 'y-axis-1',
          type: 'linear',
          display: true,
          position: 'left'
        },
        {
          id: 'y-axis-2',
          type: 'linear',
          display: true,
          position: 'right'
        }
      ]
    }
  };
}]);
