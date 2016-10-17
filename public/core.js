var futebolManager = angular.module('futebolManager', 
								    ['ngRoute', 
								 	 'ui.bootstrap', 
									 'ui.uploader', 
									 'ngCookies',
									 'ngResource',
									 'ngSanitize',
									 'btford.socket-io']).value('nickName', 'anonymous');

futebolManager.config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.when('/home',
    {
      templateUrl:    'views/home.html',
      controller:     'mainController'
    });
    $routeProvider.when('/about',
    {
      templateUrl:    'views/about.html',
      controller:     'aboutController'
    });
	$routeProvider.when('/gameDetails',
    {
      templateUrl:    'views/gameDetails.html',
      controller:     'gameDetailsController'
    });
    $routeProvider.otherwise(
    {
      redirectTo:     '/home',
      controller:     'mainController', 
    });
});