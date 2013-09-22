'use strict';

angular.module('expence.root', ['ngResource', 'ngCookies', 'ui.router', 'ui.bootstrap'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root', {
        url: '',
        abstract: true,
        views: {
          '': {
            templateUrl: 'views/index.html',
            controller: 'root', 
          },
        }      
      })

      .state('root.index', {
        url: '/dashboard',
        views: {
          'projects': {
            templateUrl: 'views/project/root.index.list.html',
            controller: 'root.index.project.list', 
          },
          'accounts': {
            templateUrl: 'views/account/root.index.list.html',
            controller: 'root.index.account.list', 
          },
        }     
      })

      ;
      
      $urlRouterProvider.when('', '/dashboard');             
  }])
  
  .controller('root', ['$scope', '$state', '$stateParams', 'currentUser', function($scope, $state, $stateParams, currentUser) {
    $scope.currentUser = currentUser;
    $scope.$state = $state;
    $state.go('root.index');
  }])

;