var app = angular.module("app", ["checklist-model"]);

// links: http://plnkr.co/edit/3YNLsyoG4PIBW6Kj7dRK?p=preview
// links: http://stackoverflow.com/questions/14514461/how-can-angularjs-bind-to-list-of-checkbox-values

//not used now!
app.controller('Ctrl2', function($scope) {
			  $scope.roles = [
				{id: 1, text: 'guest'},
				{id: 2, text: 'user'},
				{id: 3, text: 'customer'},
				{id: 4, text: 'admin'}
			  ];
			  $scope.user = {
				roles: [2, 4]
			  };
			  $scope.checkAll = function() {
				$scope.user.roles = $scope.roles.map(function(item) { return item.id; });
			  };
			  $scope.uncheckAll = function() {
				$scope.user.roles = [];
			  };
			  $scope.checkFirst = function() {
				$scope.user.roles.splice(0, $scope.user.roles.length); 
				$scope.user.roles.push(1);
			  };
			});