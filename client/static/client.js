'use strict';

const pages = '/static';

angular.module('backbone_app', ['ngRoute', 'chart.js'])
.config(function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: `${pages}/main.html`,
        controller: 'main_ctrl'
    }).otherwise({redirectTo: '/'});
})
.controller('main_ctrl', ['$scope', function ($scope) {
    $scope.loaded = true;
}])
.controller('sanity_check_ctrl', ['$scope', function ($scope) {
    $scope.loaded = true;
}])
.controller("line_controller", ['$scope', function ($scope) {
    $scope.foo = 'working';

    const hours_per_day = 24;
    const upright_minutes = new Array(hours_per_day).fill(null).map(_=> Math.floor(Math.random() * 60));

    $scope.labels = Array.from(Array(hours_per_day).keys()).map( (n) => {
        if (n === 0) return '12 am';
        else if (n < 12) return `${n} am`;
        else if (n === 12) return '12 pm';
        return `${n-12} pm`;
    });
    $scope.series = ['Upright Minutses'];
    $scope.data = [ upright_minutes ];

    $scope.onClick = function (points, evt) {
        console.log(points, evt);
    };
    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
    $scope.options = {
        scales: {
            yAxes: [
            {
                id: 'y-axis-1',
                type: 'linear',
                display: true,
                position: 'left'
            }
        ]
    }
  };
}]);
