'use strict';

angular.module('expence.root', ['ngResource', 'ngCookies', 'ui.router', 'ui.bootstrap'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root', {
        url: '',
        views: {
          '': {
            templateUrl: 'views/index.html',
            controller: 'root.index', 
          },
        }      
      })

      ;             
  }])
  
  .controller('root.index', ['$scope', '$state', 'currentUser', function($scope, $state, currentUser) {
    $scope.currentUser = currentUser;  
    
  }])

;