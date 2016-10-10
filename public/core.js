// var futebolManager = angular.module('futebolManager', []);

var futebolManager = angular.module('futebolManager', ['ui.bootstrap'])
	.controller('mainController', ['$scope', '$http' , mainController]);

function mainController($scope, $http) {
		$scope.formData = {};
	
	// DATA - START

	$scope.dateOptions = {
		dateDisabled: disabled,
		formatYear: 'yy',
		maxDate: new Date(2020, 5, 22),
		minDate: new Date(),
		startingDay: 1
	};

	  // Disable weekend selection
	function disabled(data) {
		var date = data.date,
		mode = data.mode;
		return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
	}


	$scope.open1 = function() {
		$scope.popup1.opened = true;
	};



	$scope.popup1 = {
		opened: false
	};
  
	// DATA - END
	
	
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


