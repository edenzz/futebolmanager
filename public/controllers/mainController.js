futebolManager.controller('mainController', ['$scope', '$http', '$filter', '$location', mainController]);

	
function mainController($scope, $http, $filter, $location) {
	
	// when landing on the page, get all jogos and show them
	$http.get('/api/jogos')
		.success(function(data) {
			$scope.jogos = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
	$scope.formData = {
		'data':  new Date(),
	};
	
	function clone(obj) {
		if (null == obj || "object" != typeof obj) return obj;
		var copy = obj.constructor();
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
		}
		return copy;
	}
	
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

	// when submitting the add form, send the text to the node API
	$scope.createTodo = function() {
		
		// Deep copy
		var postData = clone($scope.formData);
		var datefilter = $filter('date');
		var data = datefilter($scope.formData.data, 'dd-MM-yyyy');
		postData.data = data;
		
		$http.post('/api/jogos', postData)
			.success(function(data) {
				$scope.formData = {
					'data':  new Date(),
				}; // clear the form so our user is ready to enter another
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
	
	
	$scope.loadGameDetails = function (id) {
        $location.path('/gameDetails/').search({'id': id});
	};


}


