futebolManager.controller('gameDetailsController', ['$scope', '$location', '$routeParams', '$http', gameDetailsController]);

function gameDetailsController($scope, $location, $routeParams, $http) 
{
	$scope.gameDetailsId = $routeParams.id;
	
	// when landing on the page, get all jogos and show them
	$http.get('/api/jogos/detalhesJogo?id=' + $scope.gameDetailsId)
		.success(function(data) {
			$scope.jogo = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
	});
	
   
    

     
};