'use strict';

angular.module('expence.project', ['ngResource', 'ui.router', 'expence.root'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $stateProvider
      .state('root.project', {
        url: '',
        views: {
          'projects@': {
            templateUrl: 'views/project/root.list.html',
            controller: 'project.root.list'
          },
        }      
      })             
      .state('root.project_edit', {
        url: '/project/edit',
        views: {
          projects: {
            templateUrl: 'views/project/root.edit.html',
            controller: 'project.root.edit'
          },
        }      
      })             
    ;
    
  }])

  .controller('project.root.list', ['$scope', '$state', 'User', 'currentUser', function($scope, $state, User, currentUser) {
    console.log(123);
    
  }])

  .controller('project.root.add', ['$scope', '$state', 'User', 'currentUser', function($scope, $state, User, currentUser) {

    
  }])

  .factory('projects', function(){
    return { };
  })

;