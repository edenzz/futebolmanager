futebolManager.controller('gameDetailsController', ['$scope', '$location', '$routeParams', gameDetailsController]);

function gameDetailsController($scope, $location, $routeParams) 
{
   $scope.gameDetailsId = $routeParams.id;
    
};