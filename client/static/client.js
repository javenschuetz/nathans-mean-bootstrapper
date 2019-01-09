'use strict';

const pages = '/static';

angular.module('app', ['ngRoute', 'chart.js'])
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
.controller("line_controller", ['$scope', '$http', function ($scope, $http) {
    $scope.foo = 'working';

    // good to know that the domain defaults to the origin!
    $http.get("/data_records/4edd40c86762e0da120a0003/1/1/1")
    .then((response) => {
        const events_per_hour = response.data[0].events_per_hour;

        $scope.labels = Array.from(Array(24).keys()).map( (n) => {
            if (n === 0) return '12 am';
            else if (n < 12) return `${n} am`;
            else if (n === 12) return '12 pm';
            return `${n-12} pm`;
        });
        $scope.series = ['Events'];
        $scope.data = [ events_per_hour ];

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
        }
    })
    .catch(err => console.error(err));
}]);
