'use strict';

angular.module('expence.root', ['ngResource', 'ngCookies', 'ui.router'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root', {
        url: '',
        template: '<h1>Welcome, {{ currentUser.name }}!</h1><a href="/users/logout">Logout</a>',
        controller: 'root.index', 
      });
  }])
  
  .controller('root.index', ['$scope', '$state', 'currentUser', function($scope, $state, currentUser) {
    $scope.currentUser = currentUser;  
    
  }])

;