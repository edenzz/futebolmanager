futebolManager.controller('navController', ['$scope', '$location', navController]);

function navController($scope, $location) 
{
  $scope.navClass = function (page) {
	var currentRoute = $location.path().substring(1) || 'home';
	return page === currentRoute ? 'active' : '';
  };
  
  $scope.loadHome = function () {
        $location.url('/home');
	};
    
      $scope.loadAbout = function () {
        $location.url('/about');
    };
    
      $scope.loadContact = function () {
        $location.url('/contact');
    };
    
};