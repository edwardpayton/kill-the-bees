'use strict';

// Declare app level module which depends on views, and components
angular.module('KillTheBees', [
  'ngRoute',
  'KillTheBees.welcome',
  'KillTheBees.game'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/welcome'});
}]);
