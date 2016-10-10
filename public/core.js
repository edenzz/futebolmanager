var futebolManager = angular.module('futebolManager', ['ngRoute', 'ui.bootstrap']);

futebolManager.config(function ($routeProvider, $locationProvider, $httpProvider) {

    $routeProvider.when('/home',
    {
      templateUrl:    'views/home.html',
      controller:     'mainController'
    });
    $routeProvider.when('/about',
    {
      controller:     'aboutController'
    });
    $routeProvider.otherwise(
    {
      redirectTo:     '/home',
      controller:     'mainController', 
    });
});