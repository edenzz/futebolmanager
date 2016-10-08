var futebolManager = angular.module('futebolManager', []);

function mainController($scope, $http) {
	$scope.formData = {};

	// when landing on the page, get all jogos and show them
	$http.get('/api/jogos')
		.success(function(data) {
			$scope.jogos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		$http.post('/api/jogos', $scope.formData)
			.success(function(data) {
				$scope.formData = {}; // clear the form so our user is ready to enter another
				$scope.jogos = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

	// delete a todo after checking it
	$scope.deleteTodo = function(id) {
		$http.delete('/api/jogos/' + id)
			.success(function(data) {
				$scope.jogos = data;
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
	};

}
