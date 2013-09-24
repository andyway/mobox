'use strict';

angular.module('expence.category', ['ngResource', 'ui.router', 'expence.project'])
  
  .config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    
  }])

  .factory('Category', function($resource){
    return $resource('/categories/:id', {}, {
      login: { method:'POST', params: { id: '@id' } },
      create: { method:'PUT' },
    });
  })
  
  .controller('project.category.list', ['$scope', '$state', function($scope, $state) {
    console.log('categories');
  }])


;