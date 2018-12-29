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
.controller("line_controller", ['$scope', '$http', function ($scope, $http) {
    $scope.foo = 'working';

    $http.get("https://posturetracking.com/posture_records/4edd40c86762e0da120a0003/1/1/1")
    .then((response) => {
        const minutes_per_hour = response.data[0].minutes_per_hour;

        $scope.labels = Array.from(Array(24).keys()).map( (n) => {
            if (n === 0) return '12 am';
            else if (n < 12) return `${n} am`;
            else if (n === 12) return '12 pm';
            return `${n-12} pm`;
        });
        $scope.series = ['Upright Minutes'];
        $scope.data = [ minutes_per_hour ];

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
