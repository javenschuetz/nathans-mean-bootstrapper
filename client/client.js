'use strict';

const pages = '/app/assets/pages';

angular.module('backbone_app', ['ngRoute'])
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
.controller('main_ctrl', ['$scope', ($scope) => {
	$scope.loaded = true;
}])
.controller('sanity_check_ctrl', ['$scope', ($scope) => {
	$scope.loaded = true;
}]);
